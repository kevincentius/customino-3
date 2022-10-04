import { Test, TestingModule } from '@nestjs/testing';
import { MsGameStatsService } from './ms-game-stats.service';

describe('MsGameStatsService', () => {
  let service: MsGameStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsGameStatsService],
    }).compile();

    service = module.get<MsGameStatsService>(MsGameStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
