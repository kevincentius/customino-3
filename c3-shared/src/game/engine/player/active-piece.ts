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

  constructor(
    private board: Board
  ) {

  }

  spawn(piece: Piece) {
    this.piece = piece;
    this.x = 3;
    this.y = this.board.invisibleHeight;

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

  checkCollision() {
    if (this.piece == null) {
      return false;
    }

    let tiles = this.piece.tiles;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j] != null) {
          const ty = this.y + i;
          const tx = this.x + j;
          if (!MatUtil.isInside(ty, tx, this.board.tiles) || this.board.tiles[ty][tx] != null) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
