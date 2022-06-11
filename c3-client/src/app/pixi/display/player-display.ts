import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container, Loader, Sprite, Spritesheet } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugString = '';
  
  private debugText: BitmapText = textUtil.create(this.debugString);

  private board: BoardDisplay;

  constructor(
    private player: Player,
  ) {
    super();

    this.board = new BoardDisplay(player.board, player.activePiece);

    this.player.debugSubject.subscribe(char => {
      if (char != null) {
        this.debugString += this.player.frame + ':' + char + '   ';
      }

      this.updateDebugText();
    });

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    this.addChild(this.board);
    
    this.addChild(this.debugText);
  }

  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')}) - ${this.debugString}`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick(dt: number) {

  }
}
