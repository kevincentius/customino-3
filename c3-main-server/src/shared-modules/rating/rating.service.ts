import { Injectable } from '@nestjs/common';
import { scoreCalc } from 'backend-api/game-stats/score-calc';
import { RatingInfo } from 'shared-modules/rating/dto/rating-info-dto';
import { RatingEntity } from 'shared-modules/rating/entity/rating.entity';
import { In } from 'typeorm';
import { t } from 'util/transaction';
const Glicko2 = require('glicko2').Glicko2;

@Injectable()
export class RatingService {
  async updateRatings(gameModeSeasonId: number, accountIdsByRanking: number[]) {
    await t(async em => {
      // convert (load) accountIds to ratings
      const unorderedRating = await em.find(RatingEntity, {
        where: {
          gameModeSeasonId: gameModeSeasonId,
          accountId: In(accountIdsByRanking),
        }
      });
      const ratingsMap = new Map(unorderedRating.map(rating => [rating.accountId, rating]));
      const ratings: RatingEntity[] = accountIdsByRanking.map(accountId => ratingsMap.get(accountId) ?? {
        id: undefined!,
        gameModeSeasonId: gameModeSeasonId,
        account: undefined!,
        accountId: accountId,
        rating: undefined!,
        rd: undefined!,
        vol: undefined!,
        score: 0,
        matches: 0,
        lastMatchTimestamps: '',
      });
  
      // apply glicko2
      const glicko2 = this.prepareGlicko2();
      const players = ratings.map(rating => rating.rating
        ? glicko2.makePlayer(
          rating.rating,
          rating.rd,
          rating.vol
        )
        : glicko2.makePlayer());
      let matches = this.roundRobin(players);
      glicko2.updateRatings(matches);
      players.forEach((player, index) => {
        ratings[index].rating = player.getRating();
        ratings[index].rd = player.getRd();
        ratings[index].vol = player.getVol();
      });

      // update ratings
      const ct = Date.now();
      ratings.forEach(rating => {
        rating.matches++;
        const lastMatchTimestamps = (rating.lastMatchTimestamps ?? '').split(',');
        lastMatchTimestamps[lastMatchTimestamps.length - 1] = ct.toString();
        if (lastMatchTimestamps.length > 10) {
          lastMatchTimestamps.shift();
        }
        rating.lastMatchTimestamps = lastMatchTimestamps.join(',');
        
        rating.score = scoreCalc.calc(rating, lastMatchTimestamps.map(ts => parseInt(ts)), ct);
      });

      await em.save(RatingEntity, ratings);
    });
  }

  private roundRobin(players: any[]) {
    let matches = [];
    for (let i = 0; i < players.length - 1; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matches.push([players[i], players[j], 1]);
      }
    }
    return matches;
  }

  private prepareGlicko2() {
    return new Glicko2({
      tau: 0.3,
      rating: 1500,
      rd: 200,
      vol: 0.01,
    });
  }

  toRatingInfo(rating: RatingEntity): RatingInfo {
    return {
      rating: rating.rating,
      rd: rating.rd,
      vol: rating.vol,
      score: rating.score,
      matches: rating.matches,
      lastMatchTimestamp: rating.lastMatchTimestamps.trim().length == 0 ? undefined : parseInt(rating.lastMatchTimestamps.split(',').at(-1)!),
    };
  }
}
