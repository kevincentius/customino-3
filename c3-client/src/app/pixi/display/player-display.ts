import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { ComboTimerDisplay } from "app/pixi/display/widgets/combo-timer-display";
import { LayoutContainer } from "app/pixi/display/layout/layout-container";
import { PlayerInfoDisplay } from "app/pixi/display/player-into-display";
import { PlayerSound } from "app/pixi/display/sound/player-sound";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText } from "pixi.js";
import { PieceQueueDisplay } from "app/pixi/display/widgets/piece-queue/piece-queue-display";
import { SpeedMeterDisplay } from "app/pixi/display/widgets/speed-meter-display";

export class PlayerDisplay extends LayoutContainer {

  private debugText: BitmapText = textUtil.create('');

  private playerInfoDisplay: PlayerInfoDisplay;
  private board: BoardDisplay;
  private pieceQueue: PieceQueueDisplay;
  private comboTimer?: ComboTimerDisplay;
  private speedMeter?: SpeedMeterDisplay;
  
  private playerSound: PlayerSound;

  private rowLayout = new LayoutContainer();
  private rightColumnLayout = new LayoutContainer(1, 200, undefined, 40);

  constructor(
    private player: Player,
  ) {
    super(1);

    this.playerInfoDisplay = new PlayerInfoDisplay(this.player.playerInfo);
    this.board = new BoardDisplay(this.player);
    this.pieceQueue = new PieceQueueDisplay(this.player, this.board.getMinoSize());
    this.playerSound = new PlayerSound(this.player);

    this.player.gameOverSubject.subscribe(this.updateDebugText.bind(this));

    this.addNode(this.playerInfoDisplay);
    this.addNode(this.rowLayout);
    
    this.rowLayout.addNode(this.board);
    this.rowLayout.addNode(this.rightColumnLayout);

    this.rightColumnLayout.addNode(this.pieceQueue);
    if (this.player.playerRule.useComboTimer) {
      this.comboTimer = new ComboTimerDisplay(this.player, this.player.attackRule.comboTimer, 160);
      this.rightColumnLayout.addNode(this.comboTimer);
    }

    this.speedMeter = new SpeedMeterDisplay(this.player, 100);
    this.rightColumnLayout.addNode(this.speedMeter);

    // this.addChild(this.debugText);
  }
  
  private updateDebugText() {
    this.debugText.text = `${this.player.frame} / ${(this.player as RemotePlayer).lastReceivedFrame} (${(this.player.alive ? 'alive' : 'dead')})`;
    this.debugText.alpha = this.player.alive ? 1 : 0.5;
  }

  tick() {
    // this.updateDebugText();
    this.board.tick();
    this.comboTimer?.tick();
    this.speedMeter?.tick();
  }
}
