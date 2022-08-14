import { FieldTags as FieldTag } from "@shared/game/engine/model/rule/data-field/field-tag";
import { FieldType } from "@shared/game/engine/model/rule/data-field/field-type";

export interface DataField {
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

export function getField(rule: any, field: DataField) {
  let obj: any = rule;
  const parts = field.property.split('.');
  for (const part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error();
    }
  }
  return field.convertToDisplay ? field.convertToDisplay(obj) : obj;
}

export function setField(rule: any, field: DataField, value: any, objectCreation=false) {
  let obj: any = rule;
  const parts = field.property.split('.');
  const property = parts.pop()!;
  for (const part of parts) {
    if (obj[part] == undefined) {
      if (objectCreation) {
        obj[part] = {};
      } else {
        throw new Error(`Error occurred in PlayerRule binding: ${part} is not found.`);
      }
    }
    obj = obj[part];
  }
  obj[property] = field.convertFromDisplay ? field.convertFromDisplay(value) : value;
}
