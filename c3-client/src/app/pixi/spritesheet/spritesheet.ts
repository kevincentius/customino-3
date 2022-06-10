import { Loader } from "pixi.js";

// Helper to get sprites. Cheap to create.
export class GameSpritesheet {
  spritesheet = Loader.shared.resources['gameSpritesheet'].spritesheet!;
  mino = Array.from(Array(9).keys()).map(i => this.spritesheet.textures[i + '.png']);
}
