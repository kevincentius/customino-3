import { Game } from "@shared/game/engine/game/game";
import { TileType } from "@shared/game/engine/model/tile-type";
import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { PlayerState } from "@shared/game/engine/serialization/player-state";
import { MemoryPieceGen, PieceGen } from "@shared/game/engine/util/piece-factory/piece-gen";
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
  private pieceGen: PieceGen;
  public activePiece: ActivePiece;

  constructor(
    // reference
    protected game: Game,

    startPlayerData: StartPlayerData,
  ) {
    this.init();

    this.r = new RandomGen(startPlayerData.randomSeed);
    this.board = new Board();
    this.pieceGen = new MemoryPieceGen(this.r, [{ size: 4 }], 1);
    this.activePiece = new ActivePiece(this.board);

    this.activePiece.spawn(this.pieceGen.next());
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

    this.board.placeTile(this.r.int(10), this.r.int(10), { color: this.r.int(8), type: TileType.FILLED });
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
