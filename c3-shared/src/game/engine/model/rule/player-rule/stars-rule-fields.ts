import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { FieldTags } from "@shared/game/engine/model/rule/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/field-type";
import { floatRangeValidator, intRangeValidator, listValidator } from "@shared/game/engine/model/rule/field-validators";

const fieldPathPrefix = 'stars.';
const fieldNamePrefix = 'Stars: ';
const fieldDefaultTags = [
  FieldTags.ATTACK,
  FieldTags.STARS,
];

export const starsRuleFields: PlayerRuleField[] = [
  {
    property: 'useStars',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Use stars',
    description: 'Allow players to earn stars (power up) by sending attacks. Blocking counts too.',
    tags: [
      FieldTags.BASIC,
    ],
  },
  {
    property: 'multipliers',
    fieldType: FieldType.NUMBER_LIST,
    default: [1.0, 1.2, 1.4, 1.6, 1.8, 2.0],
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ listValidator(floatRangeValidator(0, 10)) ],
    startIndex: 0,
    
    name: 'Power multipliers',
    description: 'Multiplier for attack power for each star amount. The first value is for players who have no stars yet, the second value for one stars, and so on.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'multiplierScalesByProgress',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Scale muliplier by progress',
    description: 'Multiplier increases gradually towards the next star according to the progress bar instead of jumping value between stars.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerRequired',
    fieldType: FieldType.NUMBER_LIST,
    default: [25, 50, 75, 100, 125],
    stepSize: 5,
    validators: [ listValidator(intRangeValidator(5, 1000)) ],
    startIndex: 0,
    
    name: 'Progress required',
    description: 'How many lines a player must generate (send or block) to reach the next star. Star multiplier does not apply when calculating this progress.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerDecayPerPiece',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Enable progress decay per piece',
    description: 'Controls whether progress to the next star decreases every time a piece is placed down, so the player must use pieces more efficiently to earn each star.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerDecayPerPieceRate',
    fieldType: FieldType.NUMBER_LIST,
    default: [0.1, 0.15, 0.2, 0.25, 0.3],
    decimalPlaces: 2,
    stepSize: 0.01,
    validators: [ listValidator(floatRangeValidator(0, 3)) ],
    startIndex: 0,
    
    name: 'Progress decay per piece',
    description: 'If progress decay is enabled, controls how much progress is removed per piece placed down.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerDecay',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Enable progress decay over time',
    description: 'Controls whether progress to the next star decreases over time, so the player must generate power quickly enough to earn each star.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerDecayRate',
    fieldType: FieldType.NUMBER_LIST,
    default: [20, 30, 40, 50, 60],
    stepSize: 5,
    validators: [ listValidator(intRangeValidator(5, 1000)) ],
    startIndex: 0,
    
    name: 'Progress decay rate',
    description: 'If progress decay is enabled, controls how fast the progress decay, measured in APM.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
  {
    property: 'powerDecayScalesByProgress',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Scale decay by progress',
    description: 'If enabled, the progress decay starts at 0 when the progress is empty instead and gradually increases to the specified value above as the progress becomes full during each star.',
    tags: [
      FieldTags.ADVANCED,
    ],
  },
];

starsRuleFields.forEach(field => {
  field.property = `${fieldPathPrefix}${field.property}`;
  field.name = `${fieldNamePrefix}.${field.name}`;
  field.tags.push(...fieldDefaultTags);
});
