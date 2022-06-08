import { Game } from "@shared/game/engine/game/game";
import { Player } from "@shared/game/engine/player/player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { ClientInfo } from "@shared/model/session/client-info";
import { ServerPlayer } from "game/server-player";

export class ServerGame extends Game {
  players!: ServerPlayer[];

  constructor(startGameData: StartGameData, private clientInfos: ClientInfo[]) {
    super();
    
    this.init(startGameData);
  }
  
  createPlayers(_startGameData: StartGameData): Player[] {
    return this.clientInfos.map(
      clientInfo => new ServerPlayer(this, clientInfo)
    );
  }

  destroy() {
    // nothing to clean up yet
  }
}
