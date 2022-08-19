import { DataField } from "@shared/game/engine/model/rule/data-field/data-field";
import { FieldTags } from "@shared/game/engine/model/rule/data-field/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/data-field/field-type";
import { floatRangeValidator } from "@shared/game/engine/model/rule/data-field/field-validators";

const fieldPathPrefix = 'lineClearEffect.';
const fieldNamePrefix = 'Line Clear: ';
const fieldDefaultTags = [
  FieldTags.GFX_VISUAL,
  FieldTags.LINE_CLEAR_EFFECTS,
];

export const lineClearEffectRuleFields: DataField[] = [
  {
    property: 'fallAcceleration',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1.5,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0, 10) ],

    name: 'Fall acceleration',
    description: 'Acceleration of blocks falling down when a line below them has been cleared.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'fallDelay',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 0,
    stepSize: 25,
    validators: [ floatRangeValidator(0, 3000) ],

    name: 'Fall delay',
    description: 'How long it takes before blocks starts falling when a line is clear. Same concent as the infamous "cartoon effect".',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'fallSpreadDelay',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 0,
    stepSize: 10,
    validators: [ floatRangeValidator(0, 1000) ],

    name: 'Fall spread delay',
    description: 'How slow the falling animation spreads horizontally when a line is cleared. A high value may cause the field to be hard to understand while blocks are falling down.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
];

lineClearEffectRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
