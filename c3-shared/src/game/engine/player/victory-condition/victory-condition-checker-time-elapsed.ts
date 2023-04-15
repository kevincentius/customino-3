import { Player } from "@shared/game/engine/player/player";
import { VictoryConditionChecker } from "@shared/game/engine/player/victory-condition/victory-condition-checker";
import { VictoryConditionKey } from "@shared/game/engine/player/victory-condition/victory-condition-key";
import { Subject } from "rxjs";

export class VictoryConditionCheckerTimeElapsed implements VictoryConditionChecker {
  key = VictoryConditionKey.TIME_ELAPSED;
  completeSubject = new Subject<void>();

  constructor(
    private player: Player,
  ) {
    this.player.statsTracker.afterPieceLockSubject.subscribe(() => {
      if (this.player.statsTracker.stats.activeTime >= this.player.playerRule.victoryCondition.timeElapsed) {
        this.completeSubject.next();
      }
    })
  }

  serialize() {
    return null;
  }

  load() {}
}
