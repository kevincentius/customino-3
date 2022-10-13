import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from 'backend-api/api-key-auth-guard';
import { ServerGameStatsDto } from 'backend-api/game-stats/dto/server-game-stats-dto';
import { RatingService } from 'shared-modules/rating/rating.service';

@ApiTags('game-stats')
@Controller('backend-api/game-stats')
export class GameStatsController {
  constructor(
    private ratingService: RatingService,
  ) {}

  @Post('game-result')
  @ApiOperation({ summary: 'Post a game result to be processed.' })
  async postGameResult(@Body() body: ServerGameStatsDto) {
    console.log(body);
    if (body.accountIdsByRanking.length > 1) {
      await this.ratingService.updateRatings(body.gameModeSeasonId, body.accountIdsByRanking);
    }
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('test')
  @ApiOperation({ summary: 'test' })
  async test() {
    return { test: 'test' };
  }
}
