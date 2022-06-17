import { Board } from "@shared/game/engine/player/board";
import { Player } from "@shared/game/engine/player/player";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { BoardOverlayDisplay } from "app/pixi/display/board-overlay-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";


export class BoardDisplay extends Container implements LayoutChild {

  layoutWidth = 500;
  layoutHeight = 800;

  lastGarbageRateSpawn: number | null = null;

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
    this.layout = new BoardLayout(this.layoutWidth, this.layoutHeight, this.board.visibleHeight, this.board.tiles[0].length);
    
    this.offsetContainer = new Container();
    this.offsetContainer.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.offsetContainer);

    this.background = Sprite.from(Texture.WHITE);
    this.background.tint = 0x000000;
    this.background.width = this.layout.innerWidth;
    this.background.height = this.layout.innerHeight;
    this.offsetContainer.addChild(this.background);
    
    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(this.board.tiles, this.layout.minoSize, this.board.tiles.length - this.board.visibleHeight);
    this.offsetContainer.addChild(this.minoGridDisplay);

    const maskGraphics = new Graphics();
    maskGraphics.beginFill();
    maskGraphics.drawRect(0, 0, this.layout.width, this.layout.height);
    maskGraphics.endFill();
    this.addChild(maskGraphics);
    this.minoGridDisplay.mask = maskGraphics;

    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.player.activePiece, this.layout.minoSize);
    this.offsetContainer.addChild(this.activePieceDisplay);

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
      const p = 1 - Math.min(1, (Date.now() - this.lastGarbageRateSpawn) / 1000 / (playerRule.garbageSpawnRate));
      this.minoGridDisplay.position.y = this.getMinoSize() * p;
      
    }
  }
}
