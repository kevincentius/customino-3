import { CountEffect } from "app/pixi/display/effects/count-effect";
import { EffectContainer } from "app/pixi/display/effects/effect-container";
import { LineWaveEffect } from "app/pixi/display/effects/line-wave-effect";
import { soundService } from "app/pixi/display/sound/sound-service";
import { BoardLayout } from "app/pixi/layout/board-layout";
import { Container } from "pixi.js";
import { Subject } from "rxjs";

export class BoardCountdownDisplay extends Container {
  lastCountEffect?: number;
  lastCount?: number;

  countdownSubject = new Subject<number>();

  config = {
    countInterval: 1000,

    countEntryDuration: 250,
    countEntryScale: 0.5,
    countEntryEasing: 10,

    countExitDuration: 1000,
    countExitScale: 0.45,
    countExitEasing: 10,
  }

  constructor(
    private layout: BoardLayout,
    private clockStartMs: number,
    private effectContainer: EffectContainer,
  ) {
    super();
    
    this.lastCount = Math.ceil((this.clockStartMs - Date.now()) / this.config.countInterval);
    
    const effect = new LineWaveEffect(
      this.layout.innerWidth,
      this.layout.innerHeight,
      this.layout.minoSize * 4,
      this.clockStartMs,
      2000,
      2,
    );
    effect.alpha = 0.1;
    this.effectContainer.addEffect(effect);
  }

  tick(dt: number) {
    const ct = Date.now();
    if (ct >= this.clockStartMs + this.config.countExitDuration) {
      this.visible = false;
    } else {
      {
        const countEffect = Math.ceil((this.clockStartMs - this.config.countEntryDuration - ct) / this.config.countInterval);
        if (this.lastCountEffect != countEffect) {
          this.lastCountEffect = countEffect;
  
          if (countEffect > 0) {
            const effect = new CountEffect(this.config, ct, countEffect);
            effect.position.set(this.layout.innerWidth / 2, this.layout.innerHeight / 2);
            effect.scale.set(3);
            this.effectContainer.addEffect(effect);
          }
        }
      }

      const count = Math.ceil((this.clockStartMs - ct) / this.config.countInterval);
      if (this.lastCount != count) {
        this.lastCount = count;

        this.countdownSubject.next(count);
      }
    }
  }
}
