import { setField } from "@shared/game/engine/model/rule/data-field/data-field";
import { GravityRule } from "@shared/game/engine/model/rule/room-rule/gravity-rule";
import { playerRuleFields } from "@shared/game/engine/model/rule/room-rule/player-rule-fields";
import { SonicDropEffectConfig } from "@shared/game/engine/model/rule/room-rule/sonic-drop-effect-config";
import { StarsRule } from "@shared/game/engine/model/rule/room-rule/stars-rule";
import { RotationSystemType } from "@shared/game/engine/player/rotation/rotation-system";

export interface RoomRule {
  width: number;
  height: number;
  invisibleHeight: number;

  previews: number;
  rotationSystem: RotationSystemType;

  gravity: GravityRule;

  countdownMs: number;

  // garbage entry
  garbageSpawnDelayTable: number[];
  garbageSpawnRate: number;
  lineClearDelaysGarbage: boolean;
  garbageSpawnCap: number;
  
  // garbage blocking
  garbageBlockingFactor: number; // the fraction of attack power that will be used for blocking if there are incoming attacks queued.
  garbagePierceFactor: number; // the fraction of attack power that will be sent anyways even if the power has been used up for blocking

  // combo timer
  useComboTimer: boolean;
  comboAttackTable: number[];
  comboTimerInitial: number;
  comboTimerMultiClearBonus: number[];
  comboTimerSpinBonus: number[];
  comboTimerTimeBonusMultiplierTable: number[]; // multiplier is not applied if time bonus is negative (e.g. penalty for not clearing lines)

  // attack rule
  attackSelfIfAlone: boolean;
  multiClearAttackTable: number[];
  stars: StarsRule;
    
  sonicDropEffect: SonicDropEffectConfig;

  // debug
  playerDisplayDupes: number;
}

export function getDefaultRoomRule(): RoomRule {
  const playerRule = {} as RoomRule;
  for (const field of playerRuleFields) {
    setField(playerRule, field, field.default, true);
  }
  return playerRule;
}
