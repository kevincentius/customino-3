import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { StarsRule } from "@shared/game/engine/model/rule/player-rule/stars-rule";
import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { LockPlacementResult } from "@shared/game/engine/player/lock-result";
import { Player } from "@shared/game/engine/player/player";
import { Attack } from "@shared/game/network/model/attack/attack";
import { AttackType } from "@shared/game/network/model/attack/attack-type";
import { Subject } from "rxjs";

export class AttackRule {
  public comboTimer?: ComboTimer;

  public starsSubject = new Subject<number>();
  private stars = 0;
  private starsProgress = 0;

  constructor(
    private player: Player,
  ) {
    if (this.player.playerRule.useComboTimer) {
      this.comboTimer = new ComboTimer(this.player);
    }
  }

  serialize() {
    return {
      comboTimer: this.comboTimer ? this.comboTimer.serialize() : null,
    };
  }

  load(state: any) {
    if (state.comboTimer) {
      this.comboTimer!.load(state.comboTimer);
    }
  }

  runFrame() {
    if (this.comboTimer) {
      this.comboTimer.runFrame();
    }

    // star progress decay
    const stars = this.player.playerRule.stars;
    if (stars.useStars && stars.powerDecay) {
      let decayAmount = this.arrCap(stars.powerDecayRate, this.stars) / gameLoopRule.fps / 60;
      if (stars.powerDecayScalesByProgress) {
        decayAmount *= this.getStarsProgressFactor();
      }
      this.starsProgress = Math.max(0, this.starsProgress - decayAmount);
    }
  }

  calcAttacks(l: LockPlacementResult): Attack[] {
    let ret: Attack[] = [];

    let totalPowerBeforeStars = 0;
    const stars = this.player.playerRule.stars;
    let starsMultiplier = this.getStarsMultiplier();

    // multi clear
    if (l.clearedLines.length > 0) {
      let power = this.player.playerRule.multiClearAttackTable[Math.max(l.clearedLines.length)];
      totalPowerBeforeStars += power;
      power *= starsMultiplier;

      if (power > 0) {
        ret.push({
          type: AttackType.DIRTY_1,
          power: power,
        });
      }
    }

    // combo timer
    if (this.player.playerRule.useComboTimer) {
      let power = this.comboTimer!.applyCombo(l);
      totalPowerBeforeStars += power;
      power *= starsMultiplier;

      if (power > 0) {
        ret.push({
          type: AttackType.DIRTY_1,
          power: power,
        });
      }
    }

    // star progress and check level up
    if (stars.useStars) {
      this.starsProgress += totalPowerBeforeStars;

      while (this.stars < stars.multipliers.length - 1 && this.starsProgress >= stars.powerRequired[this.stars]) {
        this.stars++;
        this.starsProgress -= stars.powerRequired[this.stars];
        this.starsSubject.next(this.stars);
      }

      if (stars.powerDecayPerPiece) {
        this.starsProgress = Math.max(0, this.starsProgress - stars.powerDecayPerPieceRate[this.stars]);
      }
    }

    return ret;
  }

  getStarsMultiplier() {
    const stars = this.player.playerRule.stars;
    const starsProgress = this.getStarsProgressFactor();
    let starsMultiplier = 1;
    if (stars.useStars) {
      starsMultiplier = stars.multiplierScalesByProgress && this.stars < stars.multipliers.length - 1
        ? starsProgress * stars.multipliers[this.stars + 1] + (1 - starsProgress) * stars.multipliers[this.stars]
        : stars.multipliers[this.stars];
    }
    return starsMultiplier;
  }

  private arrCap<T>(arr: T[], index: number) {
    return arr[Math.min(arr.length - 1, index)];
  }

  public getStarsProgressFactor() {
    const stars = this.player.playerRule.stars;
    return this.stars >= stars.powerRequired.length ? 1 : this.starsProgress / stars.powerRequired[this.stars];
  }
}
