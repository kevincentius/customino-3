import { GameEvent } from "@shared/game/network/model/event/game-event";

export interface PlayerReplay {
  gameEvents: GameEvent[];
  alive: boolean;
}
