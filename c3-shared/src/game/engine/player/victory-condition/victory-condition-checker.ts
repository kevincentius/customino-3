import { VictoryConditionKey } from "@shared/game/engine/player/victory-condition/victory-condition-key";
import { Subject } from "rxjs";

export interface VictoryConditionChecker {
  completeSubject: Subject<void>;
  key: VictoryConditionKey;

  serialize(): any;
  load(state: any): void;
}
