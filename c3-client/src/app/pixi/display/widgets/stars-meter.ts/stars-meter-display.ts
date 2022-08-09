import { Player } from "@shared/game/engine/player/player";
import { enableGraphics } from "app/pixi/benchmark/config";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { drawTopArcStrip } from "app/pixi/display/util/arc";
import { SpriteCircleDisplay } from "app/pixi/display/widgets/combo-timer/sprite-circle-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { textUtil } from "app/pixi/util/text-util";
import { Container, Graphics } from "pixi.js";

export class StarsMeterDisplay extends Container implements LayoutChild {

  stars: SpriteCircleDisplay;

  graphics = new Graphics();
  text = textUtil.create48('0');
  textBpm = textUtil.create('POW');
  bg: Graphics;
  arc: Graphics;
  arcBg: Graphics;

  layoutWidth: number;
  layoutHeight: number;

  lastPieceMs = Date.now();
  movingAverage = 0; // bpm
  weight = 0.25;

  config = {
    bg: 0x333333,

    arcRadiusNear: 0.6,
    arcRadiusFar: 0.85,
    arcDegreeStart: 45,
    arcColor: 0xffffff,
    arcOpacity: 0.7,

    tintSpeed: 0,
    tintSpeedTint: 0xffff00,

    arcSat: 0.6,
    arcFlashMs: 250,
  }

  starPosRad = 0.45;

  displayValueAtLastPiece = 0;
  displayValue = 0;
  displayCatchSpeed = 60;
  fixedDisplayValue?: number;

  spritesheet = new GameSpritesheet();

  constructor(
    private player: Player,
    private diameter: number,
  ) {
    super();

    this.layoutWidth = this.diameter;
    this.layoutHeight = this.diameter;

    this.bg = this.createBackground();
    this.bg.cacheAsBitmap = true;
    this.addChild(this.bg);

    this.addChild(this.graphics);

    this.arcBg = new Graphics();
    this.arcBg.cacheAsBitmap = true;
    this.arcBg.position.set(this.diameter / 2, this.diameter / 2);
    drawTopArcStrip(
      this.arcBg,
      this.config.arcRadiusNear * this.diameter / 2, this.config.arcRadiusFar * this.diameter / 2,
      this.config.arcDegreeStart,
      1,
      this.config.bg,
    );

    this.addChild(this.arcBg);

    this.arc = new Graphics();
    this.arc.position.set(this.diameter / 2, this.diameter / 2);
    if (enableGraphics) {
      this.addChild(this.arc);
    }
    
    this.addChild(this.text);
    this.text.position.set(this.diameter / 2, this.diameter / 2 - 3);
    this.text.scale.set(0.9);
    this.text.anchor.set(0.5, 0.5);
    
    this.addChild(this.textBpm);
    this.textBpm.position.set(this.diameter / 2, this.diameter / 2 + 40);
    this.textBpm.scale.set(0.6);
    this.textBpm.anchor.set(0.5, 0.5);
    
    this.player.pieceLockSubject.subscribe(() => {
      this.lastPieceMs = Date.now();
      this.displayValueAtLastPiece = this.displayValue;
    });

    this.player.attackRule.starsSubject.subscribe(stars => {
      this.displayValueAtLastPiece = 0;
      this.lastPieceMs = Date.now();
      // this.text.text = 
    });
    
    // stars
    this.stars = new SpriteCircleDisplay(this.spritesheet.star, this.diameter / 2 * this.starPosRad, 0.35, 30);
    this.stars.position.set(this.diameter / 2, this.diameter / 2);
    this.addChild(this.stars);
    this.player.attackRule.starsSubject.subscribe(stars => this.stars.setStars(stars));
  }

  tick(dt: number) {
    this.stars.tick(dt);
    
    this.graphics.clear();

    // calculate target display (most actual speed)
    const msSinceLastPiece = Date.now() - this.lastPieceMs;
    const expectedMsPerPiece = 60000 / this.movingAverage;
    
    if (this.fixedDisplayValue != null) {
      const p = Math.pow(Math.min(1, msSinceLastPiece / 1000), .1);
      this.displayValue = p * this.fixedDisplayValue + (1 - p) * this.displayValueAtLastPiece;
    } else {
      // display should catch up to the most actual speed gradually (animate)
      const p = 1 / (5 * msSinceLastPiece / 1000 + 1);
      this.displayValue = p * this.displayValueAtLastPiece + (1 - p) * this.player.attackRule.getStarsProgressFactor();  
    }

    this.text.text = ((this.player.attackRule.getStarsMultiplier() - 1) * 100).toFixed(0);

    const flashP = Math.min(1, (Date.now() - this.lastPieceMs) / this.config.arcFlashMs);
    const color = Math.round(255 - 255 *(1 - this.config.arcSat) * flashP) * 0x10101;
    drawTopArcStrip(
      this.arc,
      this.config.arcRadiusNear * this.diameter / 2,
      this.config.arcRadiusFar * this.diameter / 2,
      this.config.arcDegreeStart,
      this.displayValue,
      color,
    );
  }

  createBackground() {
    const g = new Graphics();
    g.cacheAsBitmap = true;
    g.beginFill(0x666666);
    g.lineStyle({
      width: 10,
      color: 0x000000,
    });
    g.drawCircle(this.diameter / 2, this.diameter / 2, this.diameter / 2);
    g.endFill();
    
    g.alpha = 0.2;
    return g;
  }
}
