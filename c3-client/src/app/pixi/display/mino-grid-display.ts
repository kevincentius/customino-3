import { Tile } from "@shared/game/engine/model/tile";
import { PlaceTileEvent } from "@shared/game/engine/player/board";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { MinoGridLayout } from "app/pixi/layout/mino-grid-layout";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";

export class MinoGridDisplay extends Container {
  // helpers
  spritesheet = new GameSpritesheet();
  layout: MinoGridLayout;
  
  // children
  minos: MinoDisplay[][];

  constructor(width: number, height: number, private tiles: Tile[][], visibleHeight=tiles.length) {
    super();

    this.layout = new MinoGridLayout(width, height, visibleHeight, this.tiles[0].length);

    this.minos = Array.from(Array(this.tiles.length), () => Array(this.tiles[0].length));
  }
  
  placeTile(e: PlaceTileEvent) {
    if (this.minos[e.y][e.x] != null) {
      this.removeChild(this.minos[e.y][e.x]!);
      this.minos[e.y][e.x] = null!;
    }

    const mino = new MinoDisplay(this.spritesheet, e.tile);
    mino.scale.set(this.layout.minoScale);
    mino.position.set(
      this.layout.offsetX + this.layout.minoSize * e.x,
      this.layout.offsetY - this.layout.minoSize * (e.y + 1),
    );
    this.addChild(mino);
    this.minos[e.y][e.x] = mino;
  }
}
