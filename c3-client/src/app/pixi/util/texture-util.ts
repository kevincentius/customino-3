import { Texture } from "pixi.js";

export interface GradientStop {
  offset: number; // 0 to 1
  color: string; // e. g. '#fff'
}

export class TextureUtil {
  lineWaveGradient = this.gradient([
    { offset: 0, color: '#ffff', },
    { offset: 1, color: '#fff0', },
  ]);

  private gradient(colorStops: GradientStop[]) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d')!;
    const grd = ctx.createLinearGradient(0,0,0,1024);
    for (const colorStop of colorStops) {
      grd.addColorStop(colorStop.offset, colorStop.color);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,1024,1024);
    return Texture.from(c);
  }  
}

export const textureUtil = new TextureUtil();
