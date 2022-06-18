import { Game } from "@shared/game/engine/game/game";
import { PlayerRule, playerRule } from "@shared/game/engine/model/rule/player-rule";
import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { GarbageGen } from "@shared/game/engine/player/garbage-gen";
import { LockIntermediateResult, LockResult } from "@shared/game/engine/player/lock-result";
import { Piece } from "@shared/game/engine/player/piece";
import { PlayerState } from "@shared/game/engine/serialization/player-state";
import { loadPieceGen, MemoryPieceGen, PieceGen } from "@shared/game/engine/util/piece-factory/piece-gen";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent, GameEventType } from "@shared/game/network/model/event/game-event";
import { InputEvent } from "@shared/game/network/model/event/input-event";
import { SystemEvent } from "@shared/game/network/model/event/system-event";
import { InputKey } from "@shared/game/network/model/input-key";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { Subject } from 'rxjs';
import { AttackAckEvent } from "@shared/game/network/model/event/attack-ack";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { createRotationSystem, RotationSystem } from "@shared/game/engine/player/rotation/rotation-system";
import { AttackRule } from "@shared/game/engine/player/attack-rule";

export abstract class Player {
  // event emitters
  gameOverSubject = new Subject<void>();
  gameEventSubject = new Subject<GameEvent>();
  pieceLockSubject = new Subject<LockResult>();
  pieceSpawnSubject = new Subject<void>();

  // state
  playerRule: PlayerRule;
  frame = 0;
  alive = true;
  pieceQueue: Piece[] = [];
  attackQueue: QueuedAttack[] = [];
  attackRule: AttackRule;
  
  // stateful composition
  r: RandomGen;
  board: Board;
  pieceGen: PieceGen;
  activePiece: ActivePiece;
  garbageGen: GarbageGen;
  
  // stateless
  rotationSystem: RotationSystem;

  // configs
  private actionMap: Map<InputKey, () => boolean> = new Map([
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

    this.playerRule = playerRule;

    this.r = new RandomGen(startPlayerData.randomSeed);
    this.board = new Board(this.playerRule);
    this.pieceGen = new MemoryPieceGen(this.r, this.pieceList, 1);
    this.activePiece = new ActivePiece(this.board, () => this.hardDrop());
    this.rotationSystem = createRotationSystem(this.playerRule.rotationSystem);
    this.pieceQueue.push(...Array.from(Array(this.playerRule.previews)).map(() => this.pieceGen.next()));
    this.garbageGen = new GarbageGen(this, this.playerRule);
    this.attackRule = new AttackRule(this);

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
      attackQueue: JSON.stringify(this.attackQueue),
      attackRule: this.attackRule.serialize(),

      randomState: JSON.stringify(this.r.serialize()),
      board: this.board.serialize(),
      pieceGen: this.pieceGen.serialize(),
      activePiece: this.activePiece.serialize(),
      garbageGen: this.garbageGen.serialize(),
    };
  }

  load(playerState: PlayerState) {
    this.frame = playerState.frame;
    this.alive = playerState.alive;
    this.pieceQueue.splice(0, this.pieceQueue.length, ...playerState.pieceQueue.map(p => Piece.from(p)));
    this.attackQueue.splice(0, this.attackQueue.length,...JSON.parse(playerState.attackQueue));
    this.attackRule.load(playerState.attackRule);

    this.r = new RandomGen(undefined, JSON.parse(playerState.randomState));
    this.board.load(playerState.board);
    this.pieceGen = loadPieceGen(this.r, this.pieceList, playerState.pieceGen);
    this.activePiece.load(playerState.activePiece);
    this.garbageGen.load(playerState.garbageGen);
  }

  protected runFrame() {
    this.activePiece.runFrame();
    this.garbageGen.runFrame();
    this.frame++;
  }

  protected runEvent(event: GameEvent): boolean {
    this.gameEventSubject.next(event);

    if (event.type == GameEventType.INPUT) {
      const inputEvent = event as InputEvent;
      
      return this.actionMap.get(inputEvent.key)!();
    } else if (event.type == GameEventType.ATTACK_ACK) {
      const gbEvent = event as AttackAckEvent;
      this.attackQueue.push(...gbEvent.attackDistribution.attacks.map(attack => ({ attack: attack, powerLeft: attack.power })));
      
      return true;
    } else if (event.type == GameEventType.SYSTEM) {
      const inputEvent = event as SystemEvent;
      
      if (inputEvent.gameOver) {
        this.die();
      }
      
      return true;
    } else {
      throw new Error('Unknown event type: ' + JSON.stringify(event));
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
    const lockResult: LockIntermediateResult = {
      clearedLines,
      clearedGarbageLines,
    }
    
    const attackResult: LockResult = {
      ...lockResult,
      attacks: this.attackRule.calcAttacks(lockResult),
    }
    this.pieceLockSubject.next(attackResult);

    // spawn next piece
    this.spawnPiece();

    if (this.activePiece.checkCollision()) {
      this.die();
    }
    return true;
  }
  
  private attemptMove(dy: number, dx: number, drot: number) {
    const kickTable = this.rotationSystem.getKickTable(this.activePiece.piece!, drot);
    return this.activePiece.attemptMove(dy, dx, drot, kickTable);
  }

  private spawnPiece() {
    if (this.playerRule.previews == 0) {
      this.activePiece.spawn(this.pieceGen.next());
    } else {
      this.activePiece.spawn(this.pieceQueue.shift()!);
      this.pieceQueue.push(this.pieceGen.next());
    }
    this.pieceSpawnSubject.next();
  }
}
