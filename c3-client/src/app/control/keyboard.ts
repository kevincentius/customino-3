import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { InputKey } from "@shared/game/network/model/input-key";
import { Control } from "app/control/control";

export enum InputState {
  DISABLED, PRECLOCK, ENABLED,
}

export class Keyboard {

  // State
  public enabled = false;

  private keyMap = new Map<string, Control>();
  private moveMap = new Map<InputKey, Control>();
  private repeatKey?: Control;

  private repeatTimer: number = 0;
  private dropRepeatTimer: number = 0;

  // References
  player!: Player;

  // Settings
  public das: number = 150;
  public arr: number = 50
  public sdr: number = 50;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  bindToPlayer(player: Player) {
    this.player = player;

    this.moveMap.forEach((control, key) => control.down = false);

    this.enabled = false;
  }

  unbindAllKeys() {
    this.moveMap.clear();
    this.keyMap.clear();
  }

  bind(move: InputKey, code: string) {
    const control = new Control(move);
    this.moveMap.set(move, control);
    this.keyMap.set(code, control);
  }

  // Event Handling
  onKeyDown(e: KeyboardEvent) {
    if (!this.enabled || e.repeat)
      return;

    // Ensure key event only affects game
    e.preventDefault();

    // Check what control the key corresponds to
    const control = this.keyMap.get(e.code);
    if (!control)
      return;
      
    control.pressedAt = e.timeStamp;
    control.down = true;

    if (control.move == InputKey.SOFT_DROP) {
      this.dropRepeatTimer = this.sdr;

      this.tryMove(control.move);
    } else if (control.move == InputKey.LEFT || control.move == InputKey.RIGHT) {
      this.repeatTimer = this.das;
      this.repeatKey = control;
      
      this.tryMove(control.move);
    } else if (control) {
      this.tryMove(control.move);
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (!this.enabled || e.repeat)
      return;

    // Ensure Key event doesn't do anything weird
    e.preventDefault();

    // Check what control the key corresponds to
    let control = this.keyMap.get(e.code);
    if (!control)
      return;

    control.down = false;
  }

  tick(dt: number) {
    if (this.moveMap.get(InputKey.SOFT_DROP)?.down) {
      this.dropRepeatTimer -= dt;
      while (this.dropRepeatTimer <= 0) {
        const oldX = this.player.activePiece.x;
        const oldY = this.player.activePiece.y;

        this.tryMove(InputKey.SOFT_DROP);
        this.dropRepeatTimer += this.sdr;
        
        if (this.player.activePiece.y == oldY && this.player.activePiece.x == oldX) {
          break;
        }
      }
    }

    if (this.repeatKey && this.repeatKey.down) {
      this.repeatTimer -= dt;
      while (this.repeatTimer <= 0) {
        const oldX = this.player.activePiece.x;
        const oldY = this.player.activePiece.y;

        this.tryMove(this.repeatKey.move);
        this.repeatTimer += this.arr;
        
        if (this.player.activePiece.y == oldY && this.player.activePiece.x == oldX) {
          break;
        }
      }
    }
  }

  private tryMove(key: InputKey) {
    if (this.player.isRunning()) {
      (this.player as LocalPlayer).handleInput(key);
      return true;
    } else {
      return false;
    }
  }
}
