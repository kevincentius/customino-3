import { PlayerState } from "@shared/game/engine/serialization/player-state";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";

export interface GameState {
  startGameData: StartGameData;
  players: PlayerState[];
  running: boolean;
  clockTimeMs: number;
}
