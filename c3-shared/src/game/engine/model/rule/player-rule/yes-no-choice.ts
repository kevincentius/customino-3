import { FieldType } from "@shared/game/engine/model/rule/field-type";

export const yesNoChoice = {
  fieldType: FieldType.CHOICE,
  choices: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
}
