import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";
import { RoomSlotSettings } from "@shared/model/room/room-slot-settings";
import { ClientInfo } from "@shared/model/session/client-info";

export interface StartPlayerData {
  clientInfo: ClientInfo;
  randomSeed: number;
  slotRule: Partial<RoomRule>;
  slotSettings: RoomSlotSettings;
  localRule: LocalRule;
}
