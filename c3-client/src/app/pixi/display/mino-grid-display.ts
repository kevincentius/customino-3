import { Tile } from "@shared/game/engine/model/tile";
import { PlaceTileEvent } from "@shared/game/engine/player/board";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";

export class MinoGridDisplay extends Container {
  // helpers
  spritesheet = new GameSpritesheet();
  private minoScale: number;
  
  // children
  minos: MinoDisplay[][];

  constructor(private tiles: Tile[][], private minoSize: number) {
    super();

    this.minoScale = this.minoSize / this.spritesheet.mino[0].width;

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

    const mino = new MinoDisplay(this.spritesheet, e.tile);
    mino.scale.set(this.minoScale);
    mino.position.set(
      this.minoSize * e.x,
      -this.minoSize * (e.y + 1),
    );
    this.addChild(mino);
    this.minos[e.y][e.x] = mino;
  }
  
  toLocalPos(row: number, col: number) {
    return {
      x: col * this.minoSize,
      y: -row * this.minoSize,
    }
  }
}
