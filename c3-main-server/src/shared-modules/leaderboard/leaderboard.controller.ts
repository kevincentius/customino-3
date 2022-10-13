import { Get, Controller, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LeaderboardService } from 'shared-modules/leaderboard/leaderboard.service';
import { LeaderboardEntry } from 'shared-modules/leaderboard/dto/leaderboard-entry-dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Get('global-data')
  @ApiCreatedResponse({ type: LeaderboardEntry, isArray: true })
  async getLeaderboardEntries(
    @Query('gameModeSeasonId') gameModeSeasonId: number,
    @Query('offset', ) offset: number,
  ) {
    // TODO: lookup internet for how to use pipe to get query param as string intead of number
    // damit vodafone internet
    return await this.leaderboardService.getLeaderboardEntries(
      parseInt(gameModeSeasonId as any),
      parseInt(offset as any),
    );
  }
}
