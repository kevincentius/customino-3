import { Game } from "@shared/game/engine/game/game";
import { Player } from "@shared/game/engine/player/player";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { ServerPlayer } from "game/server-player";
import { Session } from "service/session/session";

export class ServerGame extends Game {
  players!: ServerPlayer[];

  constructor(startGameData: StartGameData, private sessions: Session[]) {
    super();
    
    this.init(startGameData);
  }
  
  createPlayers(_startGameData: StartGameData): Player[] {
    return this.sessions.map(
      session => new ServerPlayer(this, session)
    );
  }

  destroy() {
    // nothing to clean up yet
  }
}
