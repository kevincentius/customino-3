import { Module } from '@nestjs/common';
import { GameStatsController } from './game-stats/game-stats.controller';

@Module({
  controllers: [GameStatsController]
})
export class BackendApiModule {
  
}
