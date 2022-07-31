import { Game } from "@shared/game/engine/game/game";
import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { PlayerDisplay } from "app/pixi/display/player-display";
import { GameLayouter } from "app/pixi/layout/player-layouter";
import { Container } from "pixi.js";

export class GameDisplay extends Container {

  private players: PlayerDisplay[] = [];

  private layouter = new GameLayouter();

  constructor(
    private game: Game,
  ) {
    super();
    
    this.game = game;

    this.removeChildren();
    
    this.game.players.forEach((player, index) => {
      const playerDisplay = new PlayerDisplay(player);
      this.players.push(playerDisplay);
      this.addChild(playerDisplay);
      playerDisplay.updateLayout();
    });
  }

  resize(width: number, height: number) {
    const maxPlayerWidth = this.players.reduceRight((p, c) => Math.max(p, c.layoutWidth), 0);
    const maxPlayerHeight = this.players.reduceRight((p, c) => Math.max(p, c.layoutHeight), 0);
    const aspectRatio = maxPlayerWidth / maxPlayerHeight;
    const mainIndex = this.game.players.findIndex(p => p instanceof LocalPlayer);
    const poses = this.layouter.getTargetPoses({
      width: width,
      height: height,
      main: mainIndex != -1 ? mainIndex : 0,
      playerAspectRatio: aspectRatio,
      teams: this.players.map(p => -1),
    });

    this.players.forEach((player, index) => {
      const pos = poses[index];
      const tScale = Math.min(pos.w / player.layoutWidth, pos.h / player.layoutHeight);
      player.scale.set(tScale);
      player.position.set(
        pos.x + (pos.w - tScale * player.layoutWidth) / 2,
        pos.y + (pos.h - tScale * player.layoutHeight) / 2,
      );
    });
  }
  
  tick(dt: number) {
    this.players.forEach(player => player.tick(dt));
  }
}
