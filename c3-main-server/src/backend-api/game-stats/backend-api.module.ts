import { Module } from '@nestjs/common';
import { GameStatsController } from 'backend-api/game-stats/game-stats.controller';

@Module({
  controllers: [
    GameStatsController,
  ],
})
export class GameStatsModule {}
