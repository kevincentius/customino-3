import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { GravityRule } from "@shared/game/engine/model/rule/player-rule/gravity-rule";
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
  stars: StarsRule;
    
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
  comboAttackTable: [0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  comboTimerInitial: 2,
  comboTimerMultiClearBonus: [-0.2, 1, 1.4, 1.7, 2],
  comboTimerSpinBonus: [0, 1.5, 2, 2.5],
  comboTimerTimeBonusMultiplierTable: [1, 0.7, 0.5, 0.3, 0.2, 0.1],

  // attack rule
  multiClearAttackTable: [0, 0, 1, 2, 4, 6],

  stars: {
    useStars: true,
    multipliers: [1.0, 1.2, 1.5, 2.0, 3.0, 5.0, 7.0],
    multiplierScalesByProgress: true,

    powerRequired: [25, 35, 45, 65, 100, 200],

    powerDecayPerPiece: true,
    powerDecayPerPieceRate: [0.1, 0.15, 0.2, 0.25, 0.3, 0.3],

    powerDecay: true,
    powerDecayRate: [20, 30, 40, 50, 60, 120],
    powerDecayScalesByProgress: true,
  },

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
    
    comboCap: 12,
    comboBrightnessMultiplier: 4,
    comboDurationMultiplier: 2,
    comboParticleCountMultiplier: 2,
  }
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

export function setField(rule: any, field: PlayerRuleField, value: any) {
  let obj: any = rule;
  const parts = field.property.split('.');
  const property = parts.pop()!;
  for (const part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error();
    }
  }
  obj[property] = field.convertFromDisplay ? field.convertFromDisplay(value) : value;
}
