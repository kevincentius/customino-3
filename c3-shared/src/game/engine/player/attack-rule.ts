import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { LockPlacementResult } from "@shared/game/engine/player/lock-result";
import { Player } from "@shared/game/engine/player/player";
import { Attack } from "@shared/game/network/model/attack/attack";
import { AttackType } from "@shared/game/network/model/attack/attack-type";

export class AttackRule {
  public comboTimer!: ComboTimer;

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
      this.comboTimer.load(state.comboTimer);
    }
  }

  runFrame() {
    this.comboTimer.runFrame();
  }

  calcAttacks(l: LockPlacementResult): Attack[] {
    let ret: Attack[] = [];

    // multi clear
    if (l.clearedLines.length > 0) {
      const power = this.player.playerRule.multiClearAttackTable[Math.max(l.clearedLines.length)];
      if (power > 0) {
        ret.push({
          type: AttackType.DIRTY_1,
          power: power,
        });
      }
    }

    // combo timer
    if (this.player.playerRule.useComboTimer) {
      const power = this.comboTimer.applyCombo(l);
      if (power > 0) {
        ret.push({
          type: AttackType.DIRTY_1,
          power: power,
        });
      }
    }

    return ret;
  }
}
