import { setField } from "@shared/game/engine/model/rule/data-field/data-field";
import { GraphicsRule } from "@shared/game/engine/model/rule/local-rule/graphics-rule";
import { localRuleFields } from "@shared/game/engine/model/rule/local-rule/local-rule-fields";

export interface LocalRule {
  graphics: GraphicsRule;
}

export function getDefaultLocalRule(): LocalRule {
  const localRule = {} as LocalRule;
  for (const field of localRuleFields) {
    setField(localRule, field, field.default, true);
  }
  return localRule;
}
