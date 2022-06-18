import { Attack } from "@shared/game/network/model/event/server-event";

export interface LockIntermediateResult {
  clearedLines: number[];
  clearedGarbageLines: number[];
}

export interface LockResult extends LockIntermediateResult {
  attacks: Attack[];
}
