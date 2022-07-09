import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { FieldTags } from "@shared/game/engine/model/rule/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/field-type";
import { floatRangeValidator, intRangeValidator, listValidator } from "@shared/game/engine/model/rule/field-validators";
import { RotationSystemType } from "@shared/game/engine/player/rotation/rotation-system";

export const playerRuleFields: PlayerRuleField[] = [
  {
    property: 'width',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    validators: [ intRangeValidator(4, 100) ],

    name: 'Field width',
    description: 'The number of columns in the field. Wider fields will need more pieces to complete each line.',
    tags: [
      FieldTags.BASIC,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'height',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 18,
    validators: [ intRangeValidator(4, 100) ],

    name: 'Field height (visible)',
    description: 'The number of visible rows in the field. Taller fields allow players to survive longer.',
    tags: [
      FieldTags.BASIC,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'invisibleHeight',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 20,
    validators: [ intRangeValidator(0, 100) ],

    name: 'Hidden rows',
    description: 'The number of invisible rows above the field. When garbage lines enter the field, the existing blocks may be pushed upwards into these hidden rows. If some blocks are pushed beyond the available number of hidden rows, the blocks will disappear.',
    tags: [
      FieldTags.ALL,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'previews',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1,
    validators: [ intRangeValidator(0, 10) ],

    name: 'Piece previews',
    description: 'The number of next incoming pieces displayed.',
    tags: [
      FieldTags.BASIC,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'rotationSystem',
    fieldType: FieldType.CHOICE,
    default: RotationSystemType.NEAREST,
    choices: [
      { value: RotationSystemType.NO_KICK, label: 'Strict (no kick)' },
      { value: RotationSystemType.SRS, label: 'Guideline (SRS)' },
      { value: RotationSystemType.NEAREST, label: 'Nearest' },
    ],

    name: 'Rotation system',
    description: 'This affects the way the pieces move when rotated.',
    tags: [
      FieldTags.BASIC,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'garbageSpawnDelayTable',
    fieldType: FieldType.NUMBER_LIST,
    default: [0, 1],
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ listValidator(floatRangeValidator(0, 10)) ],
    startIndex: 0,
    
    name: 'Garbage spawn time',
    description: 'The minimum amount of time an attack must stay inside the garbage indicator (displayed on the left of the field) before they can enter the field. Longer spawn time generally helps the defender to react to or block the incoming garbage lines.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.DEFENSE,
    ],
  },
  {
    property: 'garbageSpawnRate',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1,
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ floatRangeValidator(0, 10) ],
    startIndex: 0,
    
    name: 'Continuous garbage spawn rate',
    description: 'Garbage lines per second that will enter the field, as long as there are garbage queued. This lets garbage lines enter the field even without the player placing down any piece.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.DEFENSE,
    ],
  },
  {
    property: 'garbageBlockingFactor',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1,
    stepSize: 0.05,
    decimalPlaces: 2,
    validators: [ floatRangeValidator(0, 1) ],
    startIndex: 0,
    
    name: 'Blocking factor',
    description: 'Determines how efficient it is to block lines. For example, if the blocking factor is set to 0.5, performing an action that would normally send 4 lines will only block 2 garbage lines. This factor can be used in combination with the pierce factor. To avoid attacker / defender imbalance, the block factor and the pierce factor should normally sum up to 1.',
    tags: [
      FieldTags.ALL,
      FieldTags.DEFENSE,
    ],
  },
  {
    property: 'garbagePierceFactor',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 0,
    stepSize: 0.05,
    decimalPlaces: 2,
    validators: [ floatRangeValidator(0, 1) ],
    startIndex: 0,
    
    name: 'Pierce factor',
    description: 'When a player blocks garbage, the amount of attack power used to block the garbage will still contribute to sending attacks based on this pierce factor. For example, if the pierce factor is 1.0, blocking two garbage lines will result in sending two lines anyways. Remainders will carry towards the next block.',
    tags: [
      FieldTags.ALL,
      FieldTags.DEFENSE,
    ],
  },
  {
    property: 'useComboTimer',
    fieldType: FieldType.CHOICE,
    default: true,
    choices: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],

    name: 'Speed combo',
    description: 'Activate bonus for clearing lines in quick succession.',
    tags: [
      FieldTags.BASIC,
      FieldTags.ATTACK,
    ],
  },
  {
    property: 'comboAttackTable',
    fieldType: FieldType.NUMBER_LIST,
    default: [0, 0, 1, 1, 1, 2, 2, 2, 3],
    validators: [ listValidator(intRangeValidator(0, 100)) ],
    startIndex: 1,

    name: 'Speed combo attack table',
    description: 'Defines the amount of lines sent when performing a combo.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.ATTACK,
    ],
  },
  {
    property: 'comboTimerInitial',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1,
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ floatRangeValidator(0, 10) ],

    name: 'Speed combo initial time',
    description: 'The amount of time given to perform a combo. On top of this, the player gains bonus time when clearing lines during a combo.',
    tags: [
      FieldTags.BASIC,
      FieldTags.GENERAL,
    ],
  },
  {
    property: 'comboTimerMultiClearBonus',
    fieldType: FieldType.NUMBER_LIST,
    default: [-0.2, 1, 1.4, 1.7, 2],
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ listValidator(floatRangeValidator(-10, 10)) ],
    startIndex: 0,
    
    name: 'Speed combo time bonus base',
    description: 'Determines the amount of time gained when clearing N lines during a combo. Can be negative which means a time penalty instead. This value will first be multiplied by the "Speed combo time bonus multiplier" before being added to the combo timer.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.ATTACK,
    ],
  },
  {
    property: 'comboTimerSpinBonus',
    fieldType: FieldType.NUMBER_LIST,
    default: [-0.2, 1, 1.4, 1.7, 2],
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ listValidator(floatRangeValidator(-10, 10)) ],
    startIndex: 0,
    
    name: 'Speed combo time bonus base (spin)',
    description: 'Determines the amount of time gained when clearing N lines with a spin bonus, during a combo. This value will first be multiplied by the "Speed combo time bonus multiplier" before being added to the combo timer.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.ATTACK,
    ],
  },
  {
    property: 'comboTimerTimeBonusMultiplierTable',
    fieldType: FieldType.NUMBER_LIST,
    default: [-0.2, 1, 1.4, 1.7, 2],
    stepSize: 0.1,
    decimalPlaces: 1,
    validators: [ listValidator(floatRangeValidator(-10, 10)) ],
    startIndex: 0,
    
    name: 'Speed combo time bonus multiplier',
    description: 'Determines the time bonus multiplier for each combo-level. This can be set to gradually decreasing values to make it harder to regain time at higher combos.',
    tags: [
      FieldTags.ADVANCED,
      FieldTags.ATTACK,
    ],
  },
];
