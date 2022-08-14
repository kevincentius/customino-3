import { DataField } from "@shared/game/engine/model/rule/data-field/data-field"
import { FieldType } from "@shared/game/engine/model/rule/data-field/field-type"
import { intRangeValidator } from "@shared/game/engine/model/rule/data-field/field-validators"

export const soundVolumeField: DataField = {
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

export const musicVolumeField: DataField = {
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

export const glowEffect: DataField = {
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

export const particles: DataField = {
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

export const ghostOpacity: DataField = {
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
