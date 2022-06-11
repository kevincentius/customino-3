import { Board } from "@shared/game/engine/player/board";
import { Piece } from "@shared/game/engine/player/piece";
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

  constructor(private board: Board) {
    
  }

  spawn(piece: Piece) {
    this.piece = piece;
    this.spawnSubject.next(null);

    // TODO: set position
  }
}
