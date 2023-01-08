import { Player } from "@shared/game/engine/player/player";
import { VictoryConditionChecker } from "@shared/game/engine/player/victory-condition/victory-condition-checker";
import { VictoryConditionKey } from "@shared/game/engine/player/victory-condition/victory-condition-key";
import { Subject } from "rxjs";

export class VictoryConditionCheckerLinesCleared implements VictoryConditionChecker {
  key = VictoryConditionKey.LINES_CLEARED;
  completeSubject = new Subject<void>();

  constructor(
    private player: Player,
  ) {
    console.log('constructor');
    this.player.statsTracker.afterPieceLockSubject.subscribe(() => {
      console.log('lock');
      if (this.player.statsTracker.stats.linesCleared >= this.player.playerRule.victoryCondition.linesCleared) {
        console.log('complete');
        this.completeSubject.next();
      }
    })
  }

  serialize() {
    return null;
  }

  load() {}
}
