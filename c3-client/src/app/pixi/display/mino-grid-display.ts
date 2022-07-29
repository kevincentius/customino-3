import { Tile } from "@shared/game/engine/model/tile";
import { LineClearEvent, PlaceTileEvent } from "@shared/game/engine/player/board";
import { MatUtil } from "@shared/game/engine/util/mat-util";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { MinoAnimator } from "app/pixi/display/mino-grid/mino-animator";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { AdjustmentFilter, GlowFilter, KawaseBlurFilter } from "pixi-filters";
import { Container, Graphics } from "pixi.js";

export class MinoGridDisplay extends Container implements LayoutChild {
  // helpers
  spritesheet = new GameSpritesheet();
  
  // children
  minos: MinoAnimator[][];

  public layoutWidth: number;
  public layoutHeight: number;

  debug = false;
  debugRect?: Graphics;

  glowFilter = new GlowFilter({
    color: 0xffffff,
    outerStrength: 0,
    innerStrength: 0,
  });

  adjustmentFilter = new AdjustmentFilter({
    saturation: 1.3,
    brightness: 1.3,
  });

  constructor(private tiles: (Tile | null)[][], private minoSize: number, private invisibleHeight=0) {
    super();

    this.layoutWidth = this.minoSize * tiles[0].length;
    this.layoutHeight = this.minoSize * tiles.length;

    this.minos = Array.from(Array(this.tiles.length),
      () => Array.from(Array(this.tiles[0].length), () => new MinoAnimator(this.spritesheet, this.minoSize)));

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

    this.filters = [this.glowFilter, this.adjustmentFilter ];
    
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
  
  tick(dt: number) {
    for (let j = 0; j < this.minos[0].length; j++) {
      let zeroPos = this.calcMinoPos(this.minos.length - 1, 0).y;
      for (let i = this.minos.length - 1; i >= 0; i--) {
        this.minos[i][j].tick(dt, zeroPos);
        
        zeroPos = this.minos[i][j].absPos - this.minoSize;
      }
    }
  }

  chorus(p: number) {
    this.glowFilter.innerStrength = p * 1;
    this.glowFilter.outerStrength = p * 1;
  }

  placeTile(e: PlaceTileEvent) {
    if (this.minos[e.y][e.x].minoDisplay != undefined) {
      this.removeChild(this.minos[e.y][e.x].minoDisplay!);
      this.minos[e.y][e.x].minoDisplay = undefined;
    }

    if (e.tile != null) {
      this.minos[e.y][e.x].minoDisplay = new MinoDisplay(this.spritesheet, e.tile, this.minoSize);
      this.updateMinoPosition(e.y, e.x);
      this.addChild(this.minos[e.y][e.x].minoDisplay!);
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

    if (this.minos[i][j].minoDisplay) {
      this.minos[i][j].minoDisplay!.position.set(x, y);
    }
  }

  calcMinoPos(row: number, col: number) {
    return {
      x: col * this.minoSize,
      y: (row - this.invisibleHeight) * this.minoSize,
    }
  }
  
  clearLines(e: LineClearEvent): void {
    // calc fall distance
    let arr = [{pos: -1, dist: 0, epicenterSum: 0}];
    for (const row of e.rows) {
      const last = arr[arr.length - 1];
      if (row.y == last.pos + last.dist + 1) {
        last.dist++;
        last.epicenterSum += row.epicenter;
      } else {
        arr.push({pos: row.y - 1, dist: 1, epicenterSum: row.epicenter});
      }
    }
    
    // animate fall
    for (let fallRow of arr) {
      if (fallRow.pos == -1) { continue; }

      for (let j = 0; j < this.minos[fallRow.pos].length; j++) {
        const mino = this.minos[fallRow.pos][j];
        mino.speed = 0;
        mino.delay = Math.max(mino.delay, Math.abs(j - fallRow.epicenterSum / fallRow.dist) / this.minos[0].length * 0 * Math.min(4, e.rows.length + 4));

        // calc fall distance
        mino.pos -= this.minoSize * fallRow.dist;
        
        for (let di = 1; di <= fallRow.dist; di++) {
          mino.pos += this.minos[fallRow.pos + di][j].pos;
        }
      }
    }

    // destroy tiles
    const rows = e.rows.map(row => row.y);
    for (let row of rows) {
      for (let mino of this.minos[row]) {
        if (mino.minoDisplay != null) {
          this.removeChild(mino.minoDisplay);
        }
      }
    }

    MatUtil.shiftDown(this.minos, rows);
    
    for (let i = 0; i < rows.length; i++) {
      this.minos[i] = Array.from(Array(this.tiles[0].length), () => new MinoAnimator(this.spritesheet, this.minoSize));
    }
  }

  onRowsAdded(numRows: number) {
    for (let i = 0; i < numRows; i++) {
      for (let mino of this.minos[i]) {
        if (mino.minoDisplay != null) {
          this.removeChild(mino.minoDisplay);
        }
      }
    }

    let rows: (MinoAnimator)[][] = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(this.tiles[this.tiles.length - numRows + i].map(tile => {
        const mino = new MinoAnimator(this.spritesheet, this.minoSize);
        if (tile != null) {
          mino.minoDisplay = new MinoDisplay(this.spritesheet, tile, this.minoSize);
          this.addChild(mino.minoDisplay);
        }
        return mino;
      }));
    }

    MatUtil.addBottomRows(this.minos, rows);

    for (let i = this.minos.length - numRows; i < this.minos.length; i++) {
      for (let j = 0; j < this.minos[i].length; j++) {
        this.updateMinoPosition(i, j);
      }
    }
  }
}
