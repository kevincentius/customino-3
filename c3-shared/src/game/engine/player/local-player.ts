import { Player } from "@shared/game/engine/player/player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { AttackAckEvent } from "@shared/game/network/model/event/attack-ack";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { AttackDistribution } from "@shared/game/network/model/attack/attack-distribution";
import { InputKey } from "@shared/game/network/model/input-key";
import { Subject } from "rxjs";
import { Game } from "../game/game";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { LocalRule } from "../model/rule/local-rule/local-rule";
import { clientEventFlushInterval } from "../game/game-loop-rule";

export class LocalPlayer extends Player {
  // event emitters
  eventsSubject = new Subject<ClientEvent>();

  // events will be buffered and delivered in batches to the server
  private eventBuffer: GameEvent[] = [];
  private lastFlush: number = Date.now();

  constructor(
    private setTimeoutWrapper: (callback: () => void, ms?: number | undefined) => any,
    
    // reference
    game: Game,

    startPlayerData: StartPlayerData,
    localRule: LocalRule | undefined,
  ) {
    super(game, startPlayerData, localRule);
  }

  init() {
    this.gameOverSubject.subscribe(() => this.setTimeoutWrapper(() => {
      this.flush();
    }));
  }

  update() {
    if (this.alive) {
      if (Date.now() - this.lastFlush >= clientEventFlushInterval + 300) {
        this.flush();
      }

      super.runFrame();
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

  override handleEvent(clientEvent: ClientEvent) {
    clientEvent.gameEvents.forEach(event => {
      if (event.frame != this.frame) {
        throw new Error(`Sanity check failed! Local event for frame ${event.frame}, but the player is on frame ${this.frame}.`);
      }
    });

    clientEvent.gameEvents.forEach(event => {
      const success = super.runEvent(event);
      if (success) {
        this.eventBuffer.push(event);
      }
    });
  }

  handleInput(key: InputKey) {
    const inputEvent: InputEvent = {
      frame: this.frame,
      key: key,
      timestamp: -1,
      type: GameEventType.INPUT,
    };

    this.handleEvent({
      frame: this.frame,
      gameEvents: [inputEvent],
    });
  }

  recvAttack(attackDistribution: AttackDistribution) {
    const gameEvent: AttackAckEvent = {
      frame: this.frame,
      timestamp: -1,
      type: GameEventType.ATTACK_ACK,
      attackDistribution: attackDistribution,
    };

    this.handleEvent({
      frame: null!,
      gameEvents: [gameEvent],
    });
  }
}
