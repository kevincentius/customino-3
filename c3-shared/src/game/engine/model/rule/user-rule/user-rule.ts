import { setField } from "@shared/game/engine/model/rule/data-field/data-field";
import { LineClearEffectRule } from "@shared/game/engine/model/rule/room-rule/line-clear-effect-rule";
import { userRuleFields } from "@shared/game/engine/model/rule/user-rule/user-rule-fields";

export interface UserRule {
  lineClearEffect: LineClearEffectRule;
}

export function getDefaultUserRule(): UserRule {
  const personalization = {} as UserRule;
  for (const field of userRuleFields) {
    setField(personalization, field, field.default, true);
  }
  return personalization;
}
