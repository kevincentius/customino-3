import { GameEvent } from "@shared/game/network/model/event/game-event";
import { GarbageDistribution } from "@shared/game/network/model/event/server-event";

export interface GarbageAcknowledgement extends GameEvent {
  garbageDistribution: GarbageDistribution;
}
