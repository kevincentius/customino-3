import { textUtil } from "app/pixi/util/text-util";
import { Container, Sprite, Texture } from "pixi.js"

export class BoardOverlayDisplay extends Container {
  // config
  private mainTextSize = 48;
  private subTextSize = 32;
  private spacing = 10;
  private padding = 20;
  private bannerHeight = this.mainTextSize + this.subTextSize + this.spacing + 2 * this.padding;

  // children
  private mainText = textUtil.create('test', this.mainTextSize);
  private subText = textUtil.create('subtest', this.subTextSize);
  private fullBackground = Sprite.from(Texture.WHITE);
  private bannerBackground = Sprite.from(Texture.WHITE);

  constructor(private w: number, private h: number) {
    super();

    this.fullBackground.width = this.w;
    this.fullBackground.height = this.h;
    this.addChild(this.fullBackground);

    let ty = (this.h - this.bannerHeight) / 2;
    this.bannerBackground.width = this.w;
    this.bannerBackground.height = 100;
    this.bannerBackground.position.set(0, ty);
    this.addChild(this.bannerBackground);
    ty += this.padding;

    this.mainText.position.set(this.w / 2, ty);
    this.mainText.anchor.x = 0.5;
    this.addChild(this.mainText);
    ty += this.mainTextSize + this.spacing;

    this.subText.position.set(this.w / 2, ty);
    this.subText.anchor.x = 0.5;
    this.addChild(this.subText);
  }
}
