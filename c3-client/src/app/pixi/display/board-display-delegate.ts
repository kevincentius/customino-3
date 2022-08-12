import { Effect } from "app/pixi/display/effects/effect";

export interface BoardDisplayDelegate {
  
  calcMinoPosForEffect(row: number, col: number): { x: number, y: number };
  addEffect(effect: Effect): void;
  getInnerWidth(): number;
  getInnerHeight(): number;
}
