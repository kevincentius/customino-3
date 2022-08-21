import { DataField } from "@shared/game/engine/model/rule/data-field/data-field";
import { FieldTags } from "@shared/game/engine/model/rule/data-field/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/data-field/field-type";
import { floatRangeValidator } from "@shared/game/engine/model/rule/data-field/field-validators";
import { yesNoChoice } from "@shared/game/engine/model/rule/data-field/yes-no-choice";

const fieldPathPrefix = 'graphics.';
const fieldNamePrefix = 'Graphics: ';
const fieldDefaultTags = [
  FieldTags.GFX_GLOBAL,
  FieldTags.OVERRIDABLE
];

export const graphicsRuleFields: DataField[] = [
  {
    ...yesNoChoice,
    property: 'pieceGlow',
    default: true,

    name: 'Piece glow',
    description: 'The current piece will glow. Turning this off can considerably improve performance.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'pieceHighlightIntensity',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 1,
    stepSize: 0.05,
    validators: [ floatRangeValidator(0, 1) ],

    name: 'Piece highlight intensity',
    description: 'How visible the highlight animation for the current piece will be.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'chorusIntensity',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 1,
    default: 1,
    stepSize: 0.1,
    validators: [ floatRangeValidator(0, 5) ],

    name: 'Combo glow intensity',
    description: 'The player board will glow when on high combo. Setting this to 0 will disable the glow filter which can considerably improve performance.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    ...yesNoChoice,
    property: 'particles',
    default: true,

    name: 'Enable particles',
    description: 'Controls whether particle effects are allowed in the game. Disabling this may improve performance.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'ghostOpacity',
    fieldType: FieldType.NUMBER_SCROLL,
    decimalPlaces: 2,
    default: 0.5,
    stepSize: 0.05,
    validators: [ floatRangeValidator(0, 1) ],

    name: 'Ghost piece opacity',
    description: 'The ghost/shadow shows where the current piece will land when dropped. This setting controls how transparent the ghost piece is.',
    tags: [
      FieldTags.BASIC,
    ],
  },
];

graphicsRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
