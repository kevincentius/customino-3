import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { Player } from "@shared/game/engine/player/player";
import { enableGraphics } from "app/pixi/benchmark/config";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { drawArc } from "app/pixi/display/util/arc";
import { textUtil } from "app/pixi/util/text-util";
import { Container, Graphics } from "pixi.js";

const colors = [0xff0000, 0xffaa00, 0xffff00];

export class ComboTimerDisplay extends Container implements LayoutChild {
  graphics = new Graphics();
  text = textUtil.create120('0');
  textBpm = textUtil.create('COMBO');
  textContainer = new Container();
  bg: Graphics;

  layoutWidth: number;
  layoutHeight: number;

  comboStartMs?: number;
  period = 1.5;

  lastComboTimestamp = Date.now();

  tint = 0.5;
  flashDuration = 2000;

  constructor(
    private player: Player,
    private comboTimer: ComboTimer,
    private diameter: number,
  ) {
    super();
    
    this.diameter = diameter;
    this.layoutWidth = this.diameter;
    this.layoutHeight = this.diameter;

    this.bg = this.createBackground();
    if (enableGraphics) {
      this.addChild(this.bg);
      this.addChild(this.graphics);
    }
    this.addChild(this.textContainer);
    this.textContainer.position.set(this.diameter / 2, this.diameter / 2);

    this.textContainer.addChild(this.textBpm);
    this.textBpm.position.set(0, 50);
    this.textBpm.scale.set(0.6);
    this.textBpm.anchor.set(0.5, 0.5);
    
    this.textContainer.addChild(this.text);
    this.text.position.set(0, -7);
    this.text.anchor.set(0.5, 0.5);

    this.comboTimer.comboStartSubject.subscribe(() => this.comboStartMs = Date.now());
    this.comboTimer.comboIncreasedSubject.subscribe(combo => this.animateCombo(combo));

    this.comboStartMs = Date.now() - gameLoopRule.mspf * (this.player.frame - this.comboTimer.comboStartFrame);
  }

  tick(dt: number) {
    let s = 0;
    if (this.comboStartMs != null) {
      const msSinceComboStart = Date.now() - this.comboStartMs;
      const comboAccumulatedTime = this.comboTimer.comboAccumulatedFrames / gameLoopRule.fps;
      s = comboAccumulatedTime - (msSinceComboStart / 1000);
    }
    
    this.updateScale();

    this.graphics.clear();

    if (s <= 0) {
      return;
    }

    let r = this.diameter * 0.5;
    this.text.text = this.comboTimer.combo.toString();

    let seconds = Math.floor(s / this.period);
    let subseconds = (s / this.period - Math.floor(s / this.period));

    // render sub second
    drawArc(this.graphics, r, r, r, 0, subseconds, colors[seconds % colors.length]);

    if (seconds > 0) {
      drawArc(this.graphics, r, r, r, subseconds, 1, colors[(seconds - 1) % colors.length])
    }
  }

  private updateScale() {
    const mp = Math.pow(Math.min(1, (this.comboTimer.combo == 0 ? this.comboTimer.lastExpiredCombo : this.comboTimer.combo) / this.player.playerRule.sonicDropEffect.comboCap), 1);
    const textMaxScale = mp * 2;
    const graphicsMaxScale = mp * 1;
    const p = 1 / (5 * (Date.now() - this.lastComboTimestamp) / 1000 + 1);
    this.textContainer.scale.set(1 + p * textMaxScale);
    this.graphics.scale.set(1 + p * graphicsMaxScale);
    this.graphics.position.set(-this.diameter / 2 * (p * graphicsMaxScale));
    
    const pTint = Math.min(1, (Date.now() - this.lastComboTimestamp) / this.flashDuration);
    this.graphics.tint = Math.floor(255 - 255 * (1 - this.tint) * pTint) * 0x10101;
  }

  animateCombo(combo: number) {
    this.lastComboTimestamp = Date.now();
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
