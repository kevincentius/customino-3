import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { LockIntermediateResult } from "@shared/game/engine/player/lock-result";
import { Player } from "@shared/game/engine/player/player";
import { Attack, AttackType } from "@shared/game/network/model/event/server-event";

export class AttackRule {
  private comboTimer!: ComboTimer;

  constructor(
    private player: Player,
  ) {
    if (this.player.playerRule.useComboTimer) {
      this.comboTimer = new ComboTimer(this.player);
    }
  }

  calcAttacks(l: LockIntermediateResult): Attack[] {
    let ret: Attack[] = [];

    // multi clear
    if (l.clearedLines.length > 0) {
      ret.push({
        type: AttackType.HOLE_1,
        power: this.player.playerRule.multiClearAttackTable[Math.max(l.clearedLines.length)],
      });
    }

    if (this.player.playerRule.useComboTimer) {
      const power = this.comboTimer.applyCombo(l);
      if (power > 0) {
        ret.push({
          type: AttackType.HOLE_1,
          power: power,
        });
      }
    }

    return ret;
  }
}
