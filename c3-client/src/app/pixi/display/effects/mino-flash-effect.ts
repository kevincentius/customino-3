import { Effect } from "app/pixi/display/effects/effect";
import { BLEND_MODES, Container, Sprite, Texture } from "pixi.js";

export class MinoFlashEffect extends Container implements Effect {
  
  private spawnMs = Date.now();
  private pow = 3;

  constructor(
    width: number,
    height: number,
    private ttl: number,
    private startAlpha: number,
    private sprite = new Sprite(Texture.WHITE),
  ) {
    super();

    this.sprite.scale.set(width / this.sprite.width, height / this.sprite.height);
    this.sprite.blendMode == BLEND_MODES.ADD;
    this.addChild(this.sprite);
  }

  tick(): boolean {
    const p = (Date.now() - this.spawnMs) / this.ttl;
    if (p >= 1) {
      return false;
    } else {
      this.sprite.alpha = this.startAlpha * Math.pow(1 - p, this.pow);
      return true;
    }
  }
}
