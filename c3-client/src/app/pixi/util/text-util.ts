import { BitmapFont, BitmapText } from "pixi.js";

class TextUtil {
  private bitmapFont = BitmapFont.from("default", {
    fontFamily: "Arial",
    fontSize: 24,
    strokeThickness: 2,
    fill: "white",
  }, {
    chars: [['a', 'z'], ['A', 'Z'], ['0', '9'], "!@#$%^&*()~{}[] .,:;'\"`"]
  });

  create(text: string, fontSize=24, fontName="default") {
    return new BitmapText(text, { fontName: fontName, fontSize: fontSize });
  }
}

export const textUtil = new TextUtil();
