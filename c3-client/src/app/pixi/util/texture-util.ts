import { Texture } from "pixi.js";

export interface GradientStop {
  offset: number; // 0 to 1
  color: string; // e. g. '#fff'
}

export class TextureUtil {
  gradient(colorStops: GradientStop[]) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    const grd = ctx.createLinearGradient(0,0,0,256);
    for (const colorStop of colorStops) {
      grd.addColorStop(colorStop.offset, colorStop.color);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,256,256);
    return Texture.from(c);
  }  
}

export const textureUtil = new TextureUtil();
