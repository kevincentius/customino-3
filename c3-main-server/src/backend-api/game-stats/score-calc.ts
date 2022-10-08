import { RatingEntity } from "shared-modules/leaderboard/entity/rating.entity";

class ScoreCalc {
  calc(rating: RatingEntity, lastMatchTimestamps: number[], ct: number) {
    // Multiplier grows from 0 to 1 (circle equation) until the player plays enough matches
    const newPlayerPenaltyMultiplier = Math.sqrt(1 - (1 - Math.min(1, rating.matches / 100)) ^ 2);
  
    // Multiplier goes from 1 to approaching X < 1 as time passes since the 10th last game played by the player.
    const daysCap = 14;
    const daysTolerated = 3;
    const minMult = 0.5;
    const days10g = lastMatchTimestamps.map(ts => Math.min(daysCap, (ct - ts) / 86400000));
    const p10g = days10g.map(days => Math.max(0, (days - daysTolerated)) / (daysCap - daysTolerated));
    const p = p10g.reduce((a, b) => a + b) / p10g.length;
    const inactivityPenaltyMulitplier = 1 - p * minMult;
  
    // Score scaling factor
    const scoreScale = 10000 / 3000;
  
    // final score
    return rating.rating * newPlayerPenaltyMultiplier * inactivityPenaltyMulitplier * scoreScale;
  }  
}
export const scoreCalc = new ScoreCalc();