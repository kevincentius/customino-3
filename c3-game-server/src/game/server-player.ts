import { Game } from "@shared/game/engine/game/game";
import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";

export class ServerPlayer extends Player {
  constructor(game: Game, public startPlayerData: StartPlayerData) {
    super(game, startPlayerData);
  }

  update(): void {
    throw new Error('Server should not run update loop.');
  }

  handleEvent(clientEvent: ClientEvent): void {
    if (clientEvent.gameEvents.length > 0 && clientEvent.gameEvents[0].frame < this.frame) {
      throw new Error('Sanity check failed! Remote event should have been executed in previous frame.');
    }

    clientEvent.gameEvents.forEach(event => {
      this.frame = event.frame;
      super.runEvent(event);
    });
    this.frame = clientEvent.frame;
  }

  init(): void {}
}
