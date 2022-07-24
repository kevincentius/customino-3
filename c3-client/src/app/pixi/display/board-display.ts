import { Board } from "@shared/game/engine/player/board";
import { Player } from "@shared/game/engine/player/player";
import { ActivePieceDisplay } from "app/pixi/display/active-piece-display";
import { BoardOverlayDisplay } from "app/pixi/display/board-overlay-display";
import { MinoGridDisplay } from "app/pixi/display/mino-grid-display";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { BoardLayout as BoardLayout } from "app/pixi/layout/board-layout";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { GarbageIndicatorDisplay } from "app/pixi/display/garbage-indicator-display";
import { EffectContainer } from "app/pixi/display/effects/effect-container";
import { Shaker } from "app/pixi/display/effects/shaker";
import { LockResult } from "@shared/game/engine/player/lock-result";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { MinoFlashEffect } from "app/pixi/display/effects/mino-flash-effect";

export class BoardDisplay extends Container implements LayoutChild {

  layoutWidth = 520;
  layoutHeight = 800;
  garbageIndicatorWidth = 20;

  lastGarbageRateSpawn: number | null = null;
  spritesheet = new GameSpritesheet();

  // children
  private layout: BoardLayout;
  private offsetContainer: Container;
  private garbageIndicator: GarbageIndicatorDisplay;
  private fieldContainer: Container;
  private maskContainer: Container;
  private spawnRateOffsetContainer: Container;
  private shakeContainer: Container;
  private shaker: Shaker;

  private innerContainer: Container;
  private effectContainer: EffectContainer = new EffectContainer();

  private background: Sprite;
  private minoGridDisplay: MinoGridDisplay;
  private activePieceDisplay: ActivePieceDisplay;
  private ghostPieceDisplay: ActivePieceDisplay;
  private overlayDisplay: BoardOverlayDisplay;

  // reference
  board: Board;

  constructor(
    private player: Player,
  ) {
    super();

    this.board = player.board;
    this.layout = new BoardLayout(this.layoutWidth - this.garbageIndicatorWidth, this.layoutHeight, this.board.visibleHeight, this.board.tiles[0].length);

    // offset container: auto size and auto center board in case the board dimensions do no match layout dimensions.
    //  Contains the field including the garbage indicator.
    this.offsetContainer = new Container();
    this.offsetContainer.position.set(this.layout.offsetX, this.layout.offsetY);
    this.addChild(this.offsetContainer);

    this.shakeContainer = new Container();
    this.offsetContainer.addChild(this.shakeContainer);
    this.shaker = new Shaker(this.shakeContainer);

    // garbage indicator
    this.garbageIndicator = new GarbageIndicatorDisplay(this.player, this.garbageIndicatorWidth, this.layout.height, this.layout.minoSize);
    this.shakeContainer.addChild(this.garbageIndicator);

    // field container: contains the field but excluding the garbage indicator
    this.fieldContainer = new Container();
    this.fieldContainer.position.x = this.garbageIndicatorWidth;
    this.shakeContainer.addChild(this.fieldContainer);

    // board background
    this.background = Sprite.from(Texture.WHITE);
    this.background.tint = 0x000000;
    this.background.width = this.layout.innerWidth;
    this.background.height = this.layout.innerHeight;
    this.fieldContainer.addChild(this.background);

    // mask container: stencil effect
    this.maskContainer = new Container();
    const maskGraphics = new Graphics();
    maskGraphics.beginFill();
    maskGraphics.drawRect(0, 0, this.layout.innerWidth, this.layout.innerHeight);
    maskGraphics.endFill();
    this.fieldContainer.addChild(maskGraphics);
    this.maskContainer.mask = maskGraphics;
    this.fieldContainer.addChild(this.maskContainer);

    // spawn rate offset: shifts the board overtime to animate garbage entering the field.
    this.spawnRateOffsetContainer = new Container();
    this.maskContainer.addChild(this.spawnRateOffsetContainer);

    // inner container
    this.innerContainer = new Container();
    this.spawnRateOffsetContainer.addChild(this.innerContainer);
    
    this.maskContainer.addChild(this.effectContainer);

    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(this.board.tiles, this.layout.minoSize, this.board.tiles.length - this.board.visibleHeight);
    this.innerContainer.addChild(this.minoGridDisplay);

    // ghost piece
    this.ghostPieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.effectContainer, this.player, this.layout.minoSize, true);
    this.innerContainer.addChild(this.ghostPieceDisplay);
    
    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this.minoGridDisplay, this.effectContainer, this.player, this.layout.minoSize);
    this.innerContainer.addChild(this.activePieceDisplay);

    // overlay
    this.overlayDisplay = new BoardOverlayDisplay(this.layoutWidth, this.layoutHeight);
    this.addChild(this.overlayDisplay);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e));
    this.board.lineClearSubject.subscribe(e => this.minoGridDisplay.clearLines(e));
    this.board.addRowsSubject.subscribe(e => this.minoGridDisplay.onRowsAdded(e));
    this.player.garbageGen.garbageRateSpawnSubject.subscribe(e => this.lastGarbageRateSpawn = Date.now());
    this.player.gameOverSubject.subscribe(r => this.overlayDisplay.show(this.player.alive ? 'Winner' : 'Game Over', '2nd Place'))
    this.player.pieceLockSubject.subscribe(r => {
      this.shakeBoard(r);
      this.spawnFlashEffect(r);
    });
  }

  getMinoSize() {
    return this.layout.minoSize;
  }

  tick() {
    let garbageRateShift = 0;
    if (this.lastGarbageRateSpawn != null) {
      const p = 1 - Math.min(1, (Date.now() - this.lastGarbageRateSpawn) / 1000 / (this.player.playerRule.garbageSpawnRate));
      garbageRateShift = this.getMinoSize() * p;
      this.spawnRateOffsetContainer.position.y = garbageRateShift;
    }

    this.garbageIndicator.tick(garbageRateShift);

    this.shaker.tick();
    this.effectContainer.tick();
  }

  shakeBoard(r: LockResult) {
    if (r.clearedLines.length > 0) {
      const dir = (Math.random() * 0 + 90) * Math.PI / 180;
      const str = 5 * Math.min(4, r.clearedLines.length);
      this.shaker.shake(str * Math.cos(dir), str * Math.sin(dir));
    }
  }
  
  private spawnFlashEffect(r: LockResult) {
    const tiles = this.player.activePiece.piece!.tiles;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        const tile = tiles[i][j];
        if (tile != null) {
          const minoPos = this.minoGridDisplay.calcMinoPos(this.player.activePiece.y + i, this.player.activePiece.x + j);
          
          const effect = new MinoFlashEffect(this.getMinoSize(), 250, 0.5);
          effect.position.set(minoPos.x, minoPos.y);
          this.effectContainer.addEffect(effect);
        }
      }
    }
  }

}
