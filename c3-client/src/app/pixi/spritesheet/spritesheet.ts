import { Loader } from "pixi.js";

// Helper to get sprites. Cheap to create.
export class GameSpritesheet {
  spritesheet = Loader.shared.resources['gameSpritesheet'].spritesheet!;
  mino = Array.from(Array(9).keys()).map(i => this.spritesheet.textures[i + '.png']);
  garbageIndicatorTop = Array.from(Array(3).keys()).map(i => this.spritesheet.textures[`garbage-indicator-top-${i}.png`]);
  garbageIndicatorMiddle = Array.from(Array(3).keys()).map(i => this.spritesheet.textures[`garbage-indicator-middle-${i}.png`]);
  garbageIndicatorBottom = Array.from(Array(3).keys()).map(i => this.spritesheet.textures[`garbage-indicator-bottom-${i}.png`]);
}

// export const gameSpritesheet = new GameSpritesheet();
