import { Game } from "@shared/game/engine/game/game";
import { GameReplay } from "@shared/game/engine/recorder/game-replay";
import { PlayerRecorder } from "@shared/game/engine/recorder/player-recorder";

export class GameRecorder {
  players: PlayerRecorder[] = [];

  constructor(
    private game: Game
  ) {
    this.game.players.forEach(player => {
      this.players.push(new PlayerRecorder(player));
    });
  }

  destroy() {
    this.players.forEach(player => player.destroy());
  }

  asReplay(): GameReplay {
    return {
      playerReplays: this.players.map(player => player.asReplay()),
      startGameData: this.game.startGameData,
    }
  }
}
