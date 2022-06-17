import { ActivePiece, PieceMoveEvent } from "@shared/game/engine/player/active-piece";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { Container } from "pixi.js";

export class ActivePieceDisplay extends Container {
  minoGridDisplay?: MinoGridDisplay;
  ghostDistance = 0;

  constructor(
    private boardMinoGridDisplay: MinoGridDisplay,
    private activePiece: ActivePiece,
    private minoSize: number,
    private ghost=false,
  ) {
    super();

    if (this.ghost) {
      this.alpha = 0.3;
    }

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
      this.minoGridDisplay = new MinoGridDisplay(this.activePiece.piece.tiles, this.minoSize);
      this.addChild(this.minoGridDisplay);
      this.updatePosition();
    }
  }

  onMove(e: PieceMoveEvent) {
    if (this.minoGridDisplay) {
      if (e.drot != 0) {
        this.minoGridDisplay.rotate(e.drot);
      }
      this.updatePosition();
    }
  }

  private updatePosition() {
    if (this.ghost) {
      this.ghostDistance = this.activePiece.calcGhostDistance();
    }

    if (this.minoGridDisplay) {
      const pos = this.boardMinoGridDisplay.calcMinoPos(this.activePiece.y + this.ghostDistance, this.activePiece.x);
      this.minoGridDisplay.position.set(pos.x, pos.y);
    }
  }
}
