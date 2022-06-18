import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { LockIntermediateResult } from "@shared/game/engine/player/lock-result";
import { Player } from "@shared/game/engine/player/player";

export class ComboTimer {
  combo = 0;
  comboStartFrame = 0;
  comboAccumulatedFrames = 0;

  constructor(
    private player: Player,
  ) { }

  /**
   *  Returns number of lines that should be sent due to combo (not including other bonuses).
   *  This method must be called on every lock down, even if no lines were cleared,
   *  because there may be time penalty for placing pieces without clearing lines.
   */
  applyCombo(l: LockIntermediateResult): number {
    // reset combo if time runs out
    if (this.player.frame > this.comboStartFrame + this.comboAccumulatedFrames) {
      this.combo = 0;
      this.comboStartFrame = this.player.frame;
      this.comboAccumulatedFrames = 0;
    }

    // increment combo
    const isCombo = l.clearedLines.length > 0;
    if (isCombo) {
      this.combo++;
    }

    // add time bonus/penalty
    const rule = this.player.playerRule;
    const isSpinBonus = false; // TODO: spin bonus
    let timeBonusTable = isSpinBonus ? rule.comboTimerSpinBonus : rule.comboTimerMultiClearBonus;

    let timeBonusMult = rule.comboTimerTimeBonusMultiplierTable[Math.min(rule.comboTimerTimeBonusMultiplierTable.length - 1, this.combo - 1)];
    let timeBonusFlat = timeBonusTable[Math.min(timeBonusTable.length - 1, l.clearedLines.length)];
    let timeBonus = timeBonusFlat > 0 ? timeBonusFlat * timeBonusMult : timeBonusFlat;
    this.comboAccumulatedFrames += timeBonus * gameLoopRule.fps;

    console.log('combo', this.combo);

    // return attack power
    return isCombo ? rule.comboAttackTable[Math.min(rule.comboAttackTable.length - 1, this.combo)] : 0;
  }
}
