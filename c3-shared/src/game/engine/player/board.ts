import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Piece } from "@shared/game/engine/player/piece";
import { BoardState } from "@shared/game/engine/serialization/board-state";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { Subject } from "rxjs";

export interface PlaceTileEvent { y: number, x: number, tile: Tile };

export class Board {
  // events
  resetSubject = new Subject<number[]>();
  placeTileSubject = new Subject<PlaceTileEvent>();
  lineClearSubject = new Subject<number[]>();

  // state
  tiles: Tile[][];
  invisibleHeight: number;
  visibleHeight: number;

  constructor() {
    const rule = playerRule;
    this.tiles = Array.from(Array(rule.height + rule.invisibleHeight), () => Array(rule.width));
    this.invisibleHeight = rule.invisibleHeight;
    this.visibleHeight = rule.height;
  }

  serialize(): BoardState {
    return {
      tiles: JSON.stringify(this.tiles),
    };
  }

  load(s: BoardState) {
    const rule = playerRule;
    this.invisibleHeight = rule.invisibleHeight;
    this.visibleHeight = rule.height;
    this.tiles = JSON.parse(s.tiles);
  }

  placeTile(y: number, x: number, tile: Tile) {
    this.tiles[y][x] = tile;
    this.placeTileSubject.next({ y, x, tile });
  }

  placePiece(piece: Piece, y: number, x: number) {
    for (let i = 0; i < piece.tiles.length; i++) {
      for (let j = 0; j < piece.tiles[i].length; j++) {
        if (piece.tiles[i][j] != null) {
          const ty = y + i;
          const tx = x + j;
          this.placeTile(ty, tx, piece.tiles[i][j]);
        }
      }
    }
  }

  checkLineClear(from=0, to=this.tiles.length): number[] {
    from = Math.max(0, from);
    to = Math.min(this.tiles.length, to);

    let ret: number[] = [];
    for (let i = from; i < to; i++) {
      if (this.isRowCleared(i)) {
        ret.push(i);
      }
    }
    return ret;
  }

  /** rows must be sorted ascending in row index (top to bottom visually in the board) */
  clearLines(rows: number[]) {
    if (rows.length == 0) {
      return;
    }

    MatUtil.clearLines(this.tiles, rows);

    this.lineClearSubject.next(rows);
  }

  private isRowCleared(row: number) {
    for (let cell of this.tiles[row]) {
      if (cell == null) {
        return false;
      }
    }
    return true;
  }

  isGarbage(row: number) {
    for (let cell of this.tiles[row]) {
      if (cell != null && (cell.type == TileType.GARBAGE || cell.type == TileType.CHEESE)) {
        return true;
      }
    }
    return false;
  }
}
