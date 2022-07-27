import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { GravityRule } from "@shared/game/engine/model/rule/player-rule/gravity-rule";
import { SonicDropEffectConfig } from "@shared/game/engine/model/rule/player-rule/sonic-drop-effect-config";
import { RotationSystemType } from "@shared/game/engine/player/rotation/rotation-system";

export interface PlayerRule {
  width: number;
  height: number;
  invisibleHeight: number;

  previews: number;
  rotationSystem: RotationSystemType;

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
  multiClearAttackTable: number[];

  gravity: GravityRule;

  sonicDropEffect: SonicDropEffectConfig;
}

export const playerRule: PlayerRule = {
  width: 10,
  height: 18,
  invisibleHeight: 18,

  previews: 1,
  rotationSystem: RotationSystemType.NEAREST,

  gravity: {
    speed: 1,
    cap: 10,
    acceleration: 0,
    lockDelay: 0.5,
  },

  // garbage entry
  garbageSpawnDelayTable: [0, 1],
  garbageSpawnRate: 1,
  lineClearDelaysGarbage: true,
  garbageSpawnCap: 0,

  // garbage blocking
  garbageBlockingFactor: 1,
  garbagePierceFactor: 0,

  // combo timer
  useComboTimer: true,
  comboAttackTable: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
  comboTimerInitial: 2,
  comboTimerMultiClearBonus: [-0.2, 1, 1.4, 1.7, 2],
  comboTimerSpinBonus: [0, 1.5, 2, 2.5],
  comboTimerTimeBonusMultiplierTable: [1, 0.7, 0.5, 0.3, 0.2, 0.1],

  // chain

  // attack rule
  multiClearAttackTable: [0, 0, 1, 2, 4, 6],

  // graphics
  sonicDropEffect: {
    duration: 200,
    decay: 2,

    particleCount: 2,
    particleOpacity: 0.3,
    particleScale: 0.2,
    particleDuration: 1500,
    particleSpeed: 250,
    particleMaxAngle: 10,
    particleBrightness: 1,
    particleSaturation: 1,
    
    comboCap: 10,
    comboBrightnessMultiplier: 4,
    comboDurationMultiplier: 4,
    comboParticleCountMultiplier: 5,
  }
}

export function getField(rule: PlayerRule, field: PlayerRuleField) {
  let obj: any = rule;
  const parts = field.property.split('.');
  for (const part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error();
    }
  }
  return obj;
}

export function setField(rule: PlayerRule, field: PlayerRuleField, value: any) {
  let obj: any = rule;
  const parts = field.property.split('.');
  const property = parts.pop()!;
  for (const part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error();
    }
  }
  obj[property] = value;
}
