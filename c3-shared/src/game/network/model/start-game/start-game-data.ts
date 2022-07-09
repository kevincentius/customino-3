import { GameRule } from "@shared/game/engine/model/rule/game-rule";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";

export interface StartGameData {
  gameRule: GameRule;
  players: StartPlayerData[];
  randomSeed: number;
}
