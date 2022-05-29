import { ClientEvent } from "@shared/game/network/model/event/client-event";

export interface ServerEventEntry {
  playerIndex: number,
  clientEvent: ClientEvent
}

export interface ServerEvent {
  roomId: number;
  playerEvents: ServerEventEntry[];

  // eventually garbage data will be here too
}
