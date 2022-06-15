import { Game } from "@shared/game/engine/game/game";
import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { LockResult } from "@shared/game/engine/player/lock-result";
import { Piece } from "@shared/game/engine/player/piece";
import { PlayerState } from "@shared/game/engine/serialization/player-state";
import { loadPieceGen, MemoryPieceGen, PieceGen } from "@shared/game/engine/util/piece-factory/piece-gen";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { GarbageAcknowledgement as GarbageAcknowledgementEvent } from "@shared/game/network/model/event/garbage-acknowledgement";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { ServerPlayerEvent } from "@shared/game/network/model/event/server-event";
import { SystemEvent } from "@shared/game/network/model/event/system-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { Subject } from 'rxjs';

export abstract class Player {
  // event emitters
  gameOverSubject = new Subject<void>();
  gameEventSubject = new Subject<GameEvent>();
  pieceLockSubject = new Subject<LockResult>();
  pieceSpawnSubject = new Subject<void>();

  // state
  frame = 0;
  alive = true;
  pieceQueue: Piece[] = [];
  
  // composition
  private r: RandomGen;
  public board: Board;
  private pieceGen: PieceGen;
  public activePiece: ActivePiece;

  // configs
  private actionMap: Map<InputKey, () => any> = new Map([
    [InputKey.LEFT, () => this.attemptMove(0, -1, 0)],
    [InputKey.RIGHT, () => this.attemptMove(0, 1, 0)],
    [InputKey.SOFT_DROP, () => this.attemptMove(1, 0, 0)],
    [InputKey.HARD_DROP, () => this.hardDrop()],
    [InputKey.SONIC_DROP, () => this.sonicDrop()],
    [InputKey.RCW, () => this.attemptMove(0, 0, 1)],
    [InputKey.RCCW, () => this.attemptMove(0, 0, 3)],
    [InputKey.R180, () => this.attemptMove(0, 0, 2)],
  ]);
  pieceList = [{ size: 4 }];

  constructor(
    // reference
    protected game: Game,

    startPlayerData: StartPlayerData,
  ) {
    this.init();

    this.r = new RandomGen(startPlayerData.randomSeed);
    this.board = new Board();
    this.pieceGen = new MemoryPieceGen(this.r, this.pieceList, 1);
    this.activePiece = new ActivePiece(this.board, () => this.hardDrop());
    this.pieceQueue.push(...Array.from(Array(playerRule.previews)).map(() => this.pieceGen.next()));

    this.spawnPiece();
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
      pieceQueue: this.pieceQueue.map(p => p.serialize()),
      randomState: JSON.stringify(this.r.serialize()),
      board: this.board.serialize(),
      pieceGen: this.pieceGen.serialize(),
      activePiece: this.activePiece.serialize(),
    };
  }

  load(playerState: PlayerState) {
    this.frame = playerState.frame;
    this.alive = playerState.alive;
    this.pieceQueue = playerState.pieceQueue.map(p => Piece.from(p));
    this.r = new RandomGen(undefined, JSON.parse(playerState.randomState));
    this.board.load(playerState.board);
    this.pieceGen = loadPieceGen(this.r, this.pieceList, playerState.pieceGen);
    this.activePiece.load(playerState.activePiece);
  }

  protected runFrame() {
    this.activePiece.runFrame();
    this.frame++;
  }

  protected runEvent(event: GameEvent) {
    this.gameEventSubject.next(event);

    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      
      this.actionMap.get(inputEvent.key)!();
    } else if (event.type == GameEventType.GARBAGE_ACKNOWLEDGMENT) {
      const gbEvent = event as GarbageAcknowledgementEvent;
      console.log('Player receives garbage', gbEvent);
    } else if (event.type == GameEventType.SYSTEM) {
      const inputEvent = event as SystemEvent;
      
      if (inputEvent.gameOver) {
        this.die();
      }
    }
  }

  die() {
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

  private sonicDrop() {
    let success = false;
    while (this.activePiece.attemptMove(1, 0, 0)) {
      success = true;
    }
    return success;
  }

  private hardDrop() {
    if (!this.activePiece.piece) {
      return false;
    }

    // lock piece
    this.sonicDrop();
    this.board.placePiece(this.activePiece.piece, this.activePiece.y, this.activePiece.x);
    
    // check line clear
    const clearedLines = this.board.checkLineClear(this.activePiece.y, this.activePiece.y + this.activePiece.piece.tiles.length);
    this.board.clearLines(clearedLines);

    // calculate and apply move result
    const clearedGarbageLines = clearedLines.filter(line => this.board.isGarbage(line));
    this.pieceLockSubject.next({
      clearedLines,
      clearedGarbageLines,
      
      attackPower: [Math.max(0, clearedLines.length - 1)].filter(atk => atk > 0),
    });

    // spawn next piece
    this.spawnPiece();

    if (this.activePiece.checkCollision()) {
      this.die();
    }
    return true;
  }
  
  private attemptMove(dy: number, dx: number, drot: number) {
    return this.activePiece.attemptMove(dy, dx, drot);
  }

  private spawnPiece() {
    if (playerRule.previews == 0) {
      this.activePiece.spawn(this.pieceGen.next());
    } else {
      this.activePiece.spawn(this.pieceQueue.shift()!);
      this.pieceQueue.push(this.pieceGen.next());
    }
    this.pieceSpawnSubject.next();
  }
}
