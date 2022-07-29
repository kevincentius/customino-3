import { Tile } from "@shared/game/engine/model/tile";
import { PlaceTileEvent } from "@shared/game/engine/player/board";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { AdjustmentFilter, GlowFilter, KawaseBlurFilter } from "pixi-filters";
import { Container, Graphics } from "pixi.js";

export class MinoGridDisplay extends Container implements LayoutChild {
  // helpers
  spritesheet = new GameSpritesheet();
  
  // children
  minos: (MinoDisplay | null)[][];

  public layoutWidth: number;
  public layoutHeight: number;

  debug = false;
  debugRect?: Graphics;

  constructor(private tiles: (Tile | null)[][], private minoSize: number, private invisibleHeight=0) {
    super();

    this.layoutWidth = this.minoSize * tiles[0].length;
    this.layoutHeight = this.minoSize * tiles.length;

    this.minos = Array.from(Array(this.tiles.length), () => Array(this.tiles[0].length));

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if(this.tiles[i][j] != null) {
          this.placeTile({
            y: i,
            x: j,
            tile: this.tiles[i][j],
          });
        }
      }
    }

    this.filters = [new GlowFilter({
      color: 0xffffff,
      outerStrength: 0.5,
      innerStrength: 0,
    }),
      new AdjustmentFilter({
        saturation: 1.3,
        brightness: 1.3,
      })
    ];
    
    if (this.debug) {
      this.debugRect = new Graphics();
      this.addChild(this.debugRect);

      this.debugRect
        .clear()
        .lineStyle({
          width: 1,
          color: 0x00ff00,
          alpha: 0.5,
        })
        .drawRect(0, 0, this.layoutWidth, this.layoutHeight);
    }
  }
  
  placeTile(e: PlaceTileEvent) {
    if (this.minos[e.y][e.x] != null) {
      this.removeChild(this.minos[e.y][e.x]!);
      this.minos[e.y][e.x] = null!;
    }

    if (e.tile != null) {
      this.minos[e.y][e.x] = new MinoDisplay(this.spritesheet, e.tile, this.minoSize);
      this.updateMinoPosition(e.y, e.x);
      this.addChild(this.minos[e.y][e.x]!);
    }
  }

  rotate(drot: number) {
    for (let i = 0; i < (drot + 400000) % 4; i++) {
      this.minos = MatUtil.rotate(this.minos);
    }

    for (let i = 0; i < this.minos.length; i++) {
      for (let j = 0; j < this.minos[i].length; j++) {
        this.updateMinoPosition(i, j);
      }
    }
  }
  
  private updateMinoPosition(i: number, j: number) {
    if(this.minos[i][j] == null) {
      return;
    }
    
    const { x, y } = this.calcMinoPos(i, j);

    if (this.minos[i][j]) {
      this.minos[i][j]!.position.set(x, y);
    }
  }

  calcMinoPos(row: number, col: number) {
    return {
      x: col * this.minoSize,
      y: (row - this.invisibleHeight) * this.minoSize,
    }
  }
  
  clearLines(rows: number[]): void {
    for (let row of rows) {
      for (let mino of this.minos[row]) {
        if (mino != null) {
          this.removeChild(mino);
        }
      }
    }

    MatUtil.clearLines(this.minos, rows);

    for (let i = rows[rows.length - 1]; i >= rows.length; i--) {
      for (let j = 0; j < this.minos[i].length; j++) {
        this.updateMinoPosition(i, j);
      }
    }
  }

  onRowsAdded(numRows: number) {
    for (let i = 0; i < numRows; i++) {
      for (let mino of this.minos[i]) {
        if (mino != null) {
          this.removeChild(mino);
        }
      }
    }

    let rows: (MinoDisplay | null)[][] = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(this.tiles[this.tiles.length - numRows + i].map(tile => {
        if (tile != null) {
          const minoDisplay = new MinoDisplay(this.spritesheet, tile, this.minoSize);
          this.addChild(minoDisplay);
          return minoDisplay;
        } else {
          return null;
        }
      }));
    }

    MatUtil.addBottomRows(this.minos, rows);

    for (let i = 0; i < this.minos.length; i++) {
      for (let j = 0; j < this.minos[i].length; j++) {
        this.updateMinoPosition(i, j);
      }
    }
  }
}
