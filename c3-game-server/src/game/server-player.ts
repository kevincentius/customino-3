
import { Player } from "@shared/game/engine/player/player";
import { AttackDistribution } from "@shared/game/network/model/attack/attack-distribution";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { ServerPlayerEvent } from "@shared/game/network/model/event/server-event";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { ServerGame } from "game/server-game";
import { Subject } from "rxjs";

export class ServerPlayer extends Player {

  // maps playerIndex to server event that should be sent to them. -1 means spectators.
  serverEventSubject = new Subject<Map<number, ServerPlayerEvent>>();

  attackOutgoingBuffer: AttackDistribution[] = [];

  constructor(protected game: ServerGame, public startPlayerData: StartPlayerData, private playerIndex: number) {
    super(game, startPlayerData, undefined);
    
    this.pieceLockSubject.subscribe(lockResult => {
      const attackDistribution = this.game.distributeAttacks(this, lockResult.attacks);
      if (attackDistribution) {
        this.attackOutgoingBuffer.push(...attackDistribution);
      }
    });
  }

  override init(): void {
  }

  override update(): void {
    throw new Error('Server should not run update loop.');
  }

  override handleEvent(clientEvent: ClientEvent): void {
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

    this.emitServerPlayerEvent(clientEvent);
  }

  private emitServerPlayerEvent(clientEvent: ClientEvent) {
    const serverEventMap = new Map<number, ServerPlayerEvent>();

    // spectators
    const specEvent = {
      playerIndex: this.playerIndex,
      clientEvent: clientEvent,
    };
    serverEventMap.set(-1, specEvent);

    for (let playerIndex = 0; playerIndex < this.game.players.length; playerIndex++) {
      let send = false;

      const serverEvent: ServerPlayerEvent = {
        playerIndex: this.playerIndex,
      };

      // remote players
      if (playerIndex != this.playerIndex) {
        serverEvent.clientEvent = clientEvent;
        send = true;
      }

      // attack receivers
      const attackDistributions = this.attackOutgoingBuffer.filter(gb => gb.playerIndex == playerIndex);
      if (attackDistributions.length > 0) {
        if (!serverEvent.serverEvent) {
          serverEvent.serverEvent = {};
        }
        serverEvent.serverEvent.attackDistributions = attackDistributions;
        send = true;
      }

      if (send) {
        serverEventMap.set(playerIndex, serverEvent);
      }
    }
    
    this.attackOutgoingBuffer = [];
    this.serverEventSubject.next(serverEventMap);
  }

  // disconnects the player (this should be decided by the server)
  dropPlayer() {
    const serverEventMap = new Map<number, ServerPlayerEvent>();

    const serverPlayerEvent: ServerPlayerEvent = {
      playerIndex: this.playerIndex,
      serverEvent: {
        disconnect: true,
      }
    };

    for (let i = -1; i < this.game.players.length; i++) {
      serverEventMap.set(i, serverPlayerEvent);
    }

    this.serverEventSubject.next(serverEventMap);

    this.die();
  }
}
