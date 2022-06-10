import { Game } from "@shared/game/engine/game/game";
import { PlayerDisplay } from "app/pixi/display/player-display";
import { Container } from "pixi.js";

export class GameDisplay extends Container {

  private players: PlayerDisplay[] = [];

  constructor(
    private game: Game,
  ) {
    super();
    
    this.game = game;

    this.removeChildren();

    this.game.players.forEach((player, index) => {
      const playerDisplay = new PlayerDisplay(player);
      playerDisplay.position.x = index * 300;
      this.players.push(playerDisplay);
      this.addChild(playerDisplay);
    });
  }
  
  tick(dt: number) {
    this.players.forEach(player => player.tick(dt));
  }
}
