import { resources } from "app/pixi/application";
import { Container, Sprite } from "pixi.js";

export class SampleDisplay extends Container {
  constructor() {
    super();
    
    // create new sprite from loaded resource
    const resource = resources['sample']!;
    const sprite = new Sprite(resource.texture);

    // set in a different position
    sprite.position.set(200, 300);

    // add the sprite to the stage
    this.addChild(sprite);
  }
}
