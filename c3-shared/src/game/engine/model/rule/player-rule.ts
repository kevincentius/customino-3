import { RotationSystemType } from "@shared/game/engine/player/rotation/rotation-system";

export interface PlayerRule {
  width: number;
  height: number;
  invisibleHeight: number;

  previews: number;
  rotationSystem: RotationSystemType;

  garbageSpawnDelayTable: number[];
  garbageSpawnRate: number;
  garbageCleanlinessBetween: number;
  garbageCleanlinessWithin: number;

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
  height: 20,
  invisibleHeight: 18,

  previews: 2,
  rotationSystem: RotationSystemType.NEAREST,

  garbageSpawnDelayTable: [0, 1],
  garbageSpawnRate: 1,
  garbageCleanlinessBetween: 0,
  garbageCleanlinessWithin: 100,

  // combo timer
  useComboTimer: true,
  comboAttackTable: [0, 0, 1, 1, 1, 2, 2, 2, 3],
  comboTimerInitial: 1,
  comboTimerMultiClearBonus: [-0.2, 10, 13, 16, 20, 25],
  comboTimerSpinBonus: [0, 1.5, 2, 2.5],
  comboTimerTimeBonusMultiplierTable: [1, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1],

  // chain

  // attack rule
  multiClearAttackTable: [0, 0, 1, 2, 4, 6],
}
