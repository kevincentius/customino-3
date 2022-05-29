import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";

export class ServerPlayer extends Player {
  update(): void {
    throw new Error('Server should not run update loop.');
  }

  handleEvent(clientEvent: ClientEvent): void {
    if (clientEvent.gameEvents.length > 0 && clientEvent.gameEvents[0].frame < this.frame) {
      throw new Error('Sanity check failed! Remote event should have been executed in previous frame.');
    }

    clientEvent.gameEvents.forEach(event => super.runEvent(event));
  }

  init(): void {}
}
