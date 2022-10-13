import { RatingEntity } from "shared-modules/rating/entity/rating.entity";

export class ScoreCalc {
  public readonly config = {
    inactivityMultiplier: {
      daysCap: 14,
      daysTolerated: 3,
      minMult: 0.65,
    }
  };

  calc(rating: RatingEntity, lastMatchTimestamps: number[], ct: number) {
    const newPlayerPenaltyMultiplier = this.calcNewPlayerPenaltyMultiplier(rating.matches);
  
    // Score scaling factor
    const scoreScale = 10000 / 3000;
  
    // final score
    return rating.rating * newPlayerPenaltyMultiplier * scoreScale;
  }  

  /**
   * Multiplier grows from 0 to 1 (circle equation) until the player plays enough matches
   */
  calcNewPlayerPenaltyMultiplier(matches: number) {
    return Math.sqrt(1 - Math.pow(1 - Math.min(1, matches / 100), 2));
  }

  /**
   * Multiplier goes from 1 to approaching X < 1 as time passes since the 10th last game played by the player.
   */
  calcInactivityPenaltyMultiplier(lastMatchTimestamps: number[], ct: number) {
    const c = this.config.inactivityMultiplier;
    
    // days since each of the last 10 games
    const days10g = lastMatchTimestamps.map(ts => (ct - ts) / 86400000);

    // p shrinks from 1 to 0 overtime for each of the last 10 games
    const p10g = days10g.map(days => {
      const pRaw = (days - c.daysTolerated) / (c.daysCap - c.daysTolerated);
      return Math.max(0, Math.min(1, 1 - pRaw));
    });

    const p = p10g.reduce((a, b) => a + b) / 10;
    const inactivityPenaltyMulitplier = c.minMult + p * (1 - c.minMult);
    return inactivityPenaltyMulitplier;
  }
}
export const scoreCalc = new ScoreCalc();