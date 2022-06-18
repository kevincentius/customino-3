import { ComboTimer } from "@shared/game/engine/player/combo-timer";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { ComboTimerDisplay } from "app/pixi/display/combo-timer-display";
import { LayoutContainer } from "app/pixi/display/layout/layout-container";
import { PieceQueueDisplay } from "app/pixi/display/piece-queue-display";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugText: BitmapText = textUtil.create('');

  private board: BoardDisplay;
  private pieceQueue: PieceQueueDisplay;
  private comboTimer?: ComboTimerDisplay;

  private layout = new LayoutContainer(1);
  private rowLayout = new LayoutContainer();
  private rightColumnLayout = new LayoutContainer(1, 200, undefined, 40);

  constructor(
    private player: Player,
  ) {
    super();

    this.board = new BoardDisplay(this.player);
    this.pieceQueue = new PieceQueueDisplay(this.player, this.board.getMinoSize());

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    // TODO: this.layout.addNode(player info);
    this.layout.addNode(this.rowLayout);
    
    this.rowLayout.addNode(this.board);
    this.rowLayout.addNode(this.rightColumnLayout);
    this.rowLayout.updateLayout();

    this.rightColumnLayout.addNode(this.pieceQueue);
    if (this.player.playerRule.useComboTimer) {
      this.comboTimer = new ComboTimerDisplay(this.player, this.player.attackRule.comboTimer, 100);
      this.rightColumnLayout.addNode(this.comboTimer);
    }
    this.rightColumnLayout.updateLayout();

    this.addChild(this.layout);

    this.addChild(this.debugText);
  }

  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')})`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick() {
    this.updateDebugText();
    this.board.tick();
    this.comboTimer?.tick();
  }
}
