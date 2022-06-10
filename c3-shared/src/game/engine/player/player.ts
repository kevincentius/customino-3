import { Game } from "@shared/game/engine/game/game";
import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Board } from "@shared/game/engine/player/board";
import { PlayerState } from "@shared/game/engine/serialization/player-state";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { SystemEvent } from "@shared/game/network/model/event/system-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { Subject } from 'rxjs';

export abstract class Player {
  // event emitters
  debugSubject = new Subject<string | null>();
  gameOverSubject = new Subject<void>();
  gameEventSubject = new Subject<GameEvent>();

  // state
  frame = 0;
  alive = true;
  private debugCount = 0;
  
  // composition
  private r: RandomGen;
  public board: Board;

  constructor(
    // reference
    protected game: Game,

    startPlayerData: StartPlayerData,
  ) {
    this.init();

    this.r = new RandomGen(startPlayerData.randomSeed);
    this.board = new Board();
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

  serialize(): PlayerState {
    return {
      frame: this.frame,
      alive: this.alive,
      debugCount: this.debugCount,
      randomState: JSON.stringify(this.r.serialize()),
      board: this.board.serialize(),
    };
  }

  load(playerState: PlayerState) {
    this.alive = playerState.alive;
    this.debugCount = playerState.debugCount;
    this.frame = playerState.frame;
    this.r = new RandomGen(undefined, JSON.parse(playerState.randomState));
    this.board.load(playerState.board);
  }

  protected runFrame() {
    this.debugSubject.next(null);
    this.frame++;
    
    // debug: set random tiles on the board
    const rule = playerRule;
    // for (let i = 0; i < 4; i++) {
      this.board.placeTile(this.r.int(rule.height + rule.invisibleHeight), this.r.int(rule.width), { color: this.r.int(7), type: TileType.FILLED });
    // }
  }

  protected runEvent(event: GameEvent) {
    this.gameEventSubject.next(event);

    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      this.debugSubject.next(inputEvent.key.toString());

      this.debugCount++;
      if (this.debugCount >= 10) {
        this.die();
      }
    } else if (event.type == GameEventType.SYSTEM) {
      const inputEvent = event as SystemEvent;
      
      if (inputEvent.gameOver) {
        this.die();
      }
    }
  }

  public die() {
    if (this.alive) {
      this.alive = false;
      this.gameOverSubject.next();
    }
  }

  canMove(move: InputKey) {
    return this.alive && true;
  }

  isRunning() {
    return this.game.running;
  }
}
