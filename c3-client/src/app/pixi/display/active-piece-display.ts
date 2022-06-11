import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Container } from "pixi.js";

export class ActivePieceDisplay extends Container {

  constructor(
    private activePiece: ActivePiece
  ) {
    super();
  }

  
}
