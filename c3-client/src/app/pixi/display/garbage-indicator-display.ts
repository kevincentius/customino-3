
import { QueuedAttack } from "@shared/game/engine/model/queued-attack";
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

  boxes: GarbageIndicatorBoxDisplay[] = [];
  nextVariant = 1;

  constructor(
    private player: Player,
    public layoutWidth: number,
    public layoutHeight: number,
    private minoSize: number,
  ) {
    super();

    const gg = this.player.garbageGen;
    gg.attackReceivedSubject.subscribe(queuedAttacks => this.addBoxes(queuedAttacks));
    gg.queuedAttackUpdateSubject.subscribe(index => this.updateBox(index));
    gg.fullSpawnSubject.subscribe(() => this.popBox());
  }

  private addBoxes(queuedAttacks: QueuedAttack[]) {
    const newBoxes = queuedAttacks.map(atk => {
      const box = new GarbageIndicatorBoxDisplay(this.spritesheet, this.nextVariant, atk.powerLeft, this.layoutWidth, this.minoSize);
      this.nextVariant = 3 - this.nextVariant;
      return box;
    });
    this.boxes.push(...newBoxes);
    this.addChild(...newBoxes);
    this.updateBoxPositions();
  }

  private updateBox(index: number) {
    this.boxes[index].setPower(this.player.garbageGen.attackQueue[index].powerLeft);
    this.updateBoxPositions();
  }

  private popBox() {
    this.removeChild(this.boxes[0]);
    this.boxes.shift();
    this.updateBoxPositions();
  }

  private updateBoxPositions() {
    let ty = this.layoutHeight;
    for (let box of this.boxes) {
      ty -= box.power * this.minoSize;
      box.position.y = ty;
    }
  }
}
