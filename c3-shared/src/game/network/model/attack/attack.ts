import { AttackType } from "@shared/game/network/model/attack/attack-type";


export interface Attack {
  type: AttackType;
  power: number;
}
