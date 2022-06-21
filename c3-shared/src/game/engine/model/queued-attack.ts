import { Attack } from "@shared/game/network/model/attack/attack";

export interface QueuedAttack {
  attack: Attack;
  powerLeft: number;
  frameQueued: number;
  frameReady: number;
}
