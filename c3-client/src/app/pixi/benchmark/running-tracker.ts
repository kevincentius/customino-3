
export class RunningTracker {
  arr: number[];
  currentMax = 0;
  max = 0;
  avg = 0;
  index = 0;
  
  constructor(
    private arrSize: number,
  ) {
    this.arr = new Array(arrSize).fill(0);
  }

  next(ms: number) {
    this.avg += (ms - this.arr[this.index]) / this.arrSize;
    this.currentMax = Math.max(ms, this.currentMax);
    this.arr[this.index] = ms;

    this.index++;
    if (this.index >= this.arrSize) {
      this.index = 0;
      this.max = this.currentMax;
      this.currentMax = 0;
    }
  }
}
