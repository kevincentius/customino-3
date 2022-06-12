import * as seedrandom from "seedrandom";

export class RandomGen {
  r: seedrandom.PRNG;

  constructor(seed?: number, state?: object) {
    this.r = state ? seedrandom.alea(undefined, { state: state })
           : seedrandom.alea(seed == null ? Math.random().toString() : seed.toString(), { state: true });
  }

  int(max: number = Number.MAX_SAFE_INTEGER) {
    return Math.abs(this.r.int32()) % max;
  }

  chance(chance: number) {
    return this.r.double() < chance;
  }

  range(min: number, max: number) {
    return this.r.double() * (max - min) + min;
  }

  pick<T>(arr: T[]): T {
    return arr.length == 0 ? null! : arr[this.int(arr.length)];
  }

  serialize() {
    return this.r.state();
  }
}
