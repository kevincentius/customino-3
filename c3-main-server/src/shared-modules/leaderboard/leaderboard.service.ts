import { Injectable } from '@nestjs/common';
import { RatingService } from 'shared-modules/rating/rating.service';
import { AccountEntity } from 'shared-modules/account/entity/account.entity';
import { LeaderboardEntry } from 'shared-modules/leaderboard/dto/leaderboard-entry-dto';
import { RatingEntity } from 'shared-modules/rating/entity/rating.entity';
import { t } from 'util/transaction';
import { AccountService } from 'shared-modules/account/account.service';

@Injectable()
export class LeaderboardService {
  readonly config = {
    firstPageCachePeriod: 60000,
    pageSize: 100,
  };

  constructor(
    private accountService: AccountService,
    private ratingService: RatingService,
  ) {}

  async getLeaderboardEntries(gameModeSeasonId: number, offset: number): Promise<LeaderboardEntry[]> {
    return await t(async em => {
      const ratings = await em.find(RatingEntity, {
        where: {
          gameModeSeasonId: gameModeSeasonId,
        },
        order: {
          score: 'DESC',
        },
        skip: offset,
        take: 100,
        relations: [ 'account' ],
      });

      return ratings.map((rating, index) => {
        const entry: LeaderboardEntry = {
          rank: index + offset,
          accountInfo: this.accountService.toAccountInfo(rating.account!),
          ratingInfo: this.ratingService.toRatingInfo(rating),
        };
        return entry;
      });
    });
  }
}
