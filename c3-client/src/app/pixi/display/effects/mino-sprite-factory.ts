import { Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Sprite } from "pixi.js";

export function createMinoSprite(spritesheet: GameSpritesheet, tile: Tile, minoSize: number) {
  if (tile.type == TileType.FILLED) {
    return createSprite(spritesheet, tile.color, minoSize);
  } else if (tile.type == TileType.GARBAGE) {
    return createSprite(spritesheet, 7, minoSize);
  } else {
    throw new Error('Unknown tile type.');
  }
}

function createSprite(spritesheet: GameSpritesheet, textureMinoId: number, minoSize: number) {
  const scale = minoSize / spritesheet.mino[0].width;
  const sprite = new Sprite(spritesheet.mino[textureMinoId]);
  sprite.scale.set(scale);
  return sprite;
}