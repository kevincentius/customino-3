import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Piece } from "@shared/game/engine/player/piece";
import { BoardState } from "@shared/game/engine/serialization/board-state";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { Subject } from "rxjs";

export interface PlaceTileEvent { y: number, x: number, tile: (Tile | null) }
export interface LineClearEvent { rows: { y: number, epicenter: number }[] }

export class Board {
  // events
  resetSubject = new Subject<number[]>();
  placeTileSubject = new Subject<PlaceTileEvent>();
  lineClearSubject = new Subject<LineClearEvent>();
  addRowsSubject = new Subject<number>();

  // state
  tiles: (Tile | null)[][];
  invisibleHeight: number;
  visibleHeight: number;

  constructor(
    private playerRule: PlayerRule,
  ) {
    const rule = this.playerRule;
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
    this.invisibleHeight = this.playerRule.invisibleHeight;
    this.visibleHeight = this.playerRule.height;
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
  clearLines(rows: number[], epicenter: number) {
    if (rows.length == 0) {
      return;
    }

    MatUtil.clearLines(this.tiles, rows);

    this.lineClearSubject.next({
      rows: rows.map(row => ({
        y: row,
        epicenter: epicenter,
      }))
    });
  }

  private isRowCleared(row: number) {
    for (let cell of this.tiles[row]) {
      if (cell == null || cell.type == TileType.CHEESE_HOLE) {
        return false;
      }
    }
    return true;
  }

  isGarbage(row: number) {
    for (let cell of this.tiles[row]) {
      if (cell != null && (cell.type == TileType.GARBAGE)) {
        return true;
      }
    }
    return false;
  }

  isDigLine(row: number) {
    for (let cell of this.tiles[row]) {
      if (cell != null && (cell.type == TileType.CHEESE || cell.type == TileType.CHEESE_HOLE)) {
        return true;
      }
    }
    return false;
  }

  addBottomRows(rows: (Tile | null)[][]) {
    MatUtil.addBottomRows(this.tiles, rows);
    this.addRowsSubject.next(rows.length);
  }
}
