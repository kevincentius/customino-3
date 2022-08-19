import { PlayerRule } from "@shared/game/engine/model/rule/player-rule";
import { Tile } from "@shared/game/engine/model/tile";
import { MinoDisplay } from "app/pixi/display/mino-display";
import { GameSpritesheet } from "app/pixi/spritesheet/spritesheet";

export class MinoAnimator {
  speed = 0;
  delay = 0;
  pos = 0;
  absPos = 0;

  minoDisplay?: MinoDisplay;

  constructor(
    private spritesheet: GameSpritesheet,
    private minoSize: number,
    private playerRule: PlayerRule,
  ) {}

  setTile(tile: Tile) {
    if (this.minoDisplay) {
      this.minoDisplay.destroy();
    }

    if (tile) {
      this.minoDisplay = new MinoDisplay(this.spritesheet, tile, this.minoSize);
    }
  }

  tick(dt: number, zeroPos: number) {
    if (this.delay > 0) {
      this.delay -= dt;
    } else {
      this.pos = Math.min(0, this.pos + this.speed);
      if (this.pos != 0) {
        this.speed += this.playerRule.lineClearEffect.fallAcceleration * this.minoSize * dt / 1000;
      }
    }

    this.absPos = zeroPos + this.pos;
    if (this.minoDisplay) {
      this.minoDisplay.position.y = this.absPos;
    }
  }

  destroy() {
    if (this.minoDisplay) {
      this.minoDisplay.destroy();
    }
  }
}

