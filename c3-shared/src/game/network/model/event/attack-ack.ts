import { GameEvent } from "@shared/game/network/model/event/game-event";
import { AttackDistribution } from "@shared/game/network/model/event/server-event";

export interface AttackAckEvent extends GameEvent {
  attackDistribution: AttackDistribution;
}
