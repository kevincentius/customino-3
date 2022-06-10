import { Board, PlaceTileEvent } from "@shared/game/engine/player/board";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { BoardLayout } from "app/pixi/layout/board-layout";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";


export class BoardDisplay extends Container {
  // helpers
  spritesheet = new GameSpritesheet();
  layout;
  
  // children
  minos: MinoDisplay[][];

  constructor(
    private board: Board
  ) {
    super();

    this.layout = new BoardLayout(500, 900, this.board.visibleHeight, this.board.tiles[0].length);
    this.minos = Array.from(Array(this.board.tiles.length), () => Array(this.board.tiles[0].length));

    this.board.placeTileSubject.subscribe(e => this.onPlaceTile(e));

    for (let i = 0; i < this.board.tiles.length; i++) {
      for (let j = 0; j < this.board.tiles[i].length; j++) {
        if(this.board.tiles[i][j] != null) {
          this.onPlaceTile({
            y: i,
            x: j,
            tile: this.board.tiles[i][j],
          });
        }
      }
    }
  }

  onPlaceTile(e: PlaceTileEvent) {
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
