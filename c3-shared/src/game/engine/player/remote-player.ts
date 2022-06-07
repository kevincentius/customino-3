import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent } from "@shared/game/network/model/event/game-event";

export class RemotePlayer extends Player {
  // events will be buffered and executed later during update(). If lastReceivedFrame is behind, the update has to be paused (lag).
  private remoteEventBuffer: GameEvent[] = [];
  public lastReceivedFrame = -1;

  init() {

  }

  update(): void {
    if (this.lastReceivedFrame && this.lastReceivedFrame > this.frame) {
      do {
        // remoteEventBuffer is an array but used as a FIFO which may be inefficient. But the buffer should be small anyways.
        while (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame == this.frame) {
          super.runEvent(this.remoteEventBuffer.shift()!);
        }
  
        if (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame < this.frame) {
          throw new Error('Sanity check failed! Remote event should have been executed in previous frame.');
        }
  
        super.runFrame();
      } while (this.lastReceivedFrame > this.frame && this.frame < this.game.getTargetMinFrame());
    }
  }

  handleEvent(clientEvent: ClientEvent) {
    this.remoteEventBuffer.push(...clientEvent.gameEvents);
    this.lastReceivedFrame = clientEvent.frame!;
  }

  onGameOver() {}
}
