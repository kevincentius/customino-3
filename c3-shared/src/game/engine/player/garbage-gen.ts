import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { cloneTile, Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Board } from "@shared/game/engine/player/board";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { Attack, AttackType } from "@shared/game/network/model/event/server-event";
import { Subject } from "rxjs";

export class GarbageGen {
  private spawnRateFrameCounter = 0;

  garbageRateSpawnSubject = new Subject<void>();

  cleanRow: (Tile | null)[] | null = null;

  constructor(
    private r: RandomGen,
    private board: Board,
    private playerRule: PlayerRule,
    private attackQueue: QueuedAttack[],
  ) {
    
  }

  serialize() {
    return {
      frameCount: this.spawnRateFrameCounter,
      cleanRow: JSON.stringify(this.cleanRow),
    }
  }

  load(state: any) {
    this.spawnRateFrameCounter = state.frameCount;
    this.cleanRow = JSON.parse(state.cleanRow);
  }

  createTile(type: TileType): Tile | null {
    return type == null ? null : { color: -1, type: type };
  }

  runFrame() {
    if (this.attackQueue.length > 0) {
      this.spawnRateFrameCounter--;

      let spawnAmount = 0;
      while (this.spawnRateFrameCounter <= 0) {
        this.spawnRateFrameCounter += gameLoopRule.fps / this.playerRule.garbageSpawnRate;
        spawnAmount++;
      }

      console.log(spawnAmount);
      
      if (spawnAmount > 0) {
        this.spawnGarbage(spawnAmount, this.attackQueue);
        this.garbageRateSpawnSubject.next();
      }
    } else {
      this.spawnRateFrameCounter = this.playerRule.garbageSpawnDelay * gameLoopRule.fps;
    }
  }

  private spawnGarbage(spawnAmount: number, attackQueue: QueuedAttack[]) {
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
