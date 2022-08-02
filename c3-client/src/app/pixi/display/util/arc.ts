import { Graphics } from "pixi.js";

// start and end is from 0 to 1, starting from the top, clockwise
export function drawArc(graphics: Graphics, x: number, y: number, radius: number, start: number, end: number, color: number) {
  graphics
    .beginFill(color)
    .arc(x, y, radius, Math.PI * (-0.5 + start * 2), Math.PI * (-0.5 + end * 2))
    .lineTo(x, y)
    .closePath();
}

// start and end is from 0 to 1, starting from the top, clockwise
export function drawTopArcStrip(
  graphics: Graphics,
  radiusNear: number,
  radiusFar: number,
  skipDeg: number,
  progress: number,
  color: number) {
  const radStart = (90 + skipDeg) * Math.PI / 180;
  const radEnd = radStart + ((360 - skipDeg * 2) * Math.min(progress)) * Math.PI / 180;

  const coordEndNear = fromPolar(radEnd, radiusNear);

  graphics
    .clear()
    .beginFill(color)
    .arc(0, 0, radiusFar, radStart, radEnd)
    .lineTo(coordEndNear.x, coordEndNear.y)
    .arc(0, 0, radiusNear, radEnd, radStart, true)
    .closePath()
}

function fromPolar(radians: number, radius: number) {
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}
