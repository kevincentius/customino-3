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
  private mainText = textUtil.create48('Game Over');
  private subText = textUtil.create('2nd place');
  private fullBackground = Sprite.from(Texture.WHITE);
  private bannerBackground = Sprite.from(Texture.WHITE);

  constructor(private w: number, private h: number) {
    super();

    this.fullBackground.width = this.w;
    this.fullBackground.height = this.h;
    this.fullBackground.alpha = 0.75;
    this.fullBackground.tint = 0x000000;
    this.addChild(this.fullBackground);

    let ty = (this.h - this.bannerHeight) / 2;
    this.bannerBackground.width = this.w;
    this.bannerBackground.height = this.bannerHeight;
    this.bannerBackground.position.set(0, ty);
    this.bannerBackground.alpha = 0.5;
    this.bannerBackground.tint = 0x222222;
    this.addChild(this.bannerBackground);
    ty += this.padding;

    this.mainText.position.set(this.w / 2, ty);
    this.mainText.anchor.x = 0.5;
    this.addChild(this.mainText);
    ty += this.mainTextSize + this.spacing;

    this.subText.position.set(this.w / 2, ty);
    this.subText.anchor.x = 0.5;
    this.addChild(this.subText);

    this.visible = false;
  }

  show(mainText: string, subText?: string) {
    this.mainText.text = mainText;
    this.subText.text = subText ?? '';
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
