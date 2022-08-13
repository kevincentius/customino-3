import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { GraphicsRule } from "@shared/game/engine/model/rule/player-rule/graphics-rule";
import { GravityRule } from "@shared/game/engine/model/rule/player-rule/gravity-rule";
import { playerRuleFields } from "@shared/game/engine/model/rule/player-rule/player-rule-fields";
import { SonicDropEffectConfig } from "@shared/game/engine/model/rule/player-rule/sonic-drop-effect-config";
import { StarsRule } from "@shared/game/engine/model/rule/player-rule/stars-rule";
import { RotationSystemType } from "@shared/game/engine/player/rotation/rotation-system";

export interface PlayerRule {
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

  graphics: GraphicsRule;
}

export function getDefaultPlayerRule(): PlayerRule {
  const playerRule = {} as PlayerRule;
  for (const field of playerRuleFields) {
    setField(playerRule, field, field.default, true);
  }
  return playerRule;
}

export function getField(rule: any, field: PlayerRuleField) {
  let obj: any = rule;
  const parts = field.property.split('.');
  for (const part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error();
    }
  }
  return field.convertToDisplay ? field.convertToDisplay(obj) : obj;
}

export function setField(rule: any, field: PlayerRuleField, value: any, objectCreation=false) {
  let obj: any = rule;
  const parts = field.property.split('.');
  const property = parts.pop()!;
  for (const part of parts) {
    if (obj[part] == undefined) {
      if (objectCreation) {
        obj[part] = {};
      } else {
        throw new Error(`Error occurred in PlayerRule binding: ${part} is not found.`);
      }
    }
    obj = obj[part];
  }
  obj[property] = field.convertFromDisplay ? field.convertFromDisplay(value) : value;
}
