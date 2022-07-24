import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { Player } from "@shared/game/engine/player/player";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { textUtil } from "app/pixi/util/text-util";
import { Circle, Container, Graphics } from "pixi.js";

const colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff];

export class ComboTimerDisplay extends Container implements LayoutChild {
  diameter: number;

  graphics = new Graphics();
  text = textUtil.create120('0');
  bg = this.createBackground();

  layoutWidth: number;
  layoutHeight: number;

  comboStartMs?: number;
  period = 2.5;

  lastComboTimestamp = Date.now();

  constructor(
    private player: Player,
    private comboTimer: ComboTimer,
    diameter: number,
  ) {
    super();
    
    this.diameter = diameter;
    this.layoutWidth = this.diameter;
    this.layoutHeight = this.diameter;

    this.addChild(this.graphics);
    this.addChild(this.text);
    // this.addChild(this.bg);
    this.text.position.set(this.diameter / 2, this.diameter / 2 - 7);
    this.text.anchor.set(0.5, 0.5);

    this.comboTimer.comboStartSubject.subscribe(() => this.comboStartMs = Date.now());
    this.comboTimer.comboIncreasedSubject.subscribe(combo => this.animateCombo(combo));

    this.comboStartMs = Date.now() - gameLoopRule.mspf * (this.player.frame - this.comboTimer.comboStartFrame);
  }

  tick() {
    let s = 0;
    if (this.comboStartMs != null) {
      const msSinceComboStart = Date.now() - this.comboStartMs;
      const comboAccumulatedTime = this.comboTimer.comboAccumulatedFrames / gameLoopRule.fps;
      s = comboAccumulatedTime - (msSinceComboStart / 1000);
    }

    this.graphics.clear();

    if (s <= 0) {
      return;
    }

    let r = this.diameter * 0.5;
    this.text.text = this.comboTimer.combo.toString();

    let seconds = Math.floor(s / this.period);
    let subseconds = (s / this.period - Math.floor(s / this.period));

    // render sub second
    this.graphics
      .beginFill(colors[seconds % colors.length])
      .arc(r, r, r, Math.PI * (-0.5), Math.PI * (-0.5 + subseconds * 2))
      .lineTo(r, r)
      .closePath();

    if (seconds > 0) {
      this.graphics
        .beginFill(colors[(seconds - 1) % colors.length])
        .arc(r, r, r, Math.PI * (-0.5 + subseconds * 2), Math.PI * (1.5))
        .lineTo(r, r)
        .closePath();
    }

    const mp = Math.min(1, this.comboTimer.combo / 1);
    const textMaxScale = mp * 2;
    const graphicsMaxScale = mp * 0.5;
    const p = 1 / (5 * (Date.now() - this.lastComboTimestamp) / 1000 + 1);
    this.text.scale.set(1 + p * textMaxScale);
    this.graphics.scale.set(1 + p * graphicsMaxScale);
    this.graphics.position.set(-this.diameter / 2 * (p * graphicsMaxScale));
  }

  animateCombo(combo: number) {
    this.lastComboTimestamp = Date.now();
  }

  createBackground() {
    const g = new Graphics();
    g.beginFill(0x000000);
    g.drawCircle(this.diameter / 2, this.diameter / 2, this.diameter / 2);
    g.endFill();

    // // g.lineStyle({
    // //   width: 2,
    // //   color: 0xffffff22,
    // // });
    
    return g;
  }
}
