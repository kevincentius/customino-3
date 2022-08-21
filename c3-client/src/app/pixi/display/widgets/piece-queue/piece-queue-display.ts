import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { Container } from "pixi.js";
import { LayoutContainer } from "app/pixi/display/layout/layout-container";
import { Player } from "@shared/game/engine/player/player";
import { PieceDisplay } from "app/pixi/display/widgets/piece-queue/piece-display";
import { Piece } from "@shared/game/engine/player/piece";
import { LayoutAlignment } from "app/pixi/display/layout/layout-alignment";

export class PieceQueueDisplay extends Container implements LayoutChild {
  layoutWidth = 200;
  layoutHeight = 200;

  pieceDisplays: PieceDisplay[] = [];
  layout = new LayoutContainer(1, 200, null, 40, LayoutAlignment.MIDDLE);

  constructor(
    private player: Player,
    private minoSize: number
  ) {
    super();

    this.addChild(this.layout);

    this.player.pieceQueue.forEach(piece => this.pushNewPieceDisplay(piece));
    this.updateLayout();

    this.player.pieceSpawnSubject.subscribe(() => {
      if (this.pieceDisplays.length > 0) {
        const pieceDisplay = this.pieceDisplays.shift()!;
        this.layout.removeNode(pieceDisplay);
        pieceDisplay.destroy();

        const newPiece = this.player.pieceQueue[this.player.pieceQueue.length - 1];
        this.pushNewPieceDisplay(newPiece);

        this.updateLayout();
      }
    });
  }

  private pushNewPieceDisplay(newPiece: Piece) {
    const pieceDisplay = new PieceDisplay(newPiece, this.minoSize, this.minoSize * 2, this.player.playerRule);
    this.pieceDisplays.push(pieceDisplay);
    this.layout.addNode(pieceDisplay);
  }

  updateLayout() {
    this.layout.updateLayout();

    this.layoutWidth = this.layout.layoutWidth;
    this.layoutHeight = this.layout.layoutHeight;
  }

  override destroy() {
    this.layout.destroy();
    this.pieceDisplays.forEach(pieceDisplay => pieceDisplay.destroy());

    super.destroy();
  }
}
