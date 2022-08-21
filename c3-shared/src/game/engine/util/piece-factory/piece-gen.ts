import { Piece } from "@shared/game/engine/player/piece";
import { pieceDataArray } from "@shared/game/engine/util/piece-factory/piece-data";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { shuffle } from "@shared/util/random";


export interface PieceList {
  size: number;
  pieceId?: number; // if not given, then spawn all pieces
  multiplier?: number; // if decimal, some pieces will be missing
}

export interface PieceGen {
  next(): Piece;
  nextId(): number[]; // like next() but returns only the piece size + id

  serialize(): any;
  load(state: any): void;
}

export enum PieceGenType { RANDOM, MEMORY, BAG }

export function loadPieceGen(r: RandomGen, pieceList: PieceList[], state: any) {
  const pieceGen = (() => {
    switch (state.type) {
      case PieceGenType.RANDOM: return new RandomPieceGen(r, pieceList);
      case PieceGenType.MEMORY: return new MemoryPieceGen(r, pieceList, 0);
      case PieceGenType.BAG: return new BagPieceGen(r, pieceList);
      default: throw new Error();
    }
  })();

  pieceGen.load(state);
  return pieceGen;
}

function getBag(pieceList: PieceList[]) {
  let bag: number[][] = [];
  // refill bag
  for (let e of pieceList) {
    for (let m = 0; m < (e.multiplier ?? 1); m++) {
      if (e.pieceId == null) {
        for (let i = 0; i < pieceDataArray[e.size - 1].length; i++) {
          bag.push([e.size, i]);
        }
      } else {
        bag.push([e.size, e.pieceId]);
      }
    }
  }
  return bag;
}

export class RandomPieceGen implements PieceGen {
  private bag: number[][] = []; // [pos][size,pieceId]

  constructor(
    private r: RandomGen,
    pieceList: PieceList[]
  ) {
    this.bag = getBag(pieceList);
  }

  serialize() {
    return {
      type: PieceGenType.RANDOM,
    };
  }

  load(state: any) {}

  next(): Piece {
    let [size, id] = this.nextId();
    return new Piece(size, id);
  }

  nextId(): number[] {
    return this.r.pick(this.bag);
  }

  reset() { }
}

export class MemoryPieceGen implements PieceGen {
  private bag: number[][] = []; // [pos][size,pieceId]
  private mem: number[][] = [];
  private nextMemId = 0;

  constructor(
    private r: RandomGen,
    pieceList: PieceList[],
    memSize: number
  ) {
    this.bag = getBag(pieceList);
    if (memSize >= this.bag.length) {
      console.warn('INVALID MEM SIZE piece gen');
      memSize = this.bag.length - 1;
    }
    this.mem = this.bag.splice(this.bag.length - memSize);
  }

  serialize() {
    return {
      type: PieceGenType.MEMORY,
      bag: JSON.stringify(this.bag),
      mem: JSON.stringify(this.mem),
      nextMemId: this.nextMemId,
    };
  }

  load(state: any) {
    this.bag = JSON.parse(state.bag);
    this.mem = JSON.parse(state.mem);
    this.nextMemId = state.nextMemId;
  }

  next(): Piece {
    let [size, id] = this.nextId();
    return new Piece(size, id);
  }

  nextId(): number[] {
    let r = this.r.int(this.bag.length);
    let ret = this.bag[r];
    this.bag[r] = this.mem[this.nextMemId];
    this.mem[this.nextMemId] = ret;
    this.nextMemId = (this.nextMemId + 1) % this.mem.length;
    return ret;
  }

  reset() {
    this.mem = [];
  }
}

export class BagPieceGen implements PieceGen {
  private bag: number[][] = []; // [pos][size,pieceId]

  constructor(
    private r: RandomGen,
    private pieceList: PieceList[]
  ) { }

  serialize() {
    return {
      type: PieceGenType.BAG,
      bag: JSON.stringify(this.bag),
    };
  }

  load(state: any) {
    this.bag = JSON.parse(state.bag);
  }

  next(): Piece {
    let [size, id] = this.nextId();
    return new Piece(size, id);
  }

  nextId(): number[] {
    if (this.bag.length == 0) {
      // refill bag
      for (let e of this.pieceList) {
        for (let m = 0; m < (e.multiplier ?? 1); m++) {
          if (e.pieceId == null) {
            for (let i = 0; i < pieceDataArray[e.size - 1].length; i++) {
              this.bag.push([e.size, i]);
            }
          } else {
            this.bag.push([e.size, e.pieceId]);
          }
        }
      }
      shuffle(this.bag, this.r);
    }

    return this.bag.pop()!;
  }

  reset() {
    this.bag = [];
  }
}
