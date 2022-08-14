import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";

export interface PlayerRule extends RoomRule, LocalRule {}

export function computePlayerRule(roomRule: RoomRule, slotRule: Partial<RoomRule>, localRule: LocalRule) {
  return {
    ...JSON.parse(JSON.stringify(roomRule)),
    ...slotRule,
    ...localRule,
  };
}
