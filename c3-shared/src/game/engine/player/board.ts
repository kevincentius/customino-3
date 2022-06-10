import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";

export class Board {
  
  tiles: Tile[][];

  constructor() {
    const r = playerRule;
    this.tiles = Array.from(Array(r.height + r.invisibleHeight), () => Array(r.width));
    
  }
}
