import { Board, LineClearEvent } from "@shared/game/engine/player/board";
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
import { BoardCountdownDisplay } from "app/pixi/display/board-countdown-display";
import { Effect } from "app/pixi/display/effects/effect";
import { BoardDisplayDelegate } from "app/pixi/display/board-display-delegate";

export class BoardDisplay extends Container implements LayoutChild, BoardDisplayDelegate {

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
  private effectContainer = new EffectContainer();

  private maskGraphics: Graphics;
  private background: Sprite;
  private minoGridDisplay: MinoGridDisplay;
  private activePieceDisplay: ActivePieceDisplay;
  private ghostPieceDisplay: ActivePieceDisplay;
  private overlayDisplay: BoardOverlayDisplay;
  countdownDisplay: BoardCountdownDisplay;

  private border: Graphics;

  // reference
  board: Board;

  chorus = 0;
  chorusAdjustSpeed = 4;

  delegate = {
    boardDisplay: this,
  };

  constructor(
    private player: Player,
    private clockStartMs: number,
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
    this.maskGraphics = new Graphics();
    this.maskGraphics.cacheAsBitmap = true;
    this.maskGraphics.beginFill();
    this.maskGraphics.drawRect(0, 0, this.layout.innerWidth, this.layout.innerHeight);
    this.maskGraphics.endFill();
    this.fieldContainer.addChild(this.maskGraphics);
    this.maskContainer.mask = this.maskGraphics;
    this.fieldContainer.addChild(this.maskContainer);

    // spawn rate offset: shifts the board overtime to animate garbage entering the field.
    this.spawnRateOffsetContainer = new Container();
    this.maskContainer.addChild(this.spawnRateOffsetContainer);

    // inner container
    this.innerContainer = new Container();
    this.spawnRateOffsetContainer.addChild(this.innerContainer);
    
    // mino grid
    this.minoGridDisplay = new MinoGridDisplay(
      this.board.tiles,
      this.layout.minoSize,
      this.board.tiles.length - this.board.visibleHeight,
      this.player.playerRule,
      this.player.playerRule.graphics.chorusIntensity >= 0.01,
      this);
    this.innerContainer.addChild(this.minoGridDisplay);

    // ghost piece
    this.ghostPieceDisplay = new ActivePieceDisplay(this, this.player, this.layout.minoSize, true);
    this.innerContainer.addChild(this.ghostPieceDisplay);
    
    // active piece
    this.activePieceDisplay = new ActivePieceDisplay(this, this.player, this.layout.minoSize);
    this.innerContainer.addChild(this.activePieceDisplay);

    // overlay
    this.overlayDisplay = new BoardOverlayDisplay(this.layoutWidth, this.layoutHeight);
    this.addChild(this.overlayDisplay);

    // countdown
    this.countdownDisplay = new BoardCountdownDisplay(this, this.clockStartMs);

    this.board.placeTileSubject.subscribe(e => this.minoGridDisplay.placeTile(e, true));
    this.board.lineClearSubject.subscribe(e => this.onLineClear(e));
    this.board.addRowsSubject.subscribe(e => this.minoGridDisplay.onRowsAdded(e));
    this.player.garbageGen.garbageRateSpawnSubject.subscribe(e => this.lastGarbageRateSpawn = Date.now());
    this.player.gameOverSubject.subscribe(r => this.overlayDisplay.show(this.player.alive ? 'Winner' : 'Game Over', '2nd Place'))
    this.player.pieceLockSubject.subscribe(r => {
      this.shakeBoard(r);
      // this.spawnFlashEffect(r);
    });

    // border
    this.border = new Graphics();
    this.border.cacheAsBitmap = true;
    this.addChild(this.border);
    this.border
      .clear()
      .lineStyle({
        width: 2,
        color: 0xbbbbbb,
        alpha: 0.5,
      })
      .drawRect(this.layout.offsetX + this.garbageIndicatorWidth, this.layout.offsetY, this.layout.innerWidth, this.layout.innerHeight);
  }

