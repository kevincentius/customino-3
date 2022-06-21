import { Sprite, Texture } from "pixi.js";

export class ShapeUtil {
  static rect(x: number, y: number, width: number, height: number, color: number): Sprite {
    let sprite = new Sprite(Texture.WHITE);
    sprite.position.set(x, y);
    sprite.width = width;
    sprite.height = height;
    sprite.tint = color;
    return sprite;
  }
}
