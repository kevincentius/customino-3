import { BoardDisplayDelegate } from "app/pixi/display/board-display-delegate";
import { CountEffect } from "app/pixi/display/effects/count-effect";
import { LineWaveEffect } from "app/pixi/display/effects/line-wave-effect";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
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

  spritesheet = new GameSpritesheet();

  constructor(
    private boardDisplay: BoardDisplayDelegate,
    private clockStartMs: number,
  ) {
    super();
    
    this.lastCount = Math.ceil((this.clockStartMs - Date.now()) / this.config.countInterval);
    
    const effect = new LineWaveEffect(
      this.spritesheet,
      this.boardDisplay.getInnerWidth(),
      this.boardDisplay.getInnerHeight(),
      // this.layout.minoSize * 4,
      this.boardDisplay.getInnerHeight(),
      this.clockStartMs,
      3000,
      2,
    );
    effect.alpha = 0.1;
    this.boardDisplay.addEffectToBoard(effect);
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
            effect.position.set(this.boardDisplay.getInnerWidth() / 2, this.boardDisplay.getInnerHeight() / 2);
            effect.scale.set(3);
            this.boardDisplay.addEffectToBoard(effect);
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
