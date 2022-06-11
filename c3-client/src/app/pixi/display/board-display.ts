import { ActivePiece } from "@shared/game/engine/player/active-piece";
import { Board } from "@shared/game/engine/player/board";
import { Player } from "@shared/game/engine/player/player";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { BoardOverlayDisplay } from "app/pixi/display/board-overlay-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container, Sprite, Texture } from "pixi.js";


export class BoardDisplay extends Container {
  // children
  private layout: BoardLayout;
  private offsetContainer: Container;
  private background: Sprite;
  private minoGridDisplay: MinoGridDisplay;
  private activePieceDisplay: ActivePieceDisplay;
  overlayDisplay: BoardOverlayDisplay;

  // reference
  board: Board;

  constructor(
    private player: Player,
  ) {
    super();

    this.board = player.board;

    const boardContainerWidth = 500;
    const boardContainerHeight = 900;
    this.layout = new BoardLayout(boardContainerWidth, boardContainerHeight, this.board.visibleHeight, this.board.tiles[0].length);
    
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
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.player.activePiece, this.layout.minoSize);
    this.offsetContainer.addChild(this.activePieceDisplay);

    // overlay
    this.overlayDisplay = new BoardOverlayDisplay(boardContainerWidth, boardContainerHeight);
    this.addChild(this.overlayDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));
    this.player.gameOverSubject.subscribe(r => this.overlayDisplay.show(this.player.alive ? 'Winner' : 'Game Over', '2nd Place'))
  }
}
