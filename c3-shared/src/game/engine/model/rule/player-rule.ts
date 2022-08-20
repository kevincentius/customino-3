import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";
import { DataField, getField, setField } from "@shared/game/engine/model/rule/data-field/data-field";

export interface PlayerRule extends RoomRule, UserRule, LocalRule {}

export function computePlayerRule(roomRule: RoomRule, slotRule: Partial<RoomRule>, userRule: UserRule, localRule?: LocalRule) {
  return {
    ...JSON.parse(JSON.stringify(roomRule)),
    ...slotRule,
    ...userRule,
    ...localRule,
  };
}

export function fillDefaultRules(rule: any, fields: DataField[]) {
  for (const field of fields) {
    if (getField(rule, field, true) == null) {
      setField(rule, field, field.default, true);
    }
  }
}
