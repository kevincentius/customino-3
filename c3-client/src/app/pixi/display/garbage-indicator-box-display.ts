import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container, Sprite } from "pixi.js";

export class GarbageIndicatorBoxDisplay extends Container {
  private spriteTop: Sprite;
  private spriteMiddle: Sprite;
  private spriteBottom: Sprite;
  private spriteScale: number;

  constructor(
    spritesheet: GameSpritesheet,
    private variant: number,
    public power: number,
    private layoutWidth: number,
    private minoSize: number,
  ) {
    super();

    this.spriteTop = new Sprite(spritesheet.garbageIndicatorTop[this.variant]);
    this.spriteMiddle = new Sprite(spritesheet.garbageIndicatorMiddle[this.variant]);
    this.spriteBottom = new Sprite(spritesheet.garbageIndicatorBottom[this.variant]);

    this.spriteScale = this.layoutWidth / this.spriteMiddle.texture.width;
    this.spriteTop.scale.x = this.spriteScale;
    this.spriteTop.scale.y = this.spriteScale;
    this.spriteMiddle.scale.x = this.spriteScale;
    this.spriteBottom.scale.x = this.spriteScale;
    this.spriteBottom.scale.y = this.spriteScale;

    // debug:
    // this.spriteTop.position.x = -10;
    // this.spriteBottom.position.x = 10;

    this.addChild(this.spriteTop);
    this.addChild(this.spriteMiddle);
    this.addChild(this.spriteBottom);
    
    this.updateSpriteLayout();
  }

  setPower(power: number) {
    this.power = power;
    this.updateSpriteLayout();
  }

  private updateSpriteLayout() {
    const totalHeight = this.power * this.minoSize;
    const topHeight = this.spriteTop.texture.height * this.spriteScale;
    const bottomHeight = this.spriteBottom.texture.height * this.spriteScale;
    const middleHeight = totalHeight - topHeight - bottomHeight;

    this.spriteMiddle.position.y = topHeight;
    this.spriteMiddle.scale.y = middleHeight / this.spriteMiddle.texture.height;
    
    this.spriteBottom.position.y = topHeight + middleHeight;
  }
}
