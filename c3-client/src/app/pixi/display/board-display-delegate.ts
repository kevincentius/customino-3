import { Effect } from "app/pixi/display/effects/effect";

export interface BoardDisplayDelegate {
  calcMinoPosForEffect(row: number, col: number): { x: number, y: number };
  calcMinoPos(row: number, col: number): { x: number, y: number };
  addEffect(effect: Effect): void; // registers an effect so it gets ticked
  addEffectToBoard(effect: Effect): void; // also adds the effect to the board display
  getInnerWidth(): number;
  getInnerHeight(): number;
}
