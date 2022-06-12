import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { pieceDataArray } from "@shared/game/engine/util/piece-factory/piece-data";

export class Piece {
  tiles: Tile[][];

  // rotation = total number of clockwise rotations from spawn orientation (0 - 3)
  constructor(private size: number, private pieceId: number, private rotation=0) {
    let p = pieceDataArray[size - 1][pieceId];

    this.tiles = Array.from(Array(p.matSize), () => Array(p.matSize));
    for (let pos of p.sparse) {
      this.tiles[pos[0]][pos[1]] = {
        color: p.color != null ? p.color : (pieceId % 7),
        type: TileType.FILLED,
      };
    }

    this.rotate(rotation);
  }

  serialize() {
    return [this.size, this.pieceId, this.rotation];
  }

  static from(state: number[]) {
    return new Piece(state[0], state[1], state[2]);
  }

  rotate(drot: number) {
    drot = (drot + 400000) % 4;
    for (let i = 0; i < drot; i++) {
      this.tiles = MatUtil.rotate(this.tiles);
    }
    this.rotation = (this.rotation + drot) % 4;
  }
}
