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

  // timeouts
  clockStartTimeout: any;

  abstract createPlayers(startGameData: StartGameData): Player[];
  destroy(): void {
    clearTimeout(this.clockStartTimeout);
  };

  constructor(
    protected setTimeoutWrapper: (callback: () => void, ms?: number | undefined) => any = setTimeout,
  ) {}

  init(startGameData: StartGameData) {
    this.startGameData = startGameData;
    this.players = this.createPlayers(startGameData);
    this.players.forEach(player => player.gameOverCheckSubject.subscribe(this.checkGameOver.bind(this)));
  }
  
  start() {
    this.running = true;

    const countdownMs = this.players[0].playerRule.countdownMs;
    if (this.clockStartMs == null) {
      this.clockStartMs = Date.now() + countdownMs;
    }
    this.gameStartSubject.next();
    this.clockStartTimeout = this.setTimeoutWrapper(() => this.startClock(), this.clockStartMs - Date.now());
  }

  protected startClock() {
    this.clockStartSubject.next();
  }

  checkGameOver() {
    const alivePlayers = this.players.filter(p => p.alive);
    const aliveTeams = new Set(alivePlayers.map(p => p.playerRule.team));
    if (alivePlayers.length <= 1 || (aliveTeams.size <= 1 && !aliveTeams.has(null))) {
      this.running = false;

      this.players.filter(p => p.alive).forEach(p => p.win());
      this.gameOverSubject.next({ players: this.createPlayerResults() });
    }
  }

  abort() {
    this.running = false;

    this.gameOverSubject.next({ players: this.createPlayerResults(true) });
  }

  private createPlayerResults(abort=false) {
    const deadPlayers = this.players.filter(p => !p.alive).length;
    const playerResults: PlayerResult[] = new Array(this.players.length)
      .fill(null)
      .map((_, index) => {
        const player = this.players[index];
        if (player.alive) {
          return {
            rank: 0,
            score: abort ? 0 : deadPlayers,
            afk: false,
          };
        } else {
          const worsePlayers = this.players.filter(
            p => p != player
              && !p.alive
              && p.statsTracker.stats.activeTime < player.statsTracker.stats.activeTime
          ).length;
          return {
            rank: abort ? 0 : this.players.length - 1 - worsePlayers,
            score: abort ? 0 : worsePlayers,
            afk: !abort && player.afkFlag,
          };
        }
      });
    return playerResults;
  }

  /** The minimum frame number according to maxDelay. If the game is behind this frame number, it should try to catch up by doing updates faster. */
  getTargetMinFrame() {
    return Math.floor((Date.now() - this.clockStartMs - gameLoopRule.maxDelay) / gameLoopRule.mspf);
  }

  isOnePlayerOnly() {
    return this.players.length == 1;
  }
}
