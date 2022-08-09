import { PlayerInfo } from "@shared/game/engine/player/player-info";
import { LayoutChild } from "app/pixi/display/layout/layout-child";
import { textUtil } from "app/pixi/util/text-util";
import { BitmapText, Container } from "pixi.js";

export class PlayerInfoDisplay extends Container implements LayoutChild {
  layoutWidth = 720;
  layoutHeight = 50;

  playerName: BitmapText;

  constructor(
    private playerInfo: PlayerInfo,
  ) {
    super();

    this.cacheAsBitmap = true;

    this.playerName = textUtil.create(this.playerInfo.name);
    this.addChild(this.playerName);
    this.playerName.anchor.set(0, 0.5);
    this.playerName.position.x = 50;
    this.playerName.position.y = this.layoutHeight / 2;
  }
}
