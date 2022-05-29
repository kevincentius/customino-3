import { GameEvent } from "@shared/game/network/model/event/game-event";

export interface ClientEvent {
  frame?: number;
  gameEvents: GameEvent[];
}
