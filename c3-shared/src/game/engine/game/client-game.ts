import { Game } from "@shared/game/engine/game/game";
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { StartGameData } from "@shared/game/network/model/start-game-data";

/**
 * In addition to extending Game, this class handles the update loop.
 */
export class ClientGame extends Game {
  private localPlayerIndex: number | null;

  private lastUpdate!: number;
  private mainLoopTimeout: any;

  constructor(startGameData: StartGameData) {
    super();

    this.init(startGameData);
    
    this.localPlayerIndex = startGameData.localPlayerIndex;

    this.gameStartSubject.subscribe(() => this.startUpdateLoop());

    this.gameOverSubject.subscribe(() => {
      console.log('GAME OVER');
      this.stop();
    });
  }
  
  createPlayers(startGameData: StartGameData): Player[] {
    return startGameData.players.map(
      (clientInfo, index) => 
        index == startGameData.localPlayerIndex
          ? new LocalPlayer(this, clientInfo)
          : new RemotePlayer(this, clientInfo));
  }
  
  destroy() {
    this.stop();
  }

  stop() {
    if (this.mainLoopTimeout) {
      clearTimeout(this.mainLoopTimeout);
      this.mainLoopTimeout = null;
      this.running = false;
    }
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
