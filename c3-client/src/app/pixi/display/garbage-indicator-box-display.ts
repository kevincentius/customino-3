import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container, Sprite } from "pixi.js";

const pendingTx = 0;
const chargingTx = 1;
const readyTx = 3;

export class GarbageIndicatorBoxDisplay extends Container {
  private spriteTop: Sprite;
  private spriteMiddle: Sprite;
  private spriteBottom: Sprite;
  
  private spriteBgTop: Sprite;
  private spriteBgMiddle: Sprite;
  private spriteBgBottom: Sprite;

  private spriteScale: number;

  private ready = false;

  constructor(
    private spritesheet: GameSpritesheet,
    private layoutWidth: number,
  ) {
    super();

    this.spriteTop = new Sprite(spritesheet.garbageIndicatorTop[chargingTx]);
    this.spriteBgTop = new Sprite(spritesheet.garbageIndicatorTop[pendingTx]);

    this.spriteMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[chargingTx]);
    this.spriteBgMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[pendingTx]);

    this.spriteBottom = new Sprite(spritesheet.garbageIndicatorBottom[chargingTx]);
    this.spriteBgBottom = new Sprite(spritesheet.garbageIndicatorBottom[pendingTx]);

    this.spriteScale = this.layoutWidth / this.spriteMiddle.texture.width;
    for (const sprite of [
      this.spriteBgTop,
      this.spriteBgMiddle,
      this.spriteBgBottom,
      this.spriteTop,
      this.spriteMiddle,
      this.spriteBottom,
    ]) {
      sprite.scale.x = this.spriteScale;
      sprite.scale.y = this.spriteScale;
      this.addChild(sprite);
    }

    this.removeChild(this.spriteTop);
  }

  tick(bgHeight: number, fgHeight: number) {
    this.updateBackground(bgHeight);
    this.updateForeground(bgHeight, fgHeight);

    if (fgHeight >= bgHeight && !this.ready) {
      this.ready = true;
      this.spriteBgBottom.texture = this.spritesheet.garbageIndicatorBottom[readyTx];
      this.spriteBgMiddle.texture = this.spritesheet.garbageIndicatorMiddle[readyTx];
      this.spriteBgTop.texture = this.spritesheet.garbageIndicatorTop[readyTx];

      this.removeChild(this.spriteMiddle);
      this.removeChild(this.spriteBottom);
    }
  }

  private updateBackground(bgHeight: number) {
    const totalBgHeight = bgHeight;
    const topBgHeight = this.spriteBgTop.texture.height * this.spriteScale;
    const bottomBgHeight = this.spriteBgBottom.texture.height * this.spriteScale;
    const middleBgHeight = totalBgHeight - topBgHeight - bottomBgHeight;

    this.spriteBgMiddle.position.y = topBgHeight;
    this.spriteBgMiddle.scale.y = middleBgHeight / this.spriteBgMiddle.texture.height;
    this.spriteBgBottom.position.y = topBgHeight + middleBgHeight;
  }

  private updateForeground(bgHeight: number, fgHeight: number) {
    const topFgHeight = this.spriteTop.texture.height * this.spriteScale;
    const bottomFgHeight = this.spriteBottom.texture.height * this.spriteScale;
    const middleFgHeight = Math.max(0, fgHeight - topFgHeight - bottomFgHeight);

    if (middleFgHeight >= 0) {
      this.spriteBottom.position.y = bgHeight - bottomFgHeight;
      this.spriteMiddle.position.y = bgHeight - bottomFgHeight - middleFgHeight;
      this.spriteMiddle.scale.y = middleFgHeight / this.spriteMiddle.texture.height;
      this.spriteTop.position.y = bgHeight - fgHeight;
    }
  }

  override destroy() {
    this.spriteTop.destroy();
    this.spriteBgTop.destroy();
    this.spriteMiddle.destroy();
    this.spriteBgMiddle.destroy();
    this.spriteBottom.destroy();
    this.spriteBgBottom.destroy();

    super.destroy();
  }
}
