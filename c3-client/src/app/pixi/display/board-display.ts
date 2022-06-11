import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container, Sprite, Texture } from "pixi.js";


export class BoardDisplay extends Container {
  // children
  layout: BoardLayout;
  offsetContainer: Container;
  background: Sprite;
  minoGridDisplay: MinoGridDisplay;
  activePieceDisplay: ActivePieceDisplay;

  constructor(
    private board: Board,
    private activePiece: ActivePiece,
  ) {
    super();

    this.layout = new BoardLayout(500, 900, this.board.visibleHeight, this.board.tiles[0].length);
    
    this.offsetContainer = new Container();
    this.offsetContainer.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.offsetContainer);

    this.background = Sprite.from(Texture.WHITE);
    this.background.tint = 0x000000;
    this.background.width = this.layout.width;
    this.background.height = this.layout.height;
    this.offsetContainer.addChild(this.background);
    
    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(this.board.tiles, this.layout.minoSize, this.board.tiles.length - this.board.visibleHeight);
    this.offsetContainer.addChild(this.minoGridDisplay);

    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.activePiece, this.layout.minoSize);
    this.offsetContainer.addChild(this.activePieceDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));
  }
}
