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
}

export const playerRule: PlayerRule = {
  width: 10,
  height: 18,
  invisibleHeight: 18,

  previews: 1,
  rotationSystem: RotationSystemType.NEAREST,

  // garbage entry
  garbageSpawnDelayTable: [0, 1],
  garbageSpawnRate: 1,
  lineClearDelaysGarbage: true,
  garbageSpawnCap: 0,

  // garbage blocking
  garbageBlockingFactor: 0.5,
  garbagePierceFactor: 1,

  // combo timer
  useComboTimer: true,
  comboAttackTable: [0, 0, 1, 1, 1, 2, 2, 2, 3],
  comboTimerInitial: 2,
  comboTimerMultiClearBonus: [-0.2, 1, 1.4, 1.7, 2],
  comboTimerSpinBonus: [0, 1.5, 2, 2.5],
  comboTimerTimeBonusMultiplierTable: [1, 0.7, 0.5, 0.3, 0.2, 0.1],

  // chain

  // attack rule
  multiClearAttackTable: [0, 0, 1, 2, 4, 6],
}
