import { Player } from "@shared/game/engine/player/player";
import { BoardDisplay } from "app/pixi/display/board-display";
import { ComboTimerDisplay } from "app/pixi/display/widgets/combo-timer/combo-timer-display";
import { LayoutContainer } from "app/pixi/display/layout/layout-container";
import { PlayerInfoDisplay } from "app/pixi/display/player-into-display";
import { PlayerSound } from "app/pixi/display/sound/player-sound";
import { PieceQueueDisplay } from "app/pixi/display/widgets/piece-queue/piece-queue-display";
import { SpeedMeterDisplay } from "app/pixi/display/widgets/speed-meter-display";
import { LayoutAlignment } from "app/pixi/display/layout/layout-alignment";
import { StarsMeterDisplay } from "app/pixi/display/widgets/stars-meter.ts/stars-meter-display";

export class PlayerDisplay extends LayoutContainer {
  private playerInfoDisplay: PlayerInfoDisplay;
  private board: BoardDisplay;
  private pieceQueue: PieceQueueDisplay;
  private comboTimer?: ComboTimerDisplay;
  private starsMeter?: StarsMeterDisplay;
  private speedMeter?: SpeedMeterDisplay;
  
  private playerSound: PlayerSound;

  private rowLayout = new LayoutContainer();
  private rightColumnLayout = new LayoutContainer(1, 200, undefined, 40, LayoutAlignment.MIDDLE);


  constructor(
    private player: Player,
    private clockStartMs: number,
  ) {
    super(1);

    this.playerInfoDisplay = new PlayerInfoDisplay(this.player.playerInfo);
    this.board = new BoardDisplay(this.player, this.clockStartMs);
    this.pieceQueue = new PieceQueueDisplay(this.player, this.board.getMinoSize());
    this.playerSound = new PlayerSound(this.player, this);

    this.addNode(this.playerInfoDisplay);
    this.addNode(this.rowLayout);
    
    this.rowLayout.addNode(this.board);
    this.rowLayout.addNode(this.rightColumnLayout);

    this.rightColumnLayout.addNode(this.pieceQueue);
    if (this.player.playerRule.useComboTimer) {
      this.comboTimer = new ComboTimerDisplay(this.player, this.player.attackRule.comboTimer!, 160);
      this.rightColumnLayout.addNode(this.comboTimer);
    }

    if (this.player.playerRule.stars.useStars) {
      this.starsMeter = new StarsMeterDisplay(this.player, 150);
      this.rightColumnLayout.addNode(this.starsMeter);
    }

    this.speedMeter = new SpeedMeterDisplay(this.player, 130);
    this.rightColumnLayout.addNode(this.speedMeter);
  }
  
  tick(dt: number) {
    this.board.tick(dt);
    this.comboTimer?.tick(dt);
    this.starsMeter?.tick(dt);
    this.speedMeter?.tick();
  }

  getCountdownSubject() {
    return this.board.countdownDisplay.countdownSubject;
  }
}
