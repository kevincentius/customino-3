import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { cloneTile, Tile } from "@shared/game/engine/model/tile";
import { TileType } from "@shared/game/engine/model/tile-type";
import { Player } from "@shared/game/engine/player/player";
import { Attack } from "@shared/game/network/model/attack/attack";
import { AttackType } from "@shared/game/network/model/attack/attack-type";
import { Subject } from "rxjs";

export class GarbageGen {
  
  garbageRateSpawnSubject = new Subject<void>();
  attackReceivedSubject = new Subject<QueuedAttack[]>();
  
  // will be emitted whenever a queued attack is fully spawned into the board. Can be called multiple times in a single lock down.
  fullSpawnSubject = new Subject<void>();

  // will be emitted whenever a queued attack is only partially spawned due to garbage cap or spawn rate.
  queuedAttackUpdateSubject = new Subject<number>();
  
  
  public attackQueue: QueuedAttack[] = [];
  private spawnRateFrameCounter = 0;
  private cleanRow: (Tile | null)[] | null = null;

  constructor(
    private player: Player,
    private playerRule: PlayerRule,
  ) {
    
  }

  serialize() {
    return {
      attackQueue: JSON.stringify(this.attackQueue),
      frameCount: this.spawnRateFrameCounter,
      cleanRow: JSON.stringify(this.cleanRow),
    }
  }

  load(state: any) {
    this.attackQueue.splice(0, this.attackQueue.length,...JSON.parse(state.attackQueue));
    this.spawnRateFrameCounter = state.frameCount;
    this.cleanRow = JSON.parse(state.cleanRow);
  }

  queueAttack(attacks: Attack[]) {
    const receivedAttacks: QueuedAttack[] = attacks.map(attack => ({
      attack: attack,
      powerLeft: attack.power,
      frameQueued: this.player.frame,
      frameReady: this.player.frame + (gameLoopRule.fps * this.playerRule.garbageSpawnDelayTable[Math.min(this.playerRule.garbageSpawnDelayTable.length - 1, Math.floor(attack.power))]),
    }));
    this.attackReceivedSubject.next(receivedAttacks);

    this.attackQueue.push(...receivedAttacks);
  }

  createTile(type: TileType): Tile | null {
    return type == null ? null : { color: -1, type: type };
  }

  runFrame() {
    if (this.attackQueue.length > 0 && this.attackQueue[0].frameReady <= this.player.frame) {
      const spawnFramesPerLine = gameLoopRule.fps / this.playerRule.garbageSpawnRate;
      const spawnAmount = Math.floor((-this.spawnRateFrameCounter) / spawnFramesPerLine) + 1;
      this.spawnRateFrameCounter += spawnAmount * spawnFramesPerLine;

      if (spawnAmount > 0) {
        this.spawnGarbage(spawnAmount, this.attackQueue);
        this.garbageRateSpawnSubject.next();
      }
      
      this.spawnRateFrameCounter--;
    } else {
      this.spawnRateFrameCounter = Math.max(0, this.spawnRateFrameCounter - 1);
    }
  }

  /* Spawns up to spawnAmount lines of garbage.
   *  If spawnAmount is more than the number of queued garbage lines,
   *  then all will be spawned and the remainder is ignored. */
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
        this.fullSpawnSubject.next();
      } else {
        this.cleanRow = this.cleanRow ?? this.generateRow(attack.attack);
        rows.push(...this.copyRows(this.cleanRow, spawnLeft));
        attack.powerLeft -= spawnLeft;
        spawnLeft = 0;
        this.queuedAttackUpdateSubject.next(0);
      }

      this.player.board.addBottomRows(rows);

      for (const row of rows) {
        this.player.activePiece.attemptMove(-1, 0, 0);
      }

      if (this.player.activePiece.checkCollision()) {
        this.player.die();
      }
    }
  }

  generateRow(attack: Attack): (Tile | null)[] {
    if (attack.type == AttackType.CLEAN_1) {
      const holePos = this.player.r.int(this.playerRule.width);
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
