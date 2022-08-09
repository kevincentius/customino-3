import { Player } from "@shared/game/engine/player/player";
import { enableGraphics } from "app/pixi/benchmark/config";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { drawTopArcStrip } from "app/pixi/display/util/arc";
import { textUtil } from "app/pixi/util/text-util";
import { Container, Graphics } from "pixi.js";

export class SpeedMeterDisplay extends Container implements LayoutChild {

  text = textUtil.create48('0');
  arc: Graphics;
  
  textBpm = textUtil.create('BPM');
  bg: Graphics;
  arcBg: Graphics;

  layoutWidth: number;
  layoutHeight: number;

  lastPieceMs = Date.now();
  movingAverage = 0; // bpm
  weight = 0.25;

  config = {
    bg: 0x333333,

    arcRadiusNear: 0.7,
    arcRadiusFar: 0.85,
    arcDegreeStart: 45,
    arcColor: 0xff0000,
    arcOpacity: 0.7,
    maxSpeed: 200,

    tintSpeed: 0,
    tintSpeedTint: 0xffff00,

    arcSat: 0.6,
    arcFlashMs: 250,
  }

  displayValueAtLastPiece = 0;
  displayValue = 0;
  displayCatchSpeed = 60;
  fixedDisplayValue?: number;

  lastUpdateMs = Date.now();

  constructor(
    private player: Player,
    private diameter: number,
  ) {
    super();

    this.layoutWidth = this.diameter;
    this.layoutHeight = this.diameter;

    this.bg = this.createBackground();
    this.addChild(this.bg);

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
    this.textBpm.position.set(this.diameter / 2, this.diameter / 2 + 35);
    this.textBpm.scale.set(0.6);
    this.textBpm.anchor.set(0.5, 0.5);
    

    this.player.pieceLockSubject.subscribe(() => {
      const ct = Date.now();
      const dt = ct - this.lastPieceMs;
      this.lastPieceMs = ct;
      const weightMul = dt / (this.movingAverage == 0 ? 1 : 60000 / this.movingAverage);
      const weight = this.weight * weightMul / (1 + (this.weight * (weightMul - 1)));
      this.movingAverage = weight * (60000 / dt) + (1 - weight) * this.movingAverage;
      this.displayValueAtLastPiece = this.displayValue;
    });

    this.player.gameOverSubject.subscribe(stats => this.fixedDisplayValue = stats.pieces / stats.activeTime * 60);
  }

  tick() {
    // clock
    const ct = Date.now();
    const dt = ct - this.lastUpdateMs;
    this.lastUpdateMs = ct;

    // calculate target display (most actual speed)
    const msSinceLastPiece = ct - this.lastPieceMs;
    const expectedMsPerPiece = 60000 / this.movingAverage;
    
    if (this.fixedDisplayValue != null) {
      const p = Math.pow(Math.min(1, msSinceLastPiece / 1000), .1);
      this.displayValue = p * this.fixedDisplayValue + (1 - p) * this.movingAverage;
    } else {
      let targetDisplay!: number;
      if (msSinceLastPiece < expectedMsPerPiece) {
        targetDisplay = this.movingAverage;
      } else {
        const weightMul = msSinceLastPiece / expectedMsPerPiece;
        const weight = this.weight * weightMul / (1 + (this.weight * (weightMul - 1)));
        targetDisplay = (weight * (60000 / msSinceLastPiece) + (1 - weight) * this.movingAverage);
      }
      
      // display should catch up to the most actual speed gradually (animate)
      const p = 1 / (5 * msSinceLastPiece / 1000 + 1);
      this.displayValue = p * this.displayValueAtLastPiece + (1 - p) * targetDisplay;  
    }

    this.text.text = Math.round(this.displayValue).toString();
    const pTint = Math.max(0, Math.min(1, (this.displayValue - this.config.tintSpeed) / (this.config.maxSpeed - this.config.tintSpeed)));
    this.text.tint = 0xffff00 + (255 - (pTint * 255));

    const flashP = Math.min(1, (Date.now() - this.lastPieceMs) / this.config.arcFlashMs);
    const color = Math.round(255 - 255 *(1 - this.config.arcSat) * flashP) * 0x10000;
    drawTopArcStrip(
      this.arc,
      this.config.arcRadiusNear * this.diameter / 2,
      this.config.arcRadiusFar * this.diameter / 2,
      this.config.arcDegreeStart,
      this.displayValue / this.config.maxSpeed,
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

  override destroy() {
    this.arcBg.destroy();
    this.arc.destroy();
    this.bg.destroy();

    this.text.destroy();
    this.textBpm.destroy();

    super.destroy();
  }
}
