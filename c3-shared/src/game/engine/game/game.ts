import { LocalPlayer } from "@shared/game/engine/player/local-player";
import { Player } from "@shared/game/engine/player/player";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
export class Game {
  // composition
  players: Player[];

  // state
  private localPlayerIndex: number | null;
  running = false;

  // event emitters
  

  constructor(
    startGameData: StartGameData,
  ) {
    this.localPlayerIndex = startGameData.localPlayerIndex;

    this.players = startGameData.players.map(
      (clientInfo, index) => index == startGameData.localPlayerIndex
        ? new LocalPlayer(clientInfo)
        : new RemotePlayer(clientInfo));
  }
  
  update() {
    this.players.forEach(p => p.update());
  }

  start() {
    this.running = true;
  }
}
