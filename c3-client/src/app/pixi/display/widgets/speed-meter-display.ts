import { Player } from "@shared/game/engine/player/player";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { textUtil } from "app/pixi/util/text-util";
import { Container, Graphics } from "pixi.js";

export class SpeedMeterDisplay extends Container implements LayoutChild {

  graphics = new Graphics();
  text = textUtil.create48('0');
  bg: Graphics;

  layoutWidth: number;
  layoutHeight: number;

  lastPieceMs = Date.now();
  movingAverage = 0; // bpm
  weight = 0.3;

  displayValueAtLastPiece = 0;
  displayValue = 0;
  displayCatchSpeed = 60;

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
    this.addChild(this.graphics);
    this.addChild(this.text);

    this.player.pieceLockSubject.subscribe(() => {
      const ct = Date.now();
      const dt = ct - this.lastPieceMs;
      this.lastPieceMs = ct;
      const weightMul = dt / (this.movingAverage == 0 ? 1 : 60000 / this.movingAverage);
      const weight = this.weight * weightMul / (1 + (this.weight * (weightMul - 1)));
      this.movingAverage = weight * (60000 / dt) + (1 - weight) * this.movingAverage;
      this.displayValueAtLastPiece = this.displayValue;
    });
  }

  tick() {
    this.graphics.clear();

    // clock
    const ct = Date.now();
    const dt = ct - this.lastUpdateMs;
    this.lastUpdateMs = ct;

    // calculate target display (most actual speed)
    const msSinceLastPiece = ct - this.lastPieceMs;
    const expectedMsPerPiece = 60000 / this.movingAverage;
    let targetDisplay!: number;
    if (msSinceLastPiece < expectedMsPerPiece) {
      targetDisplay = this.movingAverage;
    } else {
      const weightMul = msSinceLastPiece / expectedMsPerPiece;
      const weight = this.weight * weightMul / (1 + (this.weight * (weightMul - 1)));
      targetDisplay = (weight * (60000 / msSinceLastPiece) + (1 - weight) * this.movingAverage);
    }
    
    // display should catch up to the most actual speed gradually (animate)
    const p = 1 / (msSinceLastPiece / 1000 + 1);
    this.displayValue = p * this.displayValueAtLastPiece + (1 - p) * targetDisplay;
    
    this.text.text = Math.round(this.displayValue).toString();
  }
  
  createBackground() {
    const g = new Graphics();
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
