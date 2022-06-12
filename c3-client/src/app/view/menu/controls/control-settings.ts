import { InputKey } from "@shared/game/network/model/input-key";

export interface ControlSettings {
  keyMap: Map<InputKey, string[]>;
}
