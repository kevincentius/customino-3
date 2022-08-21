import { Effect } from "app/pixi/display/effects/effect";

export class EffectContainer {
  effects: Effect[] = [];

  addEffect(effect: Effect) {
    this.effects.push(effect);
  }

  tick(dt: number) {
    this.effects = this.effects.filter(effect => {
      const result = effect.tick(dt);
      if (!result) {
        effect.parent?.removeChild(effect);
        effect.destroy();
      }
      return result;
    });
  }

  destroy() {
    for (const effect of this.effects) {
      effect.destroy();
    }
  }
}
