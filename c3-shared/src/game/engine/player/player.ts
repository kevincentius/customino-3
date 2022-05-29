import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { ClientInfo } from "@shared/model/session/client-info";
import { Subject } from 'rxjs';

export abstract class Player {
  // event emitters
  debugSubject = new Subject<string>();

  // state
  public frame = 0;

  constructor(
    // state
    private clientInfo: ClientInfo,
  ) {}

  abstract update(): void;

  /**
   * Informs the player object about events.
   * 
   * In local player, the events will be executed immediately and buffered to be sent to the server.
   * 
   * In remote player, the events be buffered to be executed later during update loop when the remote simulation catches up.
   */
  abstract handleEvent(clientEvent: ClientEvent): void;

  protected runFrame() {
    this.debugSubject.next('abcdefghij'.charAt(this.frame % 10));
    this.frame++;
  }

  protected runEvent(event: GameEvent) {
    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      this.debugSubject.next(inputEvent.key.toString());
    }
  }

  canMove(move: InputKey) {
    return true;
  }
}
