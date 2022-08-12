import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { FieldTags } from "@shared/game/engine/model/rule/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/field-type";
import { floatRangeValidator } from "@shared/game/engine/model/rule/field-validators";

const fieldPathPrefix = 'gravity.';
const fieldNamePrefix = 'Gravity: ';
const fieldDefaultTags = [
  FieldTags.GENERAL,
  FieldTags.GRAVITY,
];

export const gravityRuleFields: PlayerRuleField[] = [
  {
    property: 'speed',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0, 1000) ],

    name: 'Speed',
    description: 'How fast the pieces move down on its own, measured in tiles per second.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'cap',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    stepSize: 1,
    validators: [ floatRangeValidator(0, 100) ],

    name: 'Speed limit',
    description: 'Sets a speed limit at which point the gravity will no longer accelerate.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'acceleration',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 0,
    stepSize: 0.01,
    validators: [ floatRangeValidator(0, 1) ],

    name: 'Acceleration',
    description: 'How much the gravity speed increases per second.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'lockDelay',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0, 10) ],

    name: 'Lock delay',
    description: 'How long the piece stays on the ground before it automatically gets locked in place.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
];

gravityRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
