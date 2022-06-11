import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container, Sprite } from "pixi.js";

export class MinoDisplay extends Container {
  sprite: Sprite;

  constructor(private spritesheet: GameSpritesheet, private tile: Tile, private minoSize: number) {
    super();
    
    if (this.tile.type == TileType.FILLED) {
      this.sprite = new Sprite(this.spritesheet.mino[this.tile.color]);
      this.sprite.scale.set(this.minoSize / this.spritesheet.mino[0].width);
    } else {
      throw new Error('Unknown tile type.');
    }

    this.addChild(this.sprite);
  }
}
