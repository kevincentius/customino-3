import { Attack } from "@shared/game/network/model/attack/attack";

export interface LockPlacementResult {
  clearedLines: number[];
  clearedGarbageLines: number[];
  clearedDigLines: number[];
  dropDistance: number;
}

export interface LockResult extends LockPlacementResult {
  powers: Attack[];
  attacks: Attack[];
}
