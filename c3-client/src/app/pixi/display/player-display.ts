import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugText: BitmapText = textUtil.create('');

  private board: BoardDisplay;

  constructor(
    private player: Player,
  ) {
    super();

    this.board = new BoardDisplay(player);

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    this.addChild(this.board);
    
    this.addChild(this.debugText);
  }

  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')})`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick(dt: number) {
    this.updateDebugText();
  }
}
