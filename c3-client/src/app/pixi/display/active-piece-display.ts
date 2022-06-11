import { ActivePiece, PieceMoveEvent } from "@shared/game/engine/player/active-piece";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { Container } from "pixi.js";

export class ActivePieceDisplay extends Container {
  minoGridDisplay?: MinoGridDisplay;

  constructor(
    private boardMinoGridDisplay: MinoGridDisplay,
    private activePiece: ActivePiece,
    private minoSize: number,
  ) {
    super();

    this.activePiece.spawnSubject.subscribe(this.onSpawn.bind(this));
    this.activePiece.moveSubject.subscribe(this.onMove.bind(this));

    this.onSpawn();
    this.updatePosition();
  }

  onSpawn() {
    if (this.minoGridDisplay) {
      this.removeChild(this.minoGridDisplay);
    }

    if (this.activePiece.piece) {
      console.log('this.', this.activePiece.piece);
      this.minoGridDisplay = new MinoGridDisplay(this.activePiece.piece.tiles, this.minoSize);
      this.addChild(this.minoGridDisplay);
    }
  }

  onMove(e: PieceMoveEvent) {
    if (e.drot != 0) {
      // TODO: rotate mino grid
    }
    this.updatePosition();
  }

  private updatePosition() {
    if (this.minoGridDisplay) {
      const pos = this.boardMinoGridDisplay.toLocalPos(this.activePiece.y, this.activePiece.x);
      console.log(pos);
      this.minoGridDisplay.position.set(pos.x, pos.y);
    }
  }
}
