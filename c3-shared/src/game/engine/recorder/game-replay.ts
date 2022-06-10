import { PlayerReplay } from "@shared/game/engine/recorder/player-replay";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";

export interface GameReplay {
  playerReplays: PlayerReplay[];
  startGameData: StartGameData;
}
