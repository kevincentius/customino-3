import { Module } from '@nestjs/common';
import { AccountModule } from 'shared-modules/account/account.module';
import { RatingModule } from 'shared-modules/rating/rating.module';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [AccountModule, RatingModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService]
})
export class LeaderboardModule {}
