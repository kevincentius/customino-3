import { Player } from "@shared/game/engine/player/player";
import { GameEvent } from "@shared/game/network/model/event/game-event";

export class RemotePlayer extends Player {
  // events will be buffered and executed later during update(). If lastReceivedFrame is behind, the update has to be paused (lag).
  private remoteEventBuffer: GameEvent[] = [];
  private lastReceivedFrame?: number;

  update(): void {
    super.runFrame();
    if (this.lastReceivedFrame && this.lastReceivedFrame > this.frame) {

      // remoteEventBuffer is an array but used as a FIFO which may be inefficient. But the buffer should be small anyways.
      while (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame == this.frame) {
        super.runEvent(this.remoteEventBuffer.shift()!);
      }

      if (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame < this.frame) {
        throw new Error('Sanity check failed! Remote event should have been executed in previous frame.');
      }

      super.runFrame();
    }
  }

  handleEvent(remoteEvents: GameEvent[]) {
    console.log('remote player', remoteEvents);

    this.remoteEventBuffer.push(...remoteEvents);
  }
}
