import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { Container } from "pixi.js";


export class BoardDisplay extends Container {
  // children
  minoGridDisplay: MinoGridDisplay;
  activePieceDisplay: ActivePieceDisplay;

  constructor(
    private board: Board,
    private activePiece: ActivePiece,
  ) {
    super();

    this.activePieceDisplay = new ActivePieceDisplay(this.activePiece);
    this.minoGridDisplay = new MinoGridDisplay(500, 900, this.board.tiles, this.board.visibleHeight);

    this.addChild(this.minoGridDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));

    for (let i = 0; i < this.board.tiles.length; i++) {
      for (let j = 0; j < this.board.tiles[i].length; j++) {
        if(this.board.tiles[i][j] != null) {
          this.minoGridDisplay.placeTile({
            y: i,
            x: j,
            tile: this.board.tiles[i][j],
          });
        }
      }
    }
  }
}
