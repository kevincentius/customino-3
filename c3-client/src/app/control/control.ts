import { InputKey } from "@shared/game/network/model/input-key";

export class Control {
  down = false;
  pressedAt = 0;

  constructor(
    public move: InputKey,
  ) { }
}
