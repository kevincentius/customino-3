import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { FieldTags } from "@shared/game/engine/model/rule/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/field-type";
import { floatRangeValidator, intRangeValidator } from "@shared/game/engine/model/rule/field-validators";

const fieldPathPrefix = 'sonicDropEffect.';
const fieldNamePrefix = 'Sonic drop FX: ';
const fieldDefaultTags = [
  FieldTags.VISUAL,
  FieldTags.SONIC_DROP_EFFECTS,
];

export const sonicDropEffectRuleFields: PlayerRuleField[] = [
  {
    property: 'duration',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 400,
    stepSize: 50,
    validators: [ intRangeValidator(50, 3000) ],

    name: 'effect duration',
    description: 'How long the sonic drop after effect animation stays visible.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'decay',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 2,
    stepSize: 0.1,
    validators: [ floatRangeValidator(-5, 5) ],

    name: 'effect decay',
    description: 'How quickly the effect fades and shrinks away.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleCount',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    validators: [ intRangeValidator(1, 100) ],

    name: 'particle count',
    description: 'How many dropping particles are generated per column.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleOpacity',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 0.3,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0.05, 1) ],

    name: 'particle opacity',
    description: 'How transparent the dropping particles are. 1 means completely visible and 0 means completely transparent.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleScale',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 0.2,
    stepSize: 0.05,
    validators: [ floatRangeValidator(0.05, 1) ],

    name: 'particle size',
    description: 'The size of the dropping particles.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleDuration',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1500,
    stepSize: 100,
    validators: [ intRangeValidator(100, 10000) ],

    name: 'particle duration',
    description: 'How long the dropping particles stay on the screen. Shorter duration means faster fade out.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleSpeed',
    fieldType: FieldType.NUMBER_SCROLL,
    default: -50,
    stepSize: 50,
    validators: [ intRangeValidator(-1000, 1000) ],

    name: 'particle speed',
    description: 'How fast the dropping particles move. Negative value means it moves upwards instead.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleMaxAngle',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    stepSize: 1,
    validators: [ intRangeValidator(0, 90) ],

    name: 'particle angle',
    description: 'Random angle for the movement of each particle. Bigger angle makes the particle disperse away from each other while smaller angle keeps them moving in parallel.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleSaturation',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0.1, 5) ],

    name: 'particle saturation',
    description: 'How colorful the particles are. 0 means black and white, 1 means original saturation.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'particleBrightness',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0.1, 5) ],

    name: 'particle brightness',
    description: 'How bright the dropping particles are. 0 means completely black, 1 means original brightness.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'comboCap',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    stepSize: 1,
    validators: [ intRangeValidator(1, 20) ],

    name: 'combo cap',
    description: 'The minimum combo level required to achieve maximum effect from the combo-related effect modifiers.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'comboBrightnessMultiplier',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 4,
    stepSize: 0.1,
    validators: [ floatRangeValidator(1, 10) ],

    name: 'combo brightness multiplier',
    description: 'How much combo affects the brightness of the sonic drop effect. The actual multiplier grows gradually up to this value when the player is performing a combo.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'comboDurationMultiplier',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 4,
    stepSize: 0.1,
    validators: [ floatRangeValidator(1, 10) ],

    name: 'combo duration multiplier',
    description: 'How much combo affects the sonic drop after effect animation. The actual multiplier grows gradually up to this value when the player is performing a combo.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
];

sonicDropEffectRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
