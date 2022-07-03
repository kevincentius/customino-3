import { FieldType } from "@shared/game/engine/model/rule/field-type";

export interface PlayerRuleField {
  property: string;
  default: any;
  name: string;
  description: string;
  fieldType: FieldType;
  validators?: ((value: any) => string | undefined)[];
}
