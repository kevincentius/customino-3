import { Effect } from "app/pixi/display/effects/effect";
import { Container, Sprite, Texture } from "pixi.js";

export class MinoFlashEffect extends Container implements Effect {
  
  private sprite: Sprite;
  private spawnMs = Date.now();
  private pow = 3;

  constructor(
    minoSize: number,
    private ttl: number,
    private startAlpha: number,
  ) {
    super();

    this.sprite = new Sprite(Texture.WHITE);
    this.sprite.scale.set(minoSize / Texture.WHITE.width, minoSize / Texture.WHITE.height);
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
