import { Container } from "pixi.js";

export class Shaker {

  halvePeriod = 0.05; // seconds
  halveTrajectory = 0.025; // seconds

  shakeStart = Date.now();
  startPosX = 0;
  startPosY = 0;
  shakePosX = 0;
  shakePosY = 0;

  constructor(
    private container: Container,
  ) {

  }

  shake(posX: number, posY: number) {
    this.startPosX = this.container.position.x;
    this.startPosY = this.container.position.y;
    this.shakePosX  = posX;
    this.shakePosY  = posY;
    this.shakeStart = Date.now();
  }

  tick() {
    const t = Date.now() - this.shakeStart;
    const p = Math.pow(0.5, t / this.halvePeriod / 1000);
    const pTr = Math.pow(0.5, t / this.halveTrajectory / 1000);

    this.container.position.set(pTr * this.startPosX + (1 - pTr) * p * this.shakePosX, pTr * this.startPosY + (1 - pTr) * p * this.shakePosY);
  }
}
