import { DisplayObject } from "pixi.js";

export interface LayoutChild extends DisplayObject {
  layoutWidth: number;
  layoutHeight: number;
  updateLayout?(): void;
}
