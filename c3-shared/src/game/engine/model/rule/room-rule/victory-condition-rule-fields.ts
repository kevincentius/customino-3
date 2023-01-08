import { DataField } from "@shared/game/engine/model/rule/data-field/data-field";
import { FieldTags } from "@shared/game/engine/model/rule/data-field/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/data-field/field-type";
import { intRangeValidator } from "@shared/game/engine/model/rule/data-field/field-validators";

const fieldPathPrefix = 'victoryCondition.';
const fieldNamePrefix = 'Victory condition: ';
const fieldDefaultTags = [
  FieldTags.VICTORY_CONDITION,
];

export const victoryConditionRuleFields: DataField[] = [
  {
    property: 'linesCleared',
    fieldType: FieldType.NUMBER,
    default: 0,
    validators: [ intRangeValidator(0, 1000000) ],

    name: 'Lines cleared',
    description: 'Win after clearing the specified amount of lines. 0 disables this victory condition.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'digLinesCleared',
    fieldType: FieldType.NUMBER,
    default: 0,
    validators: [ intRangeValidator(0, 1000000) ],

    name: 'Dig lines',
    description: 'Win after digging the specified amount of garbage lines that will appear on the bottom of the board. 0 disables this victory condition.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'timeElapsed',
    fieldType: FieldType.NUMBER,
    default: 0,
    validators: [ intRangeValidator(0, 1000000) ],

    name: 'Time survived (seconds)',
    description: 'Win automatically after the specified amount of seconds. 0 will disable this victory condition.',
    tags: [
      FieldTags.BASIC,
    ],
  },
];

victoryConditionRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
