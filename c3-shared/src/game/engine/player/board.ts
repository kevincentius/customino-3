import { playerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";
import { Subject } from "rxjs";

export interface PlaceTileEvent {y: number, x: number, tile: Tile};

export class Board {
  
  // events
  resetSubject = new Subject<number[]>();
  placeTileSubject = new Subject<PlaceTileEvent>();

  tiles: Tile[][];
  visibleHeight: number;

  constructor() {
    const rule = playerRule;
    this.tiles = Array.from(Array(rule.height + rule.invisibleHeight), () => Array(rule.width));
    this.visibleHeight = rule.height;
  }

  public placeTile(y: number, x: number, tile: Tile) {
    this.tiles[y][x] = tile;
    this.placeTileSubject.next({y, x, tile});
  }
}
