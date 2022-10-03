import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from 'backend-api/api-key-auth-guard';

@ApiTags('game-stats')
@Controller('backend-api/game-stats')
export class GameStatsController {
  @Post('game-result')
  @ApiOperation({ summary: 'Post a game result to be processed.' })
  async postGameResult() {
    return { test: 'Not yet supported' };
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('test')
  @ApiOperation({ summary: 'test' })
  async test() {
    return { test: 'test' };
  }
}
