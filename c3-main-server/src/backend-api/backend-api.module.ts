import { Module } from '@nestjs/common';
import { ApiKeyStrategy } from 'backend-api/api-key.strategy';
import { GameStatsModule } from 'backend-api/game-stats/backend-api.module';
import { DataModule } from 'shared-modules/data/data.module';

export const backendApiModules = [
  GameStatsModule,
  DataModule,
];
@Module({
  imports: backendApiModules,
  providers: [ApiKeyStrategy],
})
export class BackendApiModule {}
