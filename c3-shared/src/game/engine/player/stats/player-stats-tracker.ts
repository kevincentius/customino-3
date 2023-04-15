import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { Player } from "@shared/game/engine/player/player";
import { PlayerStats } from "@shared/game/engine/player/stats/player-stats";
import { Subject } from "rxjs";

export class PlayerStatsTracker {
  afterPieceLockSubject = new Subject<void>();

  public stats: PlayerStats = {
    activeTime: 0,
    pieces: 0,
    linesCleared: 0,
    garbageLinesCleared: 0,
    digLinesCleared: 0,
    combos: [],
    maxCombo: 0,

    powerGenerated: 0,
    attackGenerated: 0,
    blockGenerated: 0,
    attackReceived: 0,
    attackSpawned: 0,

    afk: false,
  };

  constructor(
    private player: Player
  ) {
    this.player.pieceLockSubject.subscribe(e => {
      this.stats.pieces++;
      this.stats.linesCleared += e.clearedLines.length;
      this.stats.garbageLinesCleared += e.clearedGarbageLines.length;
      this.stats.digLinesCleared += e.clearedDigLines.length;

      const power = e.powers.reduce((sum, x) => sum + x.power, 0);
      const attack = e.attacks.reduce((sum, x) => sum + x.power, 0);
      this.stats.powerGenerated += power;
      this.stats.attackGenerated += attack;
      this.stats.blockGenerated += power - attack;

      this.afterPieceLockSubject.next();
    });

    if (this.player.attackRule.comboTimer) {
      this.player.attackRule.comboTimer.comboEndedSubject.subscribe(e => {
        this.countCombo(e);
      });

      this.player.gameOverSubject.subscribe(() => {
        if (this.player.attackRule.comboTimer!.combo > 0) {
          this.countCombo(this.player.attackRule.comboTimer!.combo);
        }
      });
    }

    this.player.garbageGen.attackReceivedSubject.subscribe(e => {
      this.stats.attackReceived += e.reduce((sum, x) => sum + x.attack.power, 0);
    });

    // attackSpawned
    this.player.garbageGen.garbageRateSpawnSubject.subscribe(() => {
      this.stats.attackSpawned++;
    });
    this.player.garbageGen.partialSpawnSubject.subscribe(e => {
      this.stats.attackSpawned += e;
    });
    this.player.garbageGen.fullSpawnSubject.subscribe(e => {
      this.stats.attackSpawned += e;
    });
  }

  serialize() {
    return JSON.stringify(this.stats);
  }

  load(stats: string) {
    this.stats = JSON.parse(stats);
  }

  runFrame() {
    if (this.player.alive) {
      this.stats.activeTime += gameLoopRule.mspf / 1000;
    }
  }

  private countCombo(combo: number) {
    this.stats.combos.push(combo);
  }
}
