import { ClientGame } from "@shared/game/engine/game/client-game";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { GameReplay } from "@shared/game/engine/recorder/game-replay";

export class GameReplayer {
  game: ClientGame;

  constructor(
    timeoutWrapper: any,
    private replay: GameReplay,
    localRule: LocalRule,
  ) {
    this.game = new ClientGame(timeoutWrapper, this.replay.startGameData, localRule);

    const frames = Math.max(...this.replay.playerReplays.map(p => p.gameEvents.length == 0 ? 0 : p.gameEvents[p.gameEvents.length - 1].frame));

    for (let i = 0; i < this.replay.playerReplays.length; i++) {
      this.replay.playerReplays[i].gameEvents.forEach(
        e => this.game.players[i].handleEvent(
          { frame: e.frame, gameEvents: [e] }
        )
      );

      this.game.players[i].handleEvent(
        { frame: frames + 1, gameEvents:[] }
      );
    }

    this.game.start();
    this.pause();
  }

  start() {
    this.game.resume();
  }

  pause() {
    this.game.stop();
  }
}
