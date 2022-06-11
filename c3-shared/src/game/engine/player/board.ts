import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";
import { Piece } from "@shared/game/engine/player/piece";
import { BoardState } from "@shared/game/engine/serialization/board-state";
import { Subject } from "rxjs";

export interface PlaceTileEvent { y: number, x: number, tile: Tile };

export class Board {
  // events
  resetSubject = new Subject<number[]>();
  placeTileSubject = new Subject<PlaceTileEvent>();

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
}
