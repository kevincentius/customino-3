import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";

export interface StartGameData {
  players: StartPlayerData[];
  randomSeed: number;
}
