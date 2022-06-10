import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container, Loader, Sprite, Spritesheet } from "pixi.js";

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

    
    let spritesheet = Loader.shared.resources['gameSpritesheet'].spritesheet!;
    const debugMino = new Sprite(spritesheet.textures["0.png"]);
    this.addChild(debugMino);
  }

  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')}) - ${this.debugString}`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick(dt: number) {

  }
}
