import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { GameResult, PlayerResult } from "@shared/game/engine/game/game-result";
import { Player } from "@shared/game/engine/player/player";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";
import { Subject } from "rxjs";

export abstract class Game {

  // composition
  players!: Player[];

  // state
  running = false;
  startGameData!: StartGameData;

  clockStartMs!: number;

  // event emitters
  gameStartSubject = new Subject<void>();
  clockStartSubject = new Subject<void>();
  gameOverSubject = new Subject<GameResult>();

  abstract createPlayers(startGameData: StartGameData): Player[];
  abstract destroy(): void;

  init(startGameData: StartGameData) {
    this.startGameData = startGameData;
    this.players = this.createPlayers(startGameData);
    this.players.forEach(player => player.gameOverCheckSubject.subscribe(this.checkGameOver.bind(this)));
  }
  
  start() {
    this.running = true;

    const countdownMs = this.players[0].playerRule.countdownMs;
    this.clockStartMs = Date.now() + countdownMs;
    setTimeout(() => this.clockStartSubject.next(), countdownMs);

    this.gameStartSubject.next();
  }

  checkGameOver() {
    if (this.players.filter(p => p.alive).length <= 1) {
      this.running = false;

      const rankings = new Array(this.players.length)
          .fill(null)
          .map((_, index) => index)
          .sort((a, b) => this.players[b].statsTracker.stats.activeTime - this.players[a].statsTracker.stats.activeTime)

      const deadPlayers = this.players.filter(p => !p.alive).length;
      const playerResults: PlayerResult[] = new Array(this.players.length)
        .fill(null)
        .map((_, index) => {
          const player = this.players[index];
          if (player.alive) {
            return {
              rank: 0,
              score: deadPlayers,
            }
          } else {
            const worsePlayers = this.players.filter(
              p => p != player
              && !p.alive
              && p.statsTracker.stats.activeTime < player.statsTracker.stats.activeTime
            ).length;
            return {
              rank: this.players.length - 1 - worsePlayers,
              score: worsePlayers,
            };
          }
        });

      this.players.filter(p => p.alive).forEach(p => p.win());
      this.gameOverSubject.next({ players: playerResults });
    }
  }

  /** The minimum frame number according to maxDelay. If the game is behind this frame number, it should try to catch up by doing updates faster. */
  getTargetMinFrame() {
    return Math.floor((Date.now() - this.clockStartMs - gameLoopRule.maxDelay) / gameLoopRule.mspf);
  }
}