  onLineClear(e: LineClearEvent): void {
    const minoSize = this.getMinoSize();

    const fxRule = this.player.playerRule.lineClearEffect;
    if (fxRule.flashDuration > 0 && fxRule.flashOpacity > 0) {
      for (const row of e.rows) {
        const effect = new MinoFlashEffect(minoSize * this.board.tiles[0].length, minoSize, fxRule.flashDuration, fxRule.flashOpacity);
        effect.position.set(0, this.calcMinoPosForEffect(row.y, 0).y);
        this.maskContainer.addChild(effect);
        this.effectContainer.addEffect(effect);
      }
    }

    this.minoGridDisplay.clearLines(e);
  }

  getMinoSize() {
    return this.layout.minoSize;
  }

  tick(dt: number) {
    let garbageRateShift = 0;
    if (this.lastGarbageRateSpawn != null) {
      const p = 1 - Math.min(1, (Date.now() - this.lastGarbageRateSpawn) / (1000 / this.player.playerRule.garbageSpawnRate));
      garbageRateShift = this.getMinoSize() * p;
      this.spawnRateOffsetContainer.position.y = garbageRateShift;
    }

    this.garbageIndicator.tick(garbageRateShift);

    this.tickChorus(dt);
    
    this.minoGridDisplay.tick(dt);
    this.minoGridDisplay.chorus(this.chorus);

    this.activePieceDisplay.tick();
    this.ghostPieceDisplay.tick();

    this.shaker.tick();
    this.effectContainer.tick(dt);

    this.overlayDisplay.tick(dt);
    this.countdownDisplay.tick(dt);
  }

  private tickChorus(dt: number) {
    if (this.player.attackRule.comboTimer) {
      const targetChorus = Math.min(1, this.player.attackRule.comboTimer.combo / 12);
      if (Math.abs(this.chorus - targetChorus) < this.chorusAdjustSpeed * dt / 1000) {
        this.chorus = targetChorus;
      } else {
        this.chorus += Math.sign(targetChorus - this.chorus) * this.chorusAdjustSpeed * dt / 1000;
      }
    }
  }

  shakeBoard(r: LockResult) {
    if (r.clearedLines.length > 0) {
      const dir = (Math.random() * 0 + 90) * Math.PI / 180;
      const str = 5 * Math.min(4, r.clearedLines.length);
      this.shaker.shake(str * Math.cos(dir), str * Math.sin(dir));
    }
  }
  
  override destroy() {
    this.maskGraphics.destroy();
    this.border.destroy();

    this.offsetContainer.destroy();
    this.shakeContainer.destroy();
    this.fieldContainer.destroy();
    this.maskContainer.destroy();
    this.spawnRateOffsetContainer.destroy();
    this.innerContainer.destroy();

    this.activePieceDisplay.destroy();
    this.countdownDisplay.destroy();
    this.overlayDisplay.destroy();
    this.garbageIndicator.destroy();
    this.minoGridDisplay.destroy();
    this.effectContainer.destroy();
    this.background.destroy();

    super.destroy();
  }


  // methods to be accessed by children
  getInnerWidth() { return this.layout.innerWidth; }
  getInnerHeight() { return this.layout.innerHeight; }
  calcMinoPos(row: number, col: number) { return this.minoGridDisplay.calcMinoPos(row, col); }
  calcMinoPosForEffect(row: number, col: number) {
    const minoPos = this.minoGridDisplay.calcMinoPos(row, col)
    return {
      x: minoPos.x,
      y: minoPos.y + this.spawnRateOffsetContainer.position.y,
    };
  }
  addEffect(effect: Effect) {
    this.effectContainer.addEffect(effect);
  }
  addEffectToBoard(effect: Effect) {
    this.maskContainer.addChild(effect);
    this.addEffect(effect);
  }
}
