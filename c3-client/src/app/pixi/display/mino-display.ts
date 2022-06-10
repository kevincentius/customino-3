import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container, Sprite } from "pixi.js";

export class MinoDisplay extends Container {
  sprite: Sprite;

  constructor(private spritesheet: GameSpritesheet, private tile: Tile) {
    super();
    
    if (tile.type == TileType.FILLED) {
      this.sprite = new Sprite(this.spritesheet.mino[tile.color]);
    } else {
      throw new Error('Unknown tile type.');
    }

    this.addChild(this.sprite);
  }
}
