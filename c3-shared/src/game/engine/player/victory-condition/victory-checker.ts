import { Player } from "@shared/game/engine/player/player";
import { VictoryConditionChecker } from "@shared/game/engine/player/victory-condition/victory-condition-checker";
import { VictoryConditionCheckerDigLinesCleared } from "@shared/game/engine/player/victory-condition/victory-condition-checker-dig-lines-cleared";
import { VictoryConditionCheckerLinesCleared } from "@shared/game/engine/player/victory-condition/victory-condition-checker-lines-cleared";
import { VictoryConditionCheckerTimeElapsed } from "@shared/game/engine/player/victory-condition/victory-condition-checker-time-elapsed";
import { VictoryConditionKey } from "@shared/game/engine/player/victory-condition/victory-condition-key";

export class VictoryChecker {
  checkers = new Set<VictoryConditionChecker>();

  constructor(
    private player: Player
  ) {
    const conds = this.player.playerRule.victoryCondition;
    console.log('conds', conds);
    if (conds.linesCleared > 0) {
      this.checkers.add(new VictoryConditionCheckerLinesCleared(this.player));
    }
    if (conds.digLinesCleared > 0) {
      this.checkers.add(new VictoryConditionCheckerDigLinesCleared(this.player));
    }
    if (conds.timeElapsed > 0) {
      this.checkers.add(new VictoryConditionCheckerTimeElapsed(this.player));
    }

    this.checkers.forEach(checker => checker.completeSubject.subscribe(() => {
      this.checkers.delete(checker);
      if (this.checkers.size == 0) {
        this.player.winByPlayer();
      }
    }));
  }

  serialize() {
    return Array.from(this.checkers).map(checker => ({
      key: checker.key,
      state: checker.serialize(),
    }));
  }
  
  load(state: any) {
    this.checkers = new Set(state.map((entry: {key: VictoryConditionKey, state: any}) => {
      const checker: VictoryConditionChecker = (() => {
        switch (entry.key) {
          case VictoryConditionKey.LINES_CLEARED:
            return new VictoryConditionCheckerLinesCleared(this.player);

          case VictoryConditionKey.DIG_LINES_CLEARED:
            return new VictoryConditionCheckerDigLinesCleared(this.player);

          case VictoryConditionKey.TIME_ELAPSED:
            return new VictoryConditionCheckerTimeElapsed(this.player);

          default:
            throw new Error('Unknown victory checker with key ' + entry.key);
        }
      })();
      checker.load(entry.state);
      return checker;
    }));
  }
}
