import { Game } from "@shared/game/engine/game/game";
import { computePlayerRule, PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { GarbageGen } from "@shared/game/engine/player/garbage-gen/garbage-gen";
import { LockPlacementResult, LockResult } from "@shared/game/engine/player/lock-result";
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
import { createRotationSystem, RotationSystem } from "@shared/game/engine/player/rotation/rotation-system";
import { AttackRule } from "@shared/game/engine/player/attack-rule";
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { PlayerInfo } from "@shared/game/engine/player/player-info";
import { PlayerStatsTracker } from "@shared/game/engine/player/stats/player-stats-tracker";
import { PlayerStats } from "@shared/game/engine/player/stats/player-stats";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { VictoryChecker } from "@shared/game/engine/player/victory-condition/victory-checker";

export abstract class Player {
  // event emitters
  clockStartSubject = new Subject<void>(); // echoes clockStart event from the game
  gameOverCheckSubject = new Subject<void>(); // fired when global game over needs to be checked
  gameOverSubject = new Subject<PlayerStats>();
  gameEventSubject = new Subject<GameEvent>();
  pieceLockSubject = new Subject<LockResult>();
  pieceSpawnSubject = new Subject<void>();

  // state
  playerRule: PlayerRule;
  frame = 0;
  finalScore: number | undefined = undefined; // finalScore stays undefined until the game is over for this player
  alive = true;
  afkFlag = true;
  pieceQueue: Piece[] = [];
  attackRule: AttackRule;
  playerInfo: PlayerInfo;

  // stateful composition
  r: RandomGen;
  board: Board;
  pieceGen: PieceGen;
  activePiece: ActivePiece;
  garbageGen: GarbageGen;
  statsTracker: PlayerStatsTracker;
  victoryChecker: VictoryChecker;
  
  // transient
  lastFrameMs = Date.now();

  // stateless
  rotationSystem: RotationSystem;

  // configs
  private actionMap: Map<InputKey, () => boolean> = new Map([
    [InputKey.LEFT, () => this.attemptMove(0, -1, 0)],
    [InputKey.RIGHT, () => this.attemptMove(0, 1, 0)],
    [InputKey.SOFT_DROP, () => this.attemptMove(1, 0, 0)],
    [InputKey.HARD_DROP, () => this.hardDrop()],
    [InputKey.SONIC_DROP, () => this.sonicDrop() > 0],
    [InputKey.RCW, () => this.attemptMove(0, 0, 1)],
    [InputKey.RCCW, () => this.attemptMove(0, 0, 3)],
    [InputKey.R180, () => this.attemptMove(0, 0, 2)],
  ]);
  pieceList = [{ size: 4 }];

  constructor(
    // reference
    protected game: Game,

    startPlayerData: StartPlayerData,
    localRule: LocalRule | undefined,
  ) {
    this.playerInfo = {
      name: startPlayerData.clientInfo.username,
      accountId: startPlayerData.clientInfo.accountId,
    };

    this.init();

    this.playerRule = computePlayerRule(this.game.startGameData.roomRule, startPlayerData.slotSettings, startPlayerData.userRule, localRule);

    this.r = new RandomGen(startPlayerData.randomSeed);
    this.board = new Board(this.playerRule);
    this.pieceGen = new MemoryPieceGen(this.r, this.pieceList, 1);
    this.activePiece = new ActivePiece(this.playerRule.gravity, this.board, () => this.hardDrop());
    this.rotationSystem = createRotationSystem(this.playerRule.rotationSystem);
    this.pieceQueue.push(...Array.from(Array(this.playerRule.previews)).map(() => this.pieceGen.next()));
    this.garbageGen = new GarbageGen(this, this.playerRule);
    this.attackRule = new AttackRule(this);
    this.statsTracker = new PlayerStatsTracker(this);
    this.victoryChecker = new VictoryChecker(this);

    this.spawnPiece();

    this.game.clockStartSubject.subscribe(() => {
      this.clockStartSubject.next();
    });

    this.game.gameOverSubject.subscribe(() => {
      if (this.alive && !this.finalScore) {
        this.gameOverSubject.next(this.statsTracker.stats);
      }
    });
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
      afkFlag: this.afkFlag,
      finalScore: this.finalScore,
      pieceQueue: this.pieceQueue.map(p => p.serialize()),
      attackRule: this.attackRule.serialize(),

      randomState: JSON.stringify(this.r.serialize()),
      board: this.board.serialize(),
      pieceGen: this.pieceGen.serialize(),
      activePiece: this.activePiece.serialize(),
      garbageGen: this.garbageGen.serialize(),
      stats: this.statsTracker.serialize(),
      victoryChecker: this.victoryChecker.serialize(),
    };
  }

  load(playerState: PlayerState) {
    this.frame = playerState.frame;
    this.alive = playerState.alive;
    this.afkFlag = playerState.afkFlag;
    this.finalScore = playerState.finalScore;
    this.pieceQueue.splice(0, this.pieceQueue.length, ...playerState.pieceQueue.map(p => Piece.from(p)));
    this.attackRule.load(playerState.attackRule);

    this.r = new RandomGen(undefined, JSON.parse(playerState.randomState));
    this.board.load(playerState.board);
    this.pieceGen = loadPieceGen(this.r, this.pieceList, playerState.pieceGen);
    this.activePiece.load(playerState.activePiece);
    this.garbageGen.load(playerState.garbageGen);
    this.statsTracker.load(playerState.stats);
    this.victoryChecker.load(playerState.victoryChecker);
  }

  protected runFrame() {
    this.activePiece.runFrame();
    this.attackRule.runFrame();
    this.garbageGen.runFrame();
    this.statsTracker.runFrame();
    this.frame++;
    this.lastFrameMs = Date.now();
  }

  getSecondsSinceFrame(now=Date.now(), frame: number=this.frame): number {
    return (this.frame - frame) / gameLoopRule.fps + (now - this.lastFrameMs) / 1000;
  }

  protected runEvent(event: GameEvent): boolean {
    this.gameEventSubject.next(event);

    if (event.type == GameEventType.INPUT) {
      this.afkFlag = false;

      const inputEvent = event as InputEvent;
      return this.actionMap.get(inputEvent.key)!();
    } else if (event.type == GameEventType.ATTACK_ACK) {
      const gbEvent = event as AttackAckEvent;
      this.garbageGen.queueAttack(gbEvent.attackDistribution.attacks);
      
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
      // TODO: scoring rules
      this.finalScore = this.game.players.filter(p => !p.alive).length;

      this.alive = false;
      this.gameOverSubject.next(this.statsTracker.stats);
      this.gameOverCheckSubject.next();
    }
  }

  winByPlayer() {
    this.finalScore = Math.random(); // TODO: score
    this.gameOverSubject.next(this.statsTracker.stats);
    this.gameOverCheckSubject.next();
  }

  canMove(move: InputKey) {
    return this.alive;
  }

  isRunning() {
    return this.game.running;
  }

  private sonicDrop(): number {
    let di = 1;
    while (!this.activePiece.checkCollision(di, 0)) {
      di++;
    }
    di--;
    if (di > 0) {
      this.activePiece.attemptMove(di, 0, 0);
    }
    return di;
  }

  private hardDrop() {
    if (!this.activePiece.piece) {
      return false;
    }

    // lock piece
    const dropDistance = this.sonicDrop();
    this.board.placePiece(this.activePiece.piece, this.activePiece.y, this.activePiece.x);
    
    // check line clear
    const clearedLines = this.board.checkLineClear(this.activePiece.y, this.activePiece.y + this.activePiece.piece.tiles.length);
    const clearedGarbageLines = clearedLines.filter(line => this.board.isGarbage(line));
    const clearedDigLines = clearedLines.filter(line => this.board.isDigLine(line));
    this.board.clearLines(clearedLines, this.activePiece.x + this.activePiece.piece.tiles[0].length / 2);
    
    // calculate and apply move result
    const lockResult: LockPlacementResult = {
      clearedLines,
      clearedGarbageLines,
      clearedDigLines,
      dropDistance: dropDistance,
    }
    
  let powers = this.attackRule.calcAttacks(lockResult);
    const attacks = this.garbageGen.applyBlock(powers.map(a => ({ power: a.power, type: a.type })));
    const attackResult: LockResult = {
      ...lockResult,
      powers: powers,
      attacks: attacks,
    }
    this.pieceLockSubject.next(attackResult);

    // spawn next piece
    this.spawnPiece();

    // death detection
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
