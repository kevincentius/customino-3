import { DataField } from "@shared/game/engine/model/rule/data-field/data-field";
import { lineClearEffectRuleFields } from "@shared/game/engine/model/rule/room-rule/line-clear-effect-rule-fields";

export const userRuleFields: DataField[] = [
  ...lineClearEffectRuleFields, // requires to implement overridable fields first
];
