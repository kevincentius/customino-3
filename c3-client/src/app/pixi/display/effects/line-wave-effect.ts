import { Effect } from "app/pixi/display/effects/effect";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { textureUtil } from "app/pixi/util/texture-util";
import { Container, Sprite } from "pixi.js";;

export class LineWaveEffect extends Container implements Effect {
  
  private sprite: Sprite;

  constructor(
    private spritesheet: GameSpritesheet,
    private bgWidth: number,
    private bgHeight: number,
    private waveHeight: number,
    private finishMs: number,
    private duration: number,
    private pow = 3,
  ) {
    super();

    this.sprite = new Sprite(textureUtil.lineWaveGradient);

    this.sprite.scale.set(this.bgWidth / this.sprite.texture.width, this.waveHeight / this.sprite.texture.height);
    this.sprite.position.set(0, this.bgHeight + this.waveHeight);
    this.addChild(this.sprite);

    this.tick();
  }

  tick(): boolean {
    const p = 1 - (this.finishMs - Date.now()) / this.duration;
    if (p < 0) {
      return true;
    } else if (p >= 1) {
      return false;
    } else {
      this.sprite.position.y = this.bgHeight + this.waveHeight - (this.bgHeight + 2 * this.waveHeight) * (1 - Math.pow(1 - p, this.pow));
      return true;
    }
  }

  override destroy() {
    this.sprite.destroy();

    super.destroy();
  }
}
