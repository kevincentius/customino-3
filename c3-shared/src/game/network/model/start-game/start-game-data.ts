import { RoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";

export interface StartGameData {
  roomRule: RoomRule;
  players: StartPlayerData[];
  randomSeed: number;
}
