import { GameEvent } from "@shared/game/network/model/event/game-event";

export interface SystemEvent extends GameEvent {
  gameOver?: boolean;
}
