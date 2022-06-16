import { Attack } from "@shared/game/network/model/event/server-event";

export interface QueuedAttack {
  attack: Attack;
  powerLeft: number;
}
