import { TileType } from "@shared/game/engine/model/tile-type";

export interface Tile {
  type: TileType;
  color: number;
}

export function cloneTile(tile: Tile): Tile {
  return {
    type: tile.type,
    color: tile.color
  }
}
