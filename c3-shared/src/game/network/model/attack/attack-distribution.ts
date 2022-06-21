import { Attack } from "@shared/game/network/model/attack/attack";


export interface AttackDistribution {
  playerIndex: number;
  attacks: Attack[];
}
