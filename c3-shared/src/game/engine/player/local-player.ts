import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent } from "@shared/game/network/model/event/game-event";
import { ClientInfo } from "@shared/model/session/client-info";
import { Subject } from "rxjs";

export class LocalPlayer extends Player {
  // event emitters
  eventsSubject = new Subject<GameEvent[]>();

  // events will be buffered and delivered in batches to the server
  private eventBuffer: GameEvent[] = [];
  private lastFlush: number = Date.now();
  private flushInterval = 1000;

  constructor(
    clientInfo: ClientInfo,
  ) {
    super(clientInfo);
  }

  update() {
    super.runFrame();

    const now = Date.now();
    if (now - this.lastFlush >= this.flushInterval) {
      this.lastFlush = now;
      
      this.eventsSubject.next(this.eventBuffer);
      console.log(this.eventBuffer);
      this.eventBuffer = [];
    }
  }

  handleEvent(clientEvent: ClientEvent) {
    clientEvent.gameEvents.forEach(event => {
      if (event.frame != this.frame) {
        throw new Error(`Sanity check failed! Local event for frame ${event.frame}, but the player is on frame ${this.frame}.`);
      }
    });

    clientEvent.gameEvents.forEach(event => super.runEvent(event));
    this.eventBuffer.push(...clientEvent.gameEvents);
  }
}
