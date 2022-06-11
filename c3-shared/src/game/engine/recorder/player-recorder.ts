import { Player } from "@shared/game/engine/player/player";
import { PlayerReplay } from "@shared/game/engine/recorder/player-replay";
import { GameEvent } from "@shared/game/network/model/event/game-event";
import { Subscription } from "rxjs";

export class PlayerRecorder {
  subscription: Subscription;
  gameEvents: GameEvent[] = [];

  constructor(private player: Player) {
    this.subscription = this.player.gameEventSubject.subscribe(gameEvent => {
      this.gameEvents.push(gameEvent);
    });
  }

  destroy() {
    this.subscription.unsubscribe();
  }

  asReplay(): PlayerReplay {
    return {
      gameEvents: this.gameEvents,
      alive: this.player.alive,
    }
  }
}
