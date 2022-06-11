import { BitmapFont, BitmapText } from "pixi.js";

class TextUtil {
  private bitmapFont24 = BitmapFont.from("default24", {
    fontFamily: "Arial",
    fontSize: 48,
    strokeThickness: 2,
    fill: "white",
  }, {
    chars: [['a', 'z'], ['A', 'Z'], ['0', '9'], "!@#$%^&*()_-+=~{}[] .,:;'\"`"]
  });

  private bitmapFont48 = BitmapFont.from("default48", {
    fontFamily: "Arial",
    fontSize: 48,
    strokeThickness: 2,
    fill: "white",
  }, {
    chars: [['a', 'z'], ['A', 'Z'], ['0', '9'], "!@#$%^&*()_-+=~{}[] .,:;'\"`"]
  });

  create(text: string) {
    return new BitmapText(text, { fontName: 'default24', fontSize: 24 });
  }

  create48(text: string) {
    return new BitmapText(text, { fontName: 'default48', fontSize: 48 });
  }
}

export const textUtil = new TextUtil();
