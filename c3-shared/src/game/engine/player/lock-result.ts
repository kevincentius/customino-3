import { Attack } from "@shared/game/network/model/event/server-event";

export interface LockResult {
  clearedLines: number[];
  clearedGarbageLines: number[];
  
  attacks: Attack[];
}
