import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { Player } from "@shared/game/engine/player/player";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container, Sprite } from "pixi.js";

export class GarbageIndicatorBoxDisplay extends Container {
  private spriteTop: Sprite;
  private spriteMiddle: Sprite;
  private spriteBottom: Sprite;
  
  private spriteBgTop: Sprite;
  private spriteBgMiddle: Sprite;
  private spriteBgBottom: Sprite;

  private spriteScale: number;

  private queuedAt = Date.now();

  constructor(
    spritesheet: GameSpritesheet,
    private layoutWidth: number,
  ) {
    super();

    this.spriteTop = new Sprite(spritesheet.garbageIndicatorTop[3]);
    this.spriteBgTop = new Sprite(spritesheet.garbageIndicatorTop[2]);

    this.spriteMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[3]);
    this.spriteBgMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[2]);

    this.spriteBottom = new Sprite(spritesheet.garbageIndicatorBottom[3]);
    this.spriteBgBottom = new Sprite(spritesheet.garbageIndicatorBottom[2]);

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
  }

  tick(bgHeight: number, fgHeight: number) {
    this.updateBackground(bgHeight);
    this.updateForeground(bgHeight, fgHeight);
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
}
