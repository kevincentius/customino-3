import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { LayoutContainer } from "app/pixi/display/layout/layout-container";
import { PieceQueueDisplay } from "app/pixi/display/piece-queue-display";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerDisplay extends Container {

  private debugText: BitmapText = textUtil.create('');

  private board: BoardDisplay;
  private pieceQueue: PieceQueueDisplay;

  private layout = new LayoutContainer(1);
  private rowLayout = new LayoutContainer();
  private rightColumnLayout = new LayoutContainer(1);

  constructor(
    private player: Player,
  ) {
    super();

    this.board = new BoardDisplay(this.player);
    this.pieceQueue = new PieceQueueDisplay(this.player, this.board.getMinoSize());
    this.pieceQueue.position.x = 600;

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    // TODO: this.layout.addNode(player info);
    this.layout.addNode(this.rowLayout);
    
    this.rowLayout.addNode(this.board);
    this.rowLayout.addNode(this.rightColumnLayout);

    this.rightColumnLayout.addNode(this.pieceQueue);

    // this.addChild(this.board);
    // this.addChild(this.pieceQueue);
    
    this.addChild(this.debugText);

    this.addChild(this.layout);
  }

  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')})`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick(dt: number) {
    this.updateDebugText();
  }
}
