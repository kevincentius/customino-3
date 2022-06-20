import { GameEvent } from "@shared/game/network/model/event/game-event";
import { AttackDistribution } from "@shared/game/network/model/attack/attack-distribution";

export interface AttackAckEvent extends GameEvent {
  attackDistribution: AttackDistribution;
}
