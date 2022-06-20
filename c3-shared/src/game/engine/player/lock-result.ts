import { Attack } from "@shared/game/network/model/attack/attack";

export interface LockIntermediateResult {
  clearedLines: number[];
  clearedGarbageLines: number[];
}

export interface LockResult extends LockIntermediateResult {
  attacks: Attack[];
}
