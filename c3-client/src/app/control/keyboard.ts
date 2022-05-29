import { Player } from "@shared/game/engine/player/player";
import { GameEventType } from "@shared/game/network/model/event/game-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { Control } from "app/control/control";

export class Keyboard {

  // State
  public enabled = false;

  private keyMap = new Map<number, Control>();
  private moveMap = new Map<InputKey, Control>();
  private repeatKey?: Control;

  private repeatTimer: number = 0;
  private dropRepeatTimer: number = 0;

  // References
  player!: Player;

  // Settings
  private das: number = 1000;
  private arr: number = 400;
  private softDropArr: number = 250;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  bindToPlayer(player: Player) {
    this.player = player;
  }

  bind(move: InputKey, keycode: number) {
    const control = new Control(move);
    this.moveMap.set(move, control);
    this.keyMap.set(keycode, control);
  }

  // Event Handling
  onKeyDown(e: KeyboardEvent) {
    if (!this.enabled || e.repeat)
      return;

    // Ensure key event only affects game
    e.preventDefault();

    // Check what control the key corresponds to
    const control = this.keyMap.get(e.keyCode);
    if (!control)
      return;

    control.pressedAt = e.timeStamp;
    control.down = true;

    if (control.move == InputKey.SOFT_DROP) {
      this.dropRepeatTimer = this.softDropArr;

      this.tryMove(control.move);
    } else if (control.move == InputKey.LEFT || control.move == InputKey.RIGHT) {
      this.repeatTimer = this.das;
      this.repeatKey = control;
      
      this.tryMove(control.move);
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (!this.enabled || e.repeat)
      return;

    // Ensure Key event doesn't do anything weird
    e.preventDefault();

    // Check what control the key corresponds to
    let control = this.keyMap.get(e.keyCode);
    if (!control)
      return;

    control.down = false;
  }

  tick(dt: number) {
    if (this.moveMap.get(InputKey.SOFT_DROP)!.down) {
      this.dropRepeatTimer -= dt;
      while (this.dropRepeatTimer <= 0 && this.tryMove(InputKey.SOFT_DROP)) {
        this.dropRepeatTimer += this.softDropArr;

        break; // todo: remove this break when player.canMove is actually implemented
      }
    }

    if (this.repeatKey && this.repeatKey.down) {
      this.repeatTimer -= dt;
      while (this.repeatTimer <= 0 && this.tryMove(this.repeatKey.move)) {
        this.repeatTimer += this.arr;
        
        break; // todo: remove this break when player.canMove is actually implemented
      }
    }
  }

  private tryMove(key: InputKey) {
    if (this.player.canMove(key)) {
      const inputEvent = {
        frame: this.player.frame,
        key: key,
        timestamp: -1,
        type: GameEventType.INPUT,
      };
  
      this.player.handleEvent({ gameEvents: [inputEvent] });
      return true;
    } else {
      return false;
    }
  }
}
