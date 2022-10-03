import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('game-stats')
@Controller('backend-api/game-stats')
export class GameStatsController {
  @Post('round')
  @ApiOperation({ summary: 'Post a game result to be processed.' })
  async login() {
    return { test: 'Not yet supported' };
  }
}
