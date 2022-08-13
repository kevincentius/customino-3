import { FieldTags as FieldTag } from "@shared/game/engine/model/rule/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/field-type";

export interface PlayerRuleField {
  property: string;
  default: any;
  name: string;
  description: string;
  fieldType: FieldType;
  convertToDisplay?: (value: any) => any;
  convertFromDisplay?: (value: any) => any;
  validators?: ((value: any) => string | undefined)[];
  tags: FieldTag[];

  overridable?: boolean;

  // NUMBERS
  stepSize?: number;
  decimalPlaces?: number;

  // CHOICE
  choices?: { label: string, value: any }[];

  // ARRAYS
  startIndex?: number;
}
