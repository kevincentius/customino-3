import { Player } from "@shared/game/engine/player/player";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugString = '----------------------------------------------------------------------------------------------------';
  private debugPos = 0;
  
  private debugText: BitmapText = textUtil.create(this.debugString);

  constructor(
    private player: Player,
  ) {
    super();

    player.debugSubject.subscribe(char => {
      this.debugString = this.debugString.substring(0, this.debugPos) + char + this.debugString.substring(this.debugPos + 1);
      this.debugPos = (this.debugPos + 1) % this.debugString.length;
      this.debugText.text = this.debugString;
    });

    player.gameOverSubject.subscribe(() => {
      this.debugText.text = this.debugString + ' - Game Over';
    })

    this.addChild(this.debugText);
  }

  tick(dt: number) {

  }
}
