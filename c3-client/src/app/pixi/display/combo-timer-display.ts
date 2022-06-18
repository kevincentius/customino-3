import { Container, Graphics, Text, TextStyle } from "pixi.js";

const colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff];

export class ComboTimerPixi {
  container = new Container();
  diameter: number;

  graphics = new Graphics();
  text = new Text('', new TextStyle({ align: 'center', fontSize: 144, fill: 0xffffff }));

  constructor(x: number, y: number, diameter: number, private playerEngine: PlayerEngine) {
    this.container.position.set(x, y);
    this.diameter = diameter;

    this.container.addChild(this.graphics);

    this.container.addChild(this.text);
    this.text.anchor.set(0.5, 0.5);
  }

  getPixi() {
    return this.container;
  }

  tick(dt: number, ct: number) {
    let s = this.playerEngine.getComboTimeLeft(ct);

    this.graphics.clear();

    if (s != null) {
      let sc = pixiUtil.scaleReso(this.container);

      let r = this.diameter * 0.5 * sc;
      this.text.position.set(r, r);
      this.text.text = this.playerEngine.sideData.combo.toString();
      this.text.scale.set(1 * sc / 6);

      let seconds = Math.floor(s);
      let subseconds = s - Math.floor(s);
      // this.playerEngine.sideData.combo;

      // render sub second
      this.graphics
        .beginFill(colors[seconds % colors.length])
        .arc(r, r, r, Math.PI * (-0.5), Math.PI * (-0.5 + subseconds * 2))
        .lineTo(r, r)
        .closePath();

      if (seconds > 0) {
        this.graphics
          .beginFill(colors[(seconds - 1) % colors.length])
          .arc(r, r, r, Math.PI * (-0.5 + subseconds * 2), Math.PI * (1.5))
          .lineTo(r, r)
          .closePath();
      }
    }
  }
}
