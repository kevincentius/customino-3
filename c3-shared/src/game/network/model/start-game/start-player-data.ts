import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { RoomSlotSettings } from "@shared/model/room/room-slot-settings";
import { ClientInfo } from "@shared/model/session/client-info";

export interface StartPlayerData {
  clientInfo: ClientInfo;
  randomSeed: number;
  slotSettings: RoomSlotSettings;
  userRule: UserRule;
}
