import { PlayerRule } from "@shared/game/engine/model/rule/player-rule/player-rule";
import { Piece } from "@shared/game/engine/player/piece";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { Container } from "pixi.js";

export class PieceDisplay extends Container implements LayoutChild {

  layoutWidth = 200;
  layoutHeight: number;

  minoGridDisplay?: MinoGridDisplay;

  constructor(
    private piece: Piece,
    private minoSize: number,
    height: number,
    private playerRule: PlayerRule,
  ) {
    super();

    this.layoutHeight = height;

    this.updatePiece(piece);
  }

  updatePiece(piece: Piece) {
    if (this.minoGridDisplay) {
      this.removeChild(this.minoGridDisplay);
      this.minoGridDisplay = undefined;
    }

    if (piece) {
      this.minoGridDisplay = new MinoGridDisplay(this.piece.tiles, this.minoSize, 0, this.playerRule);
      this.minoGridDisplay.position.set(
        Math.max(0, this.layoutWidth - this.piece.tiles[0].length * this.minoSize) / 2,
        // Math.max(0, 4 - this.piece.tiles[0].length) / 2 * this.minoSize,
        (MatUtil.countEmptyRowsBottom(this.piece.tiles) - MatUtil.countEmptyRowsTop(this.piece.tiles) + (2 - this.piece.tiles.length)) / 2 * this.minoSize ,
      );
      this.addChild(this.minoGridDisplay);
    }
  }

  override destroy() {
    this.minoGridDisplay?.destroy();
    
    super.destroy();
  }
}
