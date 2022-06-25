
import { gameLoopRule } from "@shared/game/engine/game/game-loop-rule";
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
import { BlockEvent } from "@shared/game/engine/player/garbage-gen/block-event";
import { Player } from "@shared/game/engine/player/player";
import { GarbageIndicatorBoxDisplay } from "app/pixi/display/garbage-indicator-box-display";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";
import { Container } from "pixi.js";

export interface AttackDisplayData {
  delay: boolean;
}

export class GarbageIndicatorDisplay extends Container implements LayoutChild {
  spritesheet = new GameSpritesheet();

  boxContainer = new Container();
  boxes: GarbageIndicatorBoxDisplay[] = [];
  nextVariant = 1;

  constructor(
    private player: Player,
    public layoutWidth: number,
    public layoutHeight: number,
    private minoSize: number,
  ) {
    super();

    this.addChild(this.boxContainer);

    const gg = this.player.garbageGen;
    gg.attackReceivedSubject.subscribe(queuedAttacks => this.addBoxes(queuedAttacks));
    gg.fullSpawnSubject.subscribe(() => this.popBox());
    gg.blockSubject.subscribe(e => this.onBlock(e))
  }

  private addBoxes(queuedAttacks: QueuedAttack[]) {
    const newBoxes = queuedAttacks.map(atk => {
      return new GarbageIndicatorBoxDisplay(this.spritesheet, this.layoutWidth);
    });
    this.boxes.push(...newBoxes);
    this.boxContainer.addChild(...newBoxes);
  }

  private popBox() {
    this.boxContainer.removeChild(this.boxes[0]);
    this.boxes.shift();
  }

  private updateBoxes() {
    let now = Date.now();
    let ty = this.layoutHeight;
    for (let i = 0; i < this.boxes.length; i++) {
      const attack = this.player.garbageGen.attackQueue[i];
      const box = this.boxes[i];
      
      const secondsQueued = this.player.getSecondsSinceFrame(now, attack.frameQueued);
      const secondsDelayTotal = (attack.frameReady - attack.frameQueued) / gameLoopRule.fps;
      const p = Math.min(1, secondsQueued / secondsDelayTotal);

      const boxBgHeight = attack.powerLeft * this.minoSize;
      const boxFgHeight = p * boxBgHeight;
      
      ty -= boxBgHeight;

      box.position.y = ty;
      box.tick(boxBgHeight, boxFgHeight);
    }
  }

  private onBlock(e: BlockEvent) {
    for (let i = e.deleteList.length - 1; i >= 0; i--) {
      const deleteIndex = e.deleteList[i];
      this.boxContainer.removeChild(this.boxes[deleteIndex]);
      this.boxes.splice(deleteIndex, 1);
    }
  }

  tick(garbageRateShift: number) {
    this.boxContainer.position.y = -garbageRateShift;
    this.updateBoxes();
  }
}
