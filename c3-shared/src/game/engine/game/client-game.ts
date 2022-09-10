import { Game } from "@shared/game/engine/game/game";
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { GameState } from "@shared/game/engine/serialization/game-state";
import { ServerEvent } from "@shared/game/network/model/event/server-event";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";
import { Subject } from "rxjs";

/**
 * In addition to extending Game, this class handles the update loop.
 */
export class ClientGame extends Game {
  destroySubject = new Subject<void>();

  private lastUpdate!: number;
  private mainLoopTimeout: any;


  constructor(
    setTimeoutWrapper: (callback: () => void, ms?: number | undefined) => any,
    startGameData: StartGameData,
    private localRule: LocalRule,
    private localPlayerIndex?: number,
  ) {
    super(setTimeoutWrapper);
    this.init(startGameData);
    
    this.clockStartSubject.subscribe(() => this.startUpdateLoop());

    this.gameOverSubject.subscribe(() => {
      console.log('GAME OVER');
      this.stop();
    });
  }
  
  createPlayers(startGameData: StartGameData): Player[] {
    return startGameData.players.map(
      (startPlayerData, index) => 
        index == this.localPlayerIndex
          ? new LocalPlayer(this.setTimeoutWrapper, this, startPlayerData, this.localRule)
          : new RemotePlayer(this, startPlayerData, this.localRule));
  }

  /** The startGameData will be ignored here as it should already be passed in the constructor. */
  load(gameState: GameState) {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].load(gameState.players[i]);
    }

    const ct = Date.now();
    this.clockStartMs = ct - gameState.clockTimeMs;
  }
  
  override destroy() {
    console.log('client game destroy');
    super.destroy();

    this.stop();
    this.destroySubject.next();
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
    console.log('client game start update loop');
    this.stop();
    this.lastUpdate = Date.now();
    this.mainLoopTimeout = this.setTimeoutWrapper(this.updateLoop.bind(this), gameLoopRule.mspf);
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

  handleServerEvent(serverEvent: ServerEvent) {
    for (const playerEvent of serverEvent.playerEvents) {
      if (playerEvent.clientEvent) {
        this.players[playerEvent.playerIndex].handleEvent(playerEvent.clientEvent);
      }

      if (playerEvent.serverEvent?.attackDistributions) {
        for (const attackDistribution of playerEvent.serverEvent.attackDistributions) {
          if (this.players[attackDistribution.playerIndex] instanceof LocalPlayer) {
            (this.players[attackDistribution.playerIndex] as LocalPlayer).recvAttack(attackDistribution);
          }
        }
      }

      if (playerEvent.serverEvent?.disconnect == true) {
        this.players[playerEvent.playerIndex].die();
      }
    }
  }
}
