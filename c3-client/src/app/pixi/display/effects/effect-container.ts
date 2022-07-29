import { Effect } from "app/pixi/display/effects/effect";
import { Container } from "pixi.js";

export class EffectContainer extends Container {
  effects: Effect[] = [];

  addEffect(effect: Effect) {
    this.addChild(effect);
    this.effects.push(effect);
  }

  tick(dt: number) {
    this.effects = this.effects.filter(effect => {
      const result = effect.tick(dt);
      if (!result) {
        this.removeChild(effect);
      }
      return result;
    });
  }
}
