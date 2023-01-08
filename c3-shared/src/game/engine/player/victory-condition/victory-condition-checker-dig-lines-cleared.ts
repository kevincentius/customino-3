import { Player } from "@shared/game/engine/player/player";
import { VictoryConditionChecker } from "@shared/game/engine/player/victory-condition/victory-condition-checker";
import { VictoryConditionKey } from "@shared/game/engine/player/victory-condition/victory-condition-key";
import { Subject } from "rxjs";

export class VictoryConditionCheckerDigLinesCleared implements VictoryConditionChecker {  
  key = VictoryConditionKey.DIG_LINES_CLEARED;
  completeSubject = new Subject<void>();

  constructor(
    private player: Player,
  ) {
    this.player.statsTracker.afterPieceLockSubject.subscribe(() => {
      if (this.player.statsTracker.stats.digLinesCleared >= this.player.playerRule.victoryCondition.digLinesCleared) {
        this.completeSubject.next();
      }
    });
  }

  serialize() {
    return null;
  }

  load() {}
}
