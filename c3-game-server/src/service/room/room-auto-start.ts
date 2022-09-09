import { Room } from "./room";

export class RoomAutoStart {
  delay?: number;
  timeout: any;
  autoStartDelay = 15000;
  autoStartTargetMs?: number;

  constructor(
    private room: Room,
  ) {
    this.room.gameOverSubject.subscribe(() => this.updateAutoStart());
    this.room.slotsChangeSubject.subscribe(() => this.updateAutoStart());
  }

  configure(delay: number | undefined) {
    this.delay = delay;

    // if delay is smaller (faster) than the current countdown, clamp the countdown down
    if (this.autoStartTargetMs != undefined && delay != undefined && delay < (this.autoStartTargetMs - Date.now())) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    this.updateAutoStart();
  }

  private updateAutoStart() {
    if (this.delay != undefined && this.room.isRunning() && this.room.game!.isOnePlayerOnly() && this.room.slots.filter(slot => slot.settings.playing).length > 1) {
      this.room.postChatMessage(null, 'The game was restarted because another player joined.');
      this.room.abortGame();
    }

    // if countdown was inactive but should now be activated
    if (this.delay != undefined && this.room.canStartGame() && this.timeout == undefined) {
      const timeoutMs = this.delay;
      this.autoStartTargetMs = Date.now() + timeoutMs;
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.room.startGame(null);
      }, timeoutMs);
      console.log('auto start in ', timeoutMs);

    // if countdown was active but should now be deactivated
    } else if ((!this.room.canStartGame() || this.delay == undefined) && this.timeout != undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      this.autoStartTargetMs = undefined;

      console.log('canceled auto start');
    }
  }

  destroy() {
    clearTimeout(this.timeout);
  }

  getMsUntilAutoStart() {
    return this.autoStartTargetMs == undefined ? undefined : (this.autoStartTargetMs - Date.now());
  }
}
