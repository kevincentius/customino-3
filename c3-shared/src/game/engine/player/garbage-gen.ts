import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { cloneTile, Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Board } from "@shared/game/engine/player/board";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { Attack, AttackType } from "@shared/game/network/model/event/server-event";

export class GarbageGen {
  frameCount = 0;

  cleanRow: (Tile | null)[] | null = null;

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
    if (attackQueue.length > 0) {
      this.frameCount++;

      let spawnAmount = 0;
      while (this.frameCount > this.playerRule.garbageSpawnDelay * gameLoopRule.fps) {
        this.frameCount -= gameLoopRule.fps / this.playerRule.garbageSpawnRate;
        spawnAmount++;
      }

      let spawnLeft = spawnAmount;
      while (spawnLeft > 0 && attackQueue.length > 0) {
        const rows: (Tile | null)[][] = [];
        
        const attack = attackQueue[0];
        if (spawnLeft >= attack.powerLeft) {
          rows.push(...this.copyRows(this.cleanRow ?? this.generateRow(attack.attack), attack.powerLeft));
          this.cleanRow = null;
          spawnLeft -= attack.powerLeft;
          attackQueue.shift();
        } else {
          this.cleanRow = this.cleanRow ?? this.generateRow(attack.attack);
          rows.push(...this.copyRows(this.cleanRow, spawnLeft));
          attack.powerLeft -= spawnLeft;
          spawnLeft = 0;
        }
        
        this.board.addBottomRows(rows);
      }
    } else {
      this.frameCount = 0;
    }
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
    
    return ret;
  }
}
