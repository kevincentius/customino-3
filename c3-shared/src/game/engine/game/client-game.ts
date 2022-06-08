import { Game } from "@shared/game/engine/game/game";
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { GameState } from "@shared/game/engine/serialization/game-state";
import { StartGameData } from "@shared/game/network/model/start-game-data";

/**
 * In addition to extending Game, this class handles the update loop.
 */
export class ClientGame extends Game {
  private lastUpdate!: number;
  private mainLoopTimeout: any;

  constructor(startGameData: StartGameData, private localPlayerIndex?: number) {
    super();

    this.init(startGameData);
    
    this.gameStartSubject.subscribe(() => this.startUpdateLoop());

    this.gameOverSubject.subscribe(() => {
      console.log('GAME OVER');
      this.stop();
    });
  }
  
  createPlayers(startGameData: StartGameData): Player[] {
    return startGameData.players.map(
      (clientInfo, index) => 
        index == this.localPlayerIndex
          ? new LocalPlayer(this, clientInfo)
          : new RemotePlayer(this, clientInfo));
  }

  /** The startGameData will be ignored here as it should already be passed in the constructor. */
  load(gameState: GameState) {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].load(gameState.players[i]);
    }
  }
  
  destroy() {
    this.stop();
  }

  /** Stops the update loop. Can be used to end or pause the game. */
  stop() {
    if (this.mainLoopTimeout) {
      clearTimeout(this.mainLoopTimeout);
      this.mainLoopTimeout = null;
      this.running = false;
    }
  }

  /** Unpauses the game. Should only be called if the game has been started earlier, because this does not emit the "startGame" signal. */
  resume() {
    this.startUpdateLoop();
  }

  update() {
    this.players.forEach(p => p.alive ? p.update() : null);
  }

  startUpdateLoop() {
    this.stop();
    this.lastUpdate = Date.now();
    this.mainLoopTimeout = setTimeout(this.updateLoop.bind(this), gameLoopRule.mspf);
  }

  updateLoop() {
    let updateCount = 0;
    while (Date.now() - this.lastUpdate >= gameLoopRule.mspf) {
      this.lastUpdate += gameLoopRule.mspf;
      this.update();

      updateCount++;
      if (updateCount >= gameLoopRule.maxCatchUpRate) {
        break;
      }
    }

    const sleepTime = Math.max(0, this.lastUpdate + gameLoopRule.mspf - Date.now());

    if (this.mainLoopTimeout) {
      this.mainLoopTimeout = setTimeout(this.updateLoop.bind(this), sleepTime);
    }
  }
}
