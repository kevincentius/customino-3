import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";

export interface PlayerRule extends RoomRule, UserRule, LocalRule {}

export function computePlayerRule(roomRule: RoomRule, slotRule: Partial<RoomRule>, userRule: UserRule, localRule?: UserRule) {
  return {
    ...JSON.parse(JSON.stringify(roomRule)),
    ...slotRule,
    ...userRule,
    ...localRule,
  };
}
