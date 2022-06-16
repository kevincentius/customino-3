import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { cloneTile, Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Board } from "@shared/game/engine/player/board";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { Attack, AttackType } from "@shared/game/network/model/event/server-event";

export class GarbageGen {
  frameCount = 0;

  constructor(
    private r: RandomGen,
    private board: Board,
    private playerRule: PlayerRule,
  ) {
    
  }

  createTile(type: TileType): Tile | null {
    return type == null ? null : { color: -1, type: type };
  }

  runFrame(attackQueue: QueuedAttack[]) {
    console.log('runFrame', attackQueue.length);
    if (attackQueue.length > 0) {
      console.log('runFrame', JSON.stringify(attackQueue));
    }
    const rows: (Tile | null)[][] = [];
    // test - just spawn all immediately for now
    for (const attack of attackQueue) {
      rows.push(...this.copyRows(this.generateRow(attack.attack), attack.powerLeft));
    }
    attackQueue.splice(0, attackQueue.length);
    
    if (rows.length > 0) {
      console.log(JSON.stringify(rows));
    }
    this.board.addBottomRows(rows);
  }

  generateRow(attack: Attack): (Tile | null)[] {
    if (attack.type == AttackType.HOLE_1) {
      const holePos = this.r.int(this.playerRule.width);
      let row: (Tile | null)[] = [];
      for (let j = 0; j < this.playerRule.width; j++) {
        if (j != holePos) {
          row[j] = this.createTile(TileType.GARBAGE);
        }
      }
      console.log('generateRow', JSON.stringify(row));
      return row;
    } else {
      throw new Error();
    }
  }

  copyRows(row: (Tile | null)[], numRows: number): (Tile | null)[][] {
    let ret: (Tile | null)[][] = [];
    for (let i = 0; i < numRows; i++) {
      ret.push(row.map(tile => tile == null ? null : cloneTile(tile)));
    }
    
    console.log('copyRows', JSON.stringify(ret));
    return ret;
  }
}
