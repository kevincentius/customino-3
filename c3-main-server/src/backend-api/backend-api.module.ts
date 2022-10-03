import { Module } from '@nestjs/common';
import { ApiKeyStrategy } from 'backend-api/api-key.strategy';
import { GameStatsController } from './game-stats/game-stats.controller';

@Module({
  controllers: [GameStatsController],
  providers: [ApiKeyStrategy],
})
export class BackendApiModule {

}
