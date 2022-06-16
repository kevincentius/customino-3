import { Game } from "@shared/game/engine/game/game";
import { Player } from "@shared/game/engine/player/player";
import { GameState } from "@shared/game/engine/serialization/game-state";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { Attack, AttackDistribution } from "@shared/game/network/model/event/server-event";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";
import { ClientInfo } from "@shared/model/session/client-info";
import { ServerPlayer } from "game/server-player";

export class ServerGame extends Game {
  players!: ServerPlayer[];
  r: RandomGen = new RandomGen();

  constructor(startGameData: StartGameData, public clientInfos: ClientInfo[]) {
    super();
    
    this.init(startGameData);
  }
  
  createPlayers(startGameData: StartGameData): Player[] {
    return startGameData.players.map((p, index) => new ServerPlayer(this, p, index));
  }

  destroy() {
    // nothing to clean up yet
  }

  serialize(): GameState {
    return {
      startGameData: this.startGameData,
      players: this.players.map(p => p.serialize()),
      running: this.running,
    };
  }

  distributeAttacks(player: ServerPlayer, attacks: Attack[]): AttackDistribution[] {
    const map = new Map<number, Attack[]>();
    const attackerIndex = this.players.indexOf(player);
    for (let attack of attacks) {
      const receiverIndex = this.chooseAttackTarget(attackerIndex);
      if (receiverIndex != null) {
        let arr = map.get(receiverIndex);
        if (!arr) {
          arr = [];
          map.set(receiverIndex, arr);
        }
        arr.push(attack);
      }
    }

    return Array.from(map.entries()).map(([key, value]) => ({ playerIndex: key, attacks: value }));
  }

  private chooseAttackTarget(attackerIndex: number): number | null {
    const aliveOpponents = Array(this.players.length)
      .fill(0)
      .map((_, index) => index)
      .filter(index => index != attackerIndex && this.players[index].alive);
    
    if (aliveOpponents.length > 0) {
      return this.r.pick(aliveOpponents);
    } else {
      return attackerIndex;
    }
  }
}
