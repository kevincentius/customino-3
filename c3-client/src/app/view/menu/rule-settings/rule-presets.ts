
export interface RulePreset {
  name: string;
  description: string;
  json: string;
}

export const rulePresets = [
  {
    name: 'Cultris',
    description: `Single preview with no hold. This game mode focuses on a unique combo system which is based on speed and piece efficiency.`,
    json:`{"globalRule":{"width":10,"height":18,"invisibleHeight":18,"previews":1,"rotationSystem":"nearest","garbageSpawnDelayTable":[0,1],"garbageSpawnRate":1,"lineClearDelaysGarbage":true,"garbageSpawnCap":0,"garbageBlockingFactor":1,"garbagePierceFactor":0,"useComboTimer":true,"comboAttackTable":[0,0,1,1,2,2,3,4,5],"comboTimerInitial":2,"comboTimerMultiClearBonus":[-0.2,1,1.4,1.7,2],"comboTimerSpinBonus":[0,1.5,2,2.5],"comboTimerTimeBonusMultiplierTable":[1,0.7,0.5,0.3,0.2,0.1],"multiClearAttackTable":[0,0,1,2,4,6]}}`,
  },
];
