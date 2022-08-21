import { Effect } from "app/pixi/display/effects/effect";
import { BitmapText, Container } from "pixi.js";

import { textUtil } from "app/pixi/util/text-util";

export class CountEffect extends Container implements Effect {
  text: BitmapText;

  constructor(
    private config: any,
    private spawnMs: number,
    private count: number,
  ) {
    super();

    this.text = textUtil.create120(count.toString());
    this.text.anchor.set(0.5);
    this.text.scale.set(1);
    this.alpha = 0;
    this.addChild(this.text);
  }

  tick(dt: number): boolean {
    const age = Date.now() - this.spawnMs;
    if (age < this.config.countEntryDuration) {
      // entry animation
      const p = age / this.config.countEntryDuration;
      this.text.scale.set((1 - p) + p * this.config.countEntryScale);
      this.alpha = Math.pow(p, 9);

    } else if (age < this.config.countEntryDuration + this.config.countExitDuration) {
      // exit animation
      const p = (age - this.config.countEntryDuration) / this.config.countExitDuration;
      this.text.scale.set((1 - p) * this.config.countEntryScale + p * this.config.countExitScale);
      this.alpha = Math.pow(1 - p, 3);

    } else {
      // end
      return false;
    }
    return true;
  }

  override destroy() {
    this.text.destroy();

    super.destroy();
  }
}
