import { Piece } from "@shared/game/engine/player/piece";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { Container } from "pixi.js";

export class PieceDisplay extends Container implements LayoutChild {

  layoutWidth = 0;
  layoutHeight: number;

  minoGridDisplay?: MinoGridDisplay;

  constructor(
    private piece: Piece,
    private minoSize: number,
    height: number,
  ) {
    super();

    this.layoutHeight = height;

    this.updatePiece(piece);
    console.log('create');
  }

  updatePiece(piece: Piece) {
    if (this.minoGridDisplay) {
      this.removeChild(this.minoGridDisplay);
      this.minoGridDisplay = undefined;
    }

    if (piece) {
      this.minoGridDisplay = new MinoGridDisplay(this.piece.tiles, this.minoSize);
      console.log(piece);
      console.log(MatUtil.countEmptyRowsBottom(this.piece.tiles), MatUtil.countEmptyRowsTop(this.piece.tiles));
      this.minoGridDisplay.position.set(
        Math.max(0, 4 - this.piece.tiles[0].length) / 2 * this.minoSize,
        (MatUtil.countEmptyRowsBottom(this.piece.tiles) - MatUtil.countEmptyRowsTop(this.piece.tiles) + (4 - this.piece.tiles.length)) / 2 * this.minoSize ,
      );
      this.addChild(this.minoGridDisplay);
    }
  }
}
