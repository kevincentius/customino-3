
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
    gg.queuedAttackUpdateSubject.subscribe(index => this.updateBox(index));
    gg.fullSpawnSubject.subscribe(() => this.popBox());
  }

  private addBoxes(queuedAttacks: QueuedAttack[]) {
    const newBoxes = queuedAttacks.map(atk => {
      return new GarbageIndicatorBoxDisplay(this.spritesheet, this.nextVariant, this.player, atk, this.layoutWidth, this.minoSize);
    });
    this.boxes.push(...newBoxes);
    this.boxContainer.addChild(...newBoxes);
    this.updateBoxPositions();
  }

  private updateBox(index: number) {
    // this.boxes[index].setPower(this.player.garbageGen.attackQueue[index].powerLeft);
    this.updateBoxPositions();
  }

  private popBox() {
    this.boxContainer.removeChild(this.boxes[0]);
    this.boxes.shift();
    this.updateBoxPositions();
  }

  private updateBoxPositions() {
    let ty = this.layoutHeight;
    for (let box of this.boxes) {
      ty -= box.attack.powerLeft * this.minoSize;
      box.position.y = ty;
    }
  }

  tick(garbageRateShift: number) {
    this.boxContainer.position.y = -garbageRateShift;
    this.boxes.forEach(box => box.tick());
  }
}
