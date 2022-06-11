import { Tile } from "@shared/game/engine/model/tile";
import { PlaceTileEvent } from "@shared/game/engine/player/board";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";

export class MinoGridDisplay extends Container {
  // helpers
  spritesheet = new GameSpritesheet();
  
  // children
  minos: MinoDisplay[][];

  constructor(private tiles: Tile[][], private minoSize: number, private invisibleHeight=0) {
    super();

    this.minos = Array.from(Array(this.tiles.length), () => Array(this.tiles[0].length));

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if(this.tiles[i][j] != null) {
          this.placeTile({
            y: i,
            x: j,
            tile: this.tiles[i][j],
          });
        }
      }
    }
  }
  
  placeTile(e: PlaceTileEvent) {
    if (this.minos[e.y][e.x] != null) {
      this.removeChild(this.minos[e.y][e.x]!);
      this.minos[e.y][e.x] = null!;
    }

    const mino = new MinoDisplay(this.spritesheet, e.tile, this.minoSize);
    const {x, y} = this.calcMinoPos(e.y, e.x);
    mino.position.set(x, y);
    this.addChild(mino);
    this.minos[e.y][e.x] = mino;
  }

  rotate(drot: number) {
    for (let i = 0; i < (drot + 400000) % 4; i++) {
      this.minos = MatUtil.rotate(this.minos);
    }

    for (let i = 0; i < this.minos.length; i++) {
      for (let j = 0; j < this.minos[i].length; j++) {
        if(this.minos[i][j] != null) {
          const {x, y} = this.calcMinoPos(i, j);
          this.minos[i][j].position.set(x, y);
        }
      }
    }
  }
  
  calcMinoPos(row: number, col: number) {
    return {
      x: col * this.minoSize,
      y: (row - this.invisibleHeight) * this.minoSize,
    }
  }
}
