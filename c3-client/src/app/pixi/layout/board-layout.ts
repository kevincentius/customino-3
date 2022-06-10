import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";

export class BoardLayout {
  public minoSize: number;
  public offsetX: number;
  public offsetY: number;
  public minoScale: number;

  constructor(
    public width: number,
    public height: number,
    public rows: number,
    public cols: number,
  ) {
    const spritesheet = new GameSpritesheet();
    
    this.minoSize = Math.min(this.width / this.cols, this.height / this.rows);
    this.minoScale = this.minoSize / spritesheet.mino[0].width;
    this.offsetX = (this.width - this.minoSize * cols) / 2;
    this.offsetY = this.height;
  }
}
