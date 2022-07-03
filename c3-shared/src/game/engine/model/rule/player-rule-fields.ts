import { PlayerRuleField } from "@shared/game/engine/model/rule/field";
import { FieldType } from "@shared/game/engine/model/rule/field-type";
import { intRangeValidator } from "@shared/game/engine/model/rule/field-validators";

export const playerRuleFields: PlayerRuleField[] = [
  {
    property: 'width',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 10,
    validators: [ intRangeValidator(4, 100) ],

    name: 'Field width',
    description: 'The number of columns in the field. Wider fields will need more pieces to complete each line.',
  },
  {
    property: 'height',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 18,
    validators: [ intRangeValidator(4, 100) ],

    name: 'Field height (visible)',
    description: 'The number of visible rows in the field. Taller fields allow players to survive longer.',
  },
  {
    property: 'invisibleHeight',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 20,
    validators: [ intRangeValidator(0, 100) ],

    name: 'Hidden rows',
    description: 'The number of invisible rows above the field. When garbage lines enter the field, the existing blocks may be pushed upwards into these hidden rows. If some blocks are pushed beyond the available number of hidden rows, the blocks will disappear.',
  },
  {
    property: 'previews',
    fieldType: FieldType.NUMBER_SCROLL,
    default: 1,
    validators: [ intRangeValidator(0, 10) ],

    name: 'Piece previews',
    description: 'The number of next incoming pieces displayed.',
  },
];
