import { PlayerRuleField } from "@shared/game/engine/model/rule/field"
import { FieldType } from "@shared/game/engine/model/rule/field-type"
import { intRangeValidator } from "@shared/game/engine/model/rule/field-validators"

export const soundVolumeField: PlayerRuleField = {
  property: 'soundVolume',
  default: 100,
  name: 'Sound volume',
  description: 'Controls how loud sound effects will be. Does not affect music.',
  fieldType: FieldType.NUMBER_SCROLL,
  validators: [ intRangeValidator(0, 100) ],
  stepSize: 5,
  convertFromDisplay: val => val / 100,
  convertToDisplay: val => val * 100,
  tags: [],
}

export const musicVolumeField: PlayerRuleField = {
  property: 'musicVolume',
  default: 100,
  name: 'Music volume',
  description: 'Controls the loudness of musics. Does not affect other sound effects.',
  fieldType: FieldType.NUMBER_SCROLL,
  validators: [ intRangeValidator(0, 100) ],
  stepSize: 5,
  convertFromDisplay: val => val / 100,
  convertToDisplay: val => val * 100,
  tags: [],
}

export const glowEffect: PlayerRuleField = {
  property: 'localGraphics.glowEffect',
  default: true,
  name: 'Glow effects',
  description: 'Glow effect will be shown when at high combos. May heavily affect game performance.',
  fieldType: FieldType.CHOICE,
  choices: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
  tags: [],
}

export const particles: PlayerRuleField = {
  property: 'localGraphics.particles',
  default: true,
  name: 'Particle effects',
  description: 'Particle effects will be shown and will be more intense at high combos. May affect game performance.',
  fieldType: FieldType.CHOICE,
  choices: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
  tags: [],
}

export const ghostOpacity: PlayerRuleField = {
  property: 'localGraphics.ghostOpacity',
  default: true,
  name: 'Ghost opacity',
  description: 'Lower number makes the ghost less visible. 1 makes the ghost as opaque as the actual piece itself, which may be confusing.',
  fieldType: FieldType.NUMBER_SCROLL,
  validators: [ intRangeValidator(0, 100) ],
  stepSize: 5,
  convertFromDisplay: val => val / 100,
  convertToDisplay: val => val * 100,
  tags: [],
}
