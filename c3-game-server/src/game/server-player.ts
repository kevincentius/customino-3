
import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GarbageDistribution, ServerPlayerEvent } from "@shared/game/network/model/event/server-event";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { ServerGame } from "game/server-game";
import { Subject } from "rxjs";

export class ServerPlayer extends Player {
  serverPlayerEventSubject = new Subject<ServerPlayerEvent>();

  garbageOutgoingBuffer: GarbageDistribution[] = [];

  constructor(protected game: ServerGame, public startPlayerData: StartPlayerData, private playerIndex: number) {
    super(game, startPlayerData);
    
    this.pieceLockSubject.subscribe(lockResult => {
      const garbageDistribution = this.game.applyAttack(this, lockResult.attackPower);
      if (garbageDistribution) {
        this.garbageOutgoingBuffer.push(...garbageDistribution);
      }
    });
  }

  init(): void {
  }

  update(): void {
    throw new Error('Server should not run update loop.');
  }

  handleEvent(clientEvent: ClientEvent): void {
    if (clientEvent.gameEvents.length > 0 && clientEvent.gameEvents[0].frame < this.frame) {
      throw new Error(`Sanity check failed! Remote event should have been executed in previous frame. ${this.frame} - ${clientEvent.gameEvents[0].frame}`);
    }

    let i = 0;
    while (i < clientEvent.gameEvents.length) {
      const gameEvent = clientEvent.gameEvents[i];

      // catch up frames with no gameEvents
      while (this.frame < gameEvent.frame) {
        this.runFrame();
      }

      // run actual frame of the gameEvent
      this.runEvent(gameEvent);
      i++;
    }

    // catch up frames with no gameEvents
    while (this.frame <= clientEvent.frame) {
      this.runFrame();
    }

    if (this.frame != clientEvent.frame + 1) {
      throw new Error(`Sanity check failed! Frame count does not match: ${this.frame} - ${clientEvent.frame}`);
    }

    // flush ServerEvent
    const serverPlayerEvent: ServerPlayerEvent = {
      playerIndex: this.playerIndex,
      clientEvent: clientEvent,
    };
    if (this.garbageOutgoingBuffer.length > 0) {
      serverPlayerEvent.garbageDistribution = this.garbageOutgoingBuffer;
      this.garbageOutgoingBuffer.length = 0;
    }
    this.serverPlayerEventSubject.next(serverPlayerEvent);
  }
}
