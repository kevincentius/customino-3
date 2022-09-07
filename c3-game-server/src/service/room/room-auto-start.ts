import { Room } from "./room";

export class RoomAutoStart {
  timeout: any;
  autoStartDelay = 10000;
  autoStartTargetMs?: number;

  constructor(
    private room: Room,
  ) {
    this.room.slotsChangeSubject.subscribe(() => {
      if (this.room.canStartGame() && this.timeout == undefined) {
        const timeoutMs = 10000;
        this.autoStartTargetMs = Date.now() + timeoutMs;
        this.timeout = setTimeout(() => {
          this.timeout = undefined;
          this.room.startGame(null);
        }, timeoutMs);
      } else if (!this.room.canStartGame() && this.timeout != undefined) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
        this.autoStartTargetMs = undefined;
      }
    });
  }

  start() {
    if (this.timeout == null) {
      this.timeout = setTimeout(() => {
        this.room.startGame(null);
      }, this.autoStartDelay);
    }
  }

  destroy() {

  }

  getMsUntilAutoStart() {
    return this.autoStartTargetMs == undefined ? undefined : (this.autoStartTargetMs - Date.now());
  }
}
