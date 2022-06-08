
import { GameState } from "@shared/game/engine/serialization/game-state";
import { RoomSlotInfo } from "@shared/model/room/room-slot-info";
import { ClientInfo } from "@shared/model/session/client-info";

export interface RoomInfo {
  id: number;
  name: string;
  host: ClientInfo;

  slots: RoomSlotInfo[];
  gameState: GameState | null;
}
