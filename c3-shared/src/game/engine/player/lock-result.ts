import { Attack } from "@shared/game/network/model/attack/attack";

export interface LockPlacementResult {
  clearedLines: number[];
  clearedGarbageLines: number[];
  dropDistance: number;
}

export interface LockResult extends LockPlacementResult {
  attacks: Attack[];
}
