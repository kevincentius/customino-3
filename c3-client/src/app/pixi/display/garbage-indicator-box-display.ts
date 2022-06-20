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

  constructor(
    spritesheet: GameSpritesheet,
    private variant: number,
    private player: Player,
    public attack: QueuedAttack,
    private layoutWidth: number,
    private minoSize: number,
  ) {
    super();

    this.spriteTop = new Sprite(spritesheet.garbageIndicatorTop[this.variant + 2]);
    this.spriteBgTop = new Sprite(spritesheet.garbageIndicatorTop[0]);

    this.spriteMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[this.variant + 2]);
    this.spriteBgMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[0]);

    this.spriteBottom = new Sprite(spritesheet.garbageIndicatorBottom[this.variant + 2]);
    this.spriteBgBottom = new Sprite(spritesheet.garbageIndicatorBottom[0]);

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

  tick() {
    this.updateBackground();
    this.updateForeground();
  }

  private updateBackground() {
    const totalBgHeight = this.attack.powerLeft * this.minoSize;
    const topBgHeight = this.spriteBgTop.texture.height * this.spriteScale;
    const bottomBgHeight = this.spriteBgBottom.texture.height * this.spriteScale;
    const middleBgHeight = totalBgHeight - topBgHeight - bottomBgHeight;

    this.spriteBgMiddle.position.y = topBgHeight;
    this.spriteBgMiddle.scale.y = middleBgHeight / this.spriteBgMiddle.texture.height;
    this.spriteBgBottom.position.y = topBgHeight + middleBgHeight;
  }

  private updateForeground() {
    const framesSinceQueued = this.player.frame - this.attack.frameQueued;
    const framesDelayTotal = this.attack.frameReady - this.attack.frameQueued;
    const p = Math.min(1, framesSinceQueued / framesDelayTotal);
    
    const totalBgHeight = this.attack.powerLeft * this.minoSize;
    const totalFgHeight = this.attack.powerLeft * p * this.minoSize;
    const topFgHeight = this.spriteTop.texture.height * this.spriteScale;
    const bottomFgHeight = this.spriteBottom.texture.height * this.spriteScale;
    const middleFgHeight = Math.max(0, totalFgHeight - topFgHeight - bottomFgHeight);

    if (middleFgHeight >= 0) {
      this.spriteBottom.position.y = totalBgHeight - bottomFgHeight;
      this.spriteMiddle.position.y = totalBgHeight - bottomFgHeight - middleFgHeight;
      this.spriteMiddle.scale.y = middleFgHeight / this.spriteMiddle.texture.height;
      this.spriteTop.position.y = totalBgHeight - totalFgHeight;
    }
  }
}
