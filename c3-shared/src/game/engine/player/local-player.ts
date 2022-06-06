import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { Subject } from "rxjs";

export class LocalPlayer extends Player {
  // event emitters
  eventsSubject = new Subject<ClientEvent>();

  // events will be buffered and delivered in batches to the server
  private eventBuffer: GameEvent[] = [];
  private lastFlush: number = Date.now();
  private flushInterval = 100;

  init() {
    this.gameOverSubject.subscribe(() => setTimeout(() => {
      this.flush();
    }));
  }

  update() {
    if (this.alive) {
      super.runFrame();
  
      if (Date.now() - this.lastFlush >= this.flushInterval) {
        this.flush();
        this.flushInterval = Math.random() * 250 + 50; // DEBUG
      }
    }
  }

  private flush() {
    this.lastFlush = Date.now();

    this.eventsSubject.next({
      gameEvents: this.eventBuffer,
      frame: this.frame + (this.alive ? 0 : 1), // if dead, allow remote to simulate one extra frame for the death
    });
    this.eventBuffer = [];
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

  handleInput(key: InputKey) {
    const inputEvent: InputEvent = {
      frame: this.frame,
      key: key,
      timestamp: -1,
      type: GameEventType.INPUT,
    }

    this.handleEvent({
      frame: this.frame,
      gameEvents: [inputEvent],
    })
  }
}
