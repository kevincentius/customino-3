import { Board } from "@shared/game/engine/player/board";
import { Player } from "@shared/game/engine/player/player";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { BoardOverlayDisplay } from "app/pixi/display/board-overlay-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container, Graphics, Sprite, Texture } from "pixi.js";

export class BoardDisplay extends Container implements LayoutChild {

  layoutWidth = 500;
  layoutHeight = 800;

  lastGarbageRateSpawn: number | null = null;

  // children
  private layout: BoardLayout;
  private offsetContainer: Container;
  private maskContainer: Container;
  private spawnRateOffsetContainer: Container;
  private background: Sprite;
  private minoGridDisplay: MinoGridDisplay;
  private activePieceDisplay: ActivePieceDisplay;
  private ghostPieceDisplay: ActivePieceDisplay;
  overlayDisplay: BoardOverlayDisplay;

  // reference
  board: Board;

  constructor(
    private player: Player,
  ) {
    super();

    this.board = player.board;
    this.layout = new BoardLayout(this.layoutWidth, this.layoutHeight, this.board.visibleHeight, this.board.tiles[0].length);

    // offset container: auto size and auto center board in case the board dimensions do no match layout dimensions
    this.offsetContainer = new Container();
    this.offsetContainer.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.offsetContainer);
    
    // board background
    this.background = Sprite.from(Texture.WHITE);
    this.background.tint = 0x000000;
    this.background.width = this.layout.innerWidth;
    this.background.height = this.layout.innerHeight;
    this.offsetContainer.addChild(this.background);

    // mask container: stencil effect
    this.maskContainer = new Container();
    const maskGraphics = new Graphics();
    maskGraphics.beginFill();
    maskGraphics.drawRect(0, 0, this.layout.width, this.layout.height);
    maskGraphics.endFill();
    this.addChild(maskGraphics);
    this.maskContainer.mask = maskGraphics;
    this.offsetContainer.addChild(this.maskContainer);

    // spawn rate offset: shifts the board overtime to animate garbage entering the field.
    this.spawnRateOffsetContainer = new Container();
    this.maskContainer.addChild(this.spawnRateOffsetContainer);

    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(this.board.tiles, this.layout.minoSize, this.board.tiles.length - this.board.visibleHeight);
    this.spawnRateOffsetContainer.addChild(this.minoGridDisplay);

    // ghost piece
    this.ghostPieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.player.activePiece, this.layout.minoSize, true);
    this.spawnRateOffsetContainer.addChild(this.ghostPieceDisplay);
    
    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.player.activePiece, this.layout.minoSize);
    this.spawnRateOffsetContainer.addChild(this.activePieceDisplay);

    // overlay
    this.overlayDisplay = new BoardOverlayDisplay(this.layoutWidth, this.layoutHeight);
    this.addChild(this.overlayDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));
    this.board.lineClearSubject.subscribe(e => this.minoGridDisplay.clearLines(e));
    this.board.addRowsSubject.subscribe(e => this.minoGridDisplay.onRowsAdded(e));
    this.player.garbageGen.garbageRateSpawnSubject.subscribe(e => this.lastGarbageRateSpawn = Date.now());
    this.player.gameOverSubject.subscribe(r => this.overlayDisplay.show(this.player.alive ? 'Winner' : 'Game Over', '2nd Place'))
  }

  getMinoSize() {
    return this.layout.minoSize;
  }

  tick() {
    if (this.lastGarbageRateSpawn != null) {
      const p = 1 - Math.min(1, (Date.now() - this.lastGarbageRateSpawn) / 1000 / (this.player.playerRule.garbageSpawnRate));
      this.spawnRateOffsetContainer.position.y = this.getMinoSize() * p;
    }
  }
}
