import { InputKey } from "@shared/game/network/model/input-key";
import { SystemKey } from "@shared/game/network/model/system-key";

export interface ControlSettings {
  keyMap: Map<InputKey, string[]>;
  systemKeyMap: Map<SystemKey, string[]>;
  das: number;
  arr: number;
  sdr: number;
}
