import { easeOut } from "app/pixi/display/util/interpolation";
import { Container, Sprite, Texture } from "pixi.js";

interface Item {
  sprite: Sprite;
  spawnMs: number;
  prevX: number;
  prevY: number;
  targetX: number;
  targetY: number;
}

export class SpriteCircleDisplay extends Container {
  stars = 0;

  items: Item[] = [];

  prevMs = Date.now();

  constructor(
    private texture: Texture,
    private radius: number,
    private spriteScale: number,
    private degreesPerSprite: number,
  ) {
    super();
  }

  setStars(stars: number) {
    this.stars = stars;

    if (this.stars > this.items.length) {
      for (let i = this.items.length; i < this.stars; i++) {
        const sprite = new Sprite(this.texture);
        sprite.anchor.set(0.5);
        sprite.y = -this.radius;
        sprite.scale.set(this.spriteScale);
        this.addChild(sprite);
  
        this.items.push({
          sprite: sprite,
          spawnMs: Date.now(),
          prevX: 0,
          prevY: sprite.y,
          targetX: 0,
          targetY: sprite.y,
        });
      }
  
      this.prevMs = Date.now();
      this.updateItemPos();
    } else if (this.stars < this.items.length) {
      for (let i = this.stars; i < this.items.length; i++) {
        this.removeChild(this.items[i].sprite);
        
        this.prevMs = Date.now();
      }
      this.items.splice(this.stars);
      this.updateItemPos();
    }
  }

  private updateItemPos() {
    for (let i = 0; i < this.stars; i++) {
      const deg = ((this.stars - 1) / 2 - Math.floor(i / 2)) * this.degreesPerSprite;

      this.items[i].prevX = this.items[i].sprite.position.x;
      this.items[i].prevY = this.items[i].sprite.position.y;
      this.items[i].targetX = Math.sin(deg * Math.PI / 180) * this.radius * ((i % 2) * 2 - 1);
      this.items[i].targetY = -Math.cos(deg * Math.PI / 180) * this.radius;
    }
  }

  tick(dt: number) {
    for (let i = 0; i < this.stars; i++) {
      const item = this.items[i];
      item.sprite.position.set(
        easeOut(20, Date.now() - this.prevMs, item.prevX, item.targetX),
        easeOut(20, Date.now() - this.prevMs, item.prevY, item.targetY),
      );
      item.sprite.scale.set(easeOut(20, Date.now() - item.spawnMs, 20, 1) * this.spriteScale);
    }
  }
}
