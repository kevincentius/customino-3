import { Module } from '@nestjs/common';
import { GameStatsController } from 'backend-api/game-stats/game-stats.controller';
import { RatingService } from 'backend-api/game-stats/rating.service';

@Module({
  controllers: [
    GameStatsController,
  ],
  providers: [RatingService],
})
export class GameStatsModule {}
