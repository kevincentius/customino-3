import { Game } from "@shared/game/engine/game/game";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { ClientInfo } from "@shared/model/session/client-info";
import { Subject } from 'rxjs';

export abstract class Player {
  // event emitters
  debugSubject = new Subject<string>();
  gameOverSubject = new Subject<void>();

  // state
  frame = 0;
  alive = true;
  private debugCount = 0;

  // settings
  private mspf = 50;
  private maxCatchUpRate = 10;

  constructor(
    // reference
    protected game: Game,

    // state
    private clientInfo: ClientInfo,
  ) {
    this.init();
  }

  abstract update(): void;

  /**
   * Informs the player object about events.
   * 
   * In local player, the events will be executed immediately and buffered to be sent to the server.
   * 
   * In remote player, the events be buffered to be executed later during update loop when the remote simulation catches up.
   */
  abstract handleEvent(clientEvent: ClientEvent): void;

  abstract init(): void;

  protected runFrame() {
    this.debugSubject.next('a_.-^b_.-^c_.-^d_.-^'.charAt(this.frame % 20));
    this.frame++;
  }

  protected runEvent(event: GameEvent) {
    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      this.debugSubject.next(inputEvent.key.toString());

      this.debugCount++;
      if (this.debugCount >= 10) {
        this.die();
      }
    }
  }

  private die() {
    this.alive = false;
    this.gameOverSubject.next();
  }

  canMove(move: InputKey) {
    return this.alive && true;
  }

  isRunning() {
    return this.game.running;
  }
}
