import { DisplayObject } from "pixi.js";

export interface Effect extends DisplayObject {
  /** Returns true except if the effect wants to be deleted. */
  tick(dt: number): boolean;
}

export interface InvisibleEffect {
  /** Returns true except if the effect wants to be deleted. */
  tick(dt: number): boolean;
}
