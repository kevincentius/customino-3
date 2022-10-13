import { Module } from '@nestjs/common';
import { GameStatsController } from 'backend-api/game-stats/game-stats.controller';
import { RatingModule } from 'shared-modules/rating/rating.module';

@Module({
  imports: [RatingModule],
  controllers: [
    GameStatsController,
  ],
})
export class GameStatsModule {}
