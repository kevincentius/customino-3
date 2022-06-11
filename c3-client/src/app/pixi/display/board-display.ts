import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container } from "pixi.js";


export class BoardDisplay extends Container {
  // children
  layout: BoardLayout;
  minoGridDisplay: MinoGridDisplay;
  activePieceDisplay: ActivePieceDisplay;

  constructor(
    private board: Board,
    private activePiece: ActivePiece,
  ) {
    super();

    this.layout = new BoardLayout(500, 900, this.board.visibleHeight, this.board.tiles[0].length);
    
    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(this.board.tiles, this.layout.minoSize);
    this.minoGridDisplay.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.minoGridDisplay);

    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.activePiece, this.layout.minoSize);
    this.activePieceDisplay.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.activePieceDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));
  }
}
