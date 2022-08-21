import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";
import { DataField, getField, setField } from "@shared/game/engine/model/rule/data-field/data-field";
import { RoomSlotSettings } from "@shared/model/room/room-slot-settings";
import { userRuleFields } from "@shared/game/engine/model/rule/user-rule/user-rule-fields";
import { localRuleFields } from "@shared/game/engine/model/rule/local-rule/local-rule-fields";

export interface PlayerRule extends RoomRule, UserRule, LocalRule {
  team: number | null;
}

export function computePlayerRule(roomRule: RoomRule, slotSettings: RoomSlotSettings, userRule: UserRule, localRule?: LocalRule) {
  // TODO: combining objects like this doesn't work due to nested objects
  // TODO: use slotSettings

  const playerRule: PlayerRule = JSON.parse(JSON.stringify(roomRule));
  playerRule.team = slotSettings.team;

  mergeRule(playerRule, userRule, userRuleFields);
  if (localRule) {
    mergeRule(playerRule, localRule, localRuleFields);
  }
  return playerRule;
}

function mergeRule(target: PlayerRule, source: Partial<PlayerRule>, fields: DataField[]) {
  for (const field of fields) {
    const sourceVal = getField(source, field, true);
    if (sourceVal != null) {
      // TODO: need to check if field is overridable when forced fields are implemented later
      setField(target, field, sourceVal, true);
    }
  }
}

export function fillDefaultRules(rule: any, fields: DataField[]) {
  for (const field of fields) {
    console.log(field.property, getField(rule, field, true) == null);
    if (getField(rule, field, true) == null) {
      setField(rule, field, field.default, true);
    }
  }
}
