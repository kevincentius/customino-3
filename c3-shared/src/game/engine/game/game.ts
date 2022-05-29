import { GameResult } from "@shared/game/engine/game/game-result";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { Subject } from "rxjs";

export class Game {

  // composition
  players: Player[];

  // state
  private localPlayerIndex: number | null;
  running = false;

  lastUpdate!: number;
  mspf = 50;
  maxCatchUpRate = 10;
  mainLoopTimeout: any;

  // event emitters
  gameOverSubject = new Subject<GameResult>();

  constructor(
    startGameData: StartGameData,
  ) {
    this.localPlayerIndex = startGameData.localPlayerIndex;

    this.players = startGameData.players.map(
      (clientInfo, index) => index == startGameData.localPlayerIndex
        ? new LocalPlayer(clientInfo)
        : new RemotePlayer(clientInfo));

    this.players.forEach(player => player.gameOverSubject.subscribe(this.checkGameOver.bind(this)));
  }
  
  start() {
    this.running = true;

    this.startMainLoop();
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
    this.mainLoopTimeout = setTimeout(this.mainLoop.bind(this), this.mspf);
  }

  mainLoop() {
    let updateCount = 0;
    while (Date.now() - this.lastUpdate >= this.mspf) {
      this.lastUpdate += this.mspf;
      this.update();

      updateCount++;
      if (updateCount >= this.maxCatchUpRate) {
        break;
      }
    }

    const sleepTime = Math.max(0, this.lastUpdate + this.mspf - Date.now());
    this.mainLoopTimeout = setTimeout(this.mainLoop.bind(this), sleepTime);
  }
  
  destroy() {
    this.stop();
  }

  checkGameOver() {
    if (this.players.filter(p => p.alive).length <= 1) {
      console.log('GAME OVER');
      clearTimeout(this.mainLoopTimeout);
      this.running = false;
      this.gameOverSubject.next({
        test: 'test result',
      });
    }
  }
}
