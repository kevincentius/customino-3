import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { Board } from "@shared/game/engine/player/board";
import { Piece } from "@shared/game/engine/player/piece";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { Subject } from "rxjs";

export interface PieceMoveEvent {
  dy: number;
  dx: number;
  drot: number;
  kick: boolean;
}

export class ActivePiece {
  // events
  spawnSubject = new Subject<null>();
  moveSubject = new Subject<PieceMoveEvent>();

  // state
  piece: Piece | null = null;
  x = 2;
  y = 2;
  isLastMoveRotation = false;

  gravityFrameCount = 0;
  gravity = 0; // tiles per second

  lockDelayFrameCount = 0;

  // config
  readonly gravityCap = 18;
  readonly gravityAccel = 0.0; // tiles per second^2
  readonly lockDelay = 0.5; // seconds

  constructor(
    private board: Board,
    private onLockDelayExhausted: () => void,
  ) {

  }

  serialize() {
    return {
      piece: this.piece?.serialize(),
      x: this.x,
      y: this.y,
      isLastMoveRotation: this.isLastMoveRotation,
      
      gravityFrameCount: this.gravityFrameCount,
      gravity: this.gravity,

      lockDelayFrameCount: this.lockDelayFrameCount,
    }
  }

  load(state: any) {
    this.piece = Piece.from(state.piece);
    this.x = state.x;
    this.y = state.y;
    this.isLastMoveRotation = state.isLastMoveRotation;

    this.gravityFrameCount = state.gravityFrameCount;
    this.gravity = state.gravity;

    this.lockDelayFrameCount = state.lockDelayFrameCount;
  }

  spawn(piece: Piece) {
    this.piece = piece;
    this.x = 3;
    this.y = this.board.invisibleHeight;
    this.gravityFrameCount = 0;
    this.lockDelayFrameCount = 0;

    this.spawnSubject.next(null);
  }

  attemptMove(dy: number, dx: number, drot: number) {
    if (!this.piece) {
      return false;
    }

    const prevY = this.y;
    const prevX = this.x;

    this.y += dy;
    this.x += dx;
    this.piece.rotate(drot);

    if (this.checkCollision()) {
      // TODO: attempt kicks

      // failed. Undo move
      this.piece.rotate(-drot);
      this.x = prevX;
      this.y = prevY;
      return false;
    } else {
      this.moveSubject.next({ dy, dx, drot, kick: false });
      return true;
    }
  }

  checkCollision(di=0, dj=0) {
    if (this.piece == null) {
      return false;
    }

    let tiles = this.piece.tiles;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j] != null) {
          const ty = this.y + i + di;
          const tx = this.x + j + dj;
          if (!MatUtil.isInside(ty, tx, this.board.tiles) || this.board.tiles[ty][tx] != null) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  runFrame() {
    // gravity
    this.gravity += this.gravityAccel;
    this.gravityFrameCount++;
    const framesPerG = 1 / (this.gravity * gameLoopRule.mspf / 1000);
    while (this.gravityFrameCount >= framesPerG) {
      this.gravityFrameCount -= framesPerG;
      this.attemptMove(1, 0, 0);
    }

    // lock delay
    this.y++;
    const grounded = this.checkCollision();
    this.y--;
    if (grounded) {
      this.lockDelayFrameCount++;
      if (this.lockDelayFrameCount >= this.lockDelay * 1000 / gameLoopRule.mspf) {
        this.onLockDelayExhausted();
      }
    }
  }

  calcGhostDistance() {
    for (let i = 1; i < this.board.tiles.length; i++) {
      if (this.checkCollision(i, 0)) {
        return i - 1;
      }
    }
    throw new Error();
  }
}
