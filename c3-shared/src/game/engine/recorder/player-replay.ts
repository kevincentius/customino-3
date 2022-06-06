import { GameEvent } from "@shared/game/network/model/event/game-event";
import { ClientInfo } from "@shared/model/session/client-info";

export interface PlayerReplay {
  clientInfo: ClientInfo;
  gameEvents: GameEvent[];
  alive: boolean;
}
