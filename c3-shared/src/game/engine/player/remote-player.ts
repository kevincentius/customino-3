import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent } from "@shared/game/network/model/event/game-event";
import { ServerPlayerEvent } from "@shared/game/network/model/event/server-event";

export class RemotePlayer extends Player {
  // events will be buffered and executed later during update(). If lastReceivedFrame is behind, the update has to be paused (lag).
  private remoteEventBuffer: GameEvent[] = [];
  public lastReceivedFrame = -1;

  // settings
  private maxCatchUpRate = 5;

  init() {

  }

  update(): void {
    if (this.lastReceivedFrame && this.lastReceivedFrame > this.frame) {
      let framesRun = 0;
      do {
        // remoteEventBuffer is an array but used as a FIFO which may be inefficient. But the buffer should be small anyways.
        while (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame == this.frame) {
          super.runEvent(this.remoteEventBuffer.shift()!);
        }
  
        if (this.remoteEventBuffer.length > 0 && this.remoteEventBuffer[0].frame < this.frame) {
          throw new Error('Sanity check failed! Remote event should have been executed in previous frame.');
        }
  
        if (this.alive) {
          super.runFrame();
        }
        framesRun++;
      } while (this.alive && this.lastReceivedFrame > this.frame && this.frame < this.game.getTargetMinFrame() && framesRun < this.maxCatchUpRate);
    }
  }

  handleEvent(clientEvent: ClientEvent) {
    this.remoteEventBuffer.push(...clientEvent.gameEvents);
    this.lastReceivedFrame = clientEvent.frame!;
  }

  onGameOver() {}
}
