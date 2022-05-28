import { GameEvent } from "@shared/game/network/model/event/game-event";
import { InputKey } from "@shared/game/network/model/input-key";

export interface InputEvent extends GameEvent {
  key: InputKey;
}
