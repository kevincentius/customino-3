import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugString = '';
  
  private debugText: BitmapText = textUtil.create(this.debugString);

  constructor(
    private player: Player,
  ) {
    super();

    this.player.debugSubject.subscribe(char => {
      if (char != null) {
        this.debugString += this.player.frame + ':' + char + '   ';
      }

      this.updateDebugText();
    });

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    this.addChild(this.debugText);
  }

  private updateDebugText() {
    this.debugText.text = this.player.frame + ' / ' + (this.player as RemotePlayer).lastReceivedFrame + ' / ' + this.player.alive + ' - ' + this.debugString + (this.player.alive ? '' : ' Game Over');
  }

  tick(dt: number) {

  }
}
