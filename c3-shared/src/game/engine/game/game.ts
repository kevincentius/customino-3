import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { GameResult } from "@shared/game/engine/game/game-result";
import { Player } from "@shared/game/engine/player/player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { Subject } from "rxjs";

export abstract class Game {

  // composition
  players!: Player[];

  // state
  running = false;

  protected startMs!: number;

  // event emitters
  gameStartSubject = new Subject<void>();
  gameOverSubject = new Subject<GameResult>();

  abstract createPlayers(startGameData: StartGameData): Player[];
  abstract destroy(): void;

  init(startGameData: StartGameData) {
    this.players = this.createPlayers(startGameData);
    this.players.forEach(player => player.gameOverSubject.subscribe(this.checkGameOver.bind(this)));
  }
  
  start() {
    this.running = true;

    this.startMs = Date.now();

    this.gameStartSubject.next();
  }

  checkGameOver() {
    if (this.players.filter(p => p.alive).length <= 1) {
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
