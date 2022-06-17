import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";

export class GhostPieceDisplay extends Container {
  minoGridDisplay?: MinoGridDisplay;

  constructor(
    private activePiece: ActivePiece
  ) {
    super();

    
  }
}
