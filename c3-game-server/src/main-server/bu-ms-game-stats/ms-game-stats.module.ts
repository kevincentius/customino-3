import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MsGameStatsService } from './ms-game-stats.service';

@Module({
  imports: [HttpModule],
  providers: [MsGameStatsService],
})
export class MsGameStatsModule {}
