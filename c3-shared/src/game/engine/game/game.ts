import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { GameResult } from "@shared/game/engine/game/game-result";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { ServerPlayer } from "@shared/game/engine/player/server-player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { Subject } from "rxjs";

export class Game {

  // composition
  players: Player[];

  // state
  private localPlayerIndex: number | null;
  running = false;

  private lastUpdate!: number;
  private mainLoopTimeout: any;

  private startMs!: number;

  // event emitters
  gameOverSubject = new Subject<GameResult>();

  constructor(
    startGameData: StartGameData,
    private server=false,
  ) {
    this.localPlayerIndex = startGameData.localPlayerIndex;

    this.players = startGameData.players.map(
      (clientInfo, index) => 
          server ? new ServerPlayer(this, clientInfo)
        : index == startGameData.localPlayerIndex ? new LocalPlayer(this, clientInfo)
        : new RemotePlayer(this, clientInfo));

    this.players.forEach(player => player.gameOverSubject.subscribe(this.checkGameOver.bind(this)));
  }
  
  start() {
    this.running = true;

    if (!this.server) {
      this.startMainLoop();
    }

    this.startMs = Date.now();
  }

  stop() {
    if (this.mainLoopTimeout) {
      clearTimeout(this.mainLoopTimeout);
    }
  }

  update() {
    this.players.forEach(p => p.update());
  }

  startMainLoop() {
    this.stop();
    this.lastUpdate = Date.now();
    this.mainLoopTimeout = setTimeout(this.mainLoop.bind(this), gameLoopRule.mspf);
  }

  mainLoop() {
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
      this.mainLoopTimeout = setTimeout(this.mainLoop.bind(this), sleepTime);
    }
  }
  
  destroy() {
    this.stop();
  }

  checkGameOver() {
    if (this.players.filter(p => p.alive).length <= 1) {
      console.log('GAME OVER');
      clearTimeout(this.mainLoopTimeout);
      this.mainLoopTimeout = null;
      this.running = false;
      this.gameOverSubject.next({
        test: 'test result',
      });
    }
  }

  /** The minimum frame number according to maxDelay. If the game is behind this frame number, it should try to catch up by doing updates faster. */
  getTargetMinFrame() {
    return Math.floor((Date.now() - this.startMs - gameLoopRule.maxDelay) / gameLoopRule.mspf);
  }
}
