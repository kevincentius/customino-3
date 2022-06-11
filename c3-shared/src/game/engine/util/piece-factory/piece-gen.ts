import { Piece } from "@shared/game/engine/player/piece";
import { pieceDataArray } from "@shared/game/engine/util/piece-factory/piece-data";
import { RandomGen } from "@shared/game/engine/util/random-gen";


export interface PieceList {
  size: number;
  pieceId?: number; // if not given, then spawn all pieces
  multiplier?: number; // if decimal, some pieces will be missing
}

export interface PieceGen {
  next(): Piece;
  nextId(): number[]; // like next() but returns only the piece size + id
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
      console.log('INVALID MEM SIZE piece gen');
      memSize = this.bag.length - 1;
    }
    this.mem = this.bag.splice(this.bag.length - memSize);
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
      this.shuffle(this.bag);
    }

    return this.bag.pop()!;
  }

  reset() {
    this.bag = [];
  }


  shuffle(array: any[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = this.r.int(currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
