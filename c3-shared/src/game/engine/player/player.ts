import { Game } from "@shared/game/engine/game/game";
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
  gameOverSubject = new Subject<void>();
  gameEventSubject = new Subject<GameEvent>();

  // state
  frame = 0;
  alive = true;
  
  // composition
  private r: RandomGen;
  public board: Board;
  private pieceGen: PieceGen;
  public activePiece: ActivePiece;

  // configs
  private actionMap: Map<InputKey, () => any> = new Map([
    [InputKey.LEFT, () => this.onAttemptMove(0, -1, 0)],
    [InputKey.RIGHT, () => this.onAttemptMove(0, 1, 0)],
    [InputKey.SOFT_DROP, () => this.onAttemptMove(1, 0, 0)],
    [InputKey.HARD_DROP, () => this.onHardDrop()],
    [InputKey.SONIC_DROP, () => this.onSonicDrop()],
    [InputKey.RCW, () => this.onAttemptMove(0, 0, 1)],
    [InputKey.RCCW, () => this.onAttemptMove(0, 0, 3)],
    [InputKey.R180, () => this.onAttemptMove(0, 0, 2)],
  ]);

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
      randomState: JSON.stringify(this.r.serialize()),
      board: this.board.serialize(),
    };
  }

  load(playerState: PlayerState) {
    this.alive = playerState.alive;
    this.frame = playerState.frame;
    this.r = new RandomGen(undefined, JSON.parse(playerState.randomState));
    this.board.load(playerState.board);
  }

  protected runFrame() {
    this.frame++;
  }

  protected runEvent(event: GameEvent) {
    this.gameEventSubject.next(event);

    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      
      this.actionMap.get(inputEvent.key)!();
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

  onAttemptMove(dy: number, dx: number, drot: number) {
    return this.activePiece.attemptMove(dy, dx, drot);
  }

  onSonicDrop() {
    let success = false;
    while (this.activePiece.attemptMove(1, 0, 0)) {
      success = true;
    }
    return success;
  }

  onHardDrop() {
    if (!this.activePiece.piece) {
      return false;
    }

    this.onSonicDrop();
    
    this.board.placePiece(this.activePiece.piece, this.activePiece.y, this.activePiece.x);
    const linesCleared = this.board.checkLineClear(this.activePiece.y, this.activePiece.y + this.activePiece.piece.tiles.length);
    console.log(linesCleared);
    this.board.clearLines(linesCleared);
    this.activePiece.spawn(this.pieceGen.next());

    if (this.activePiece.checkCollision()) {
      this.die();
    }
    return true;
  }
}
