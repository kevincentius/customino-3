
import { Controller, Get } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { config } from "config/config";
import { DebugResponseDto } from "public-api/debug/dto/debug-response.dto";
import { DebugService } from "public-api/debug/debug-service";

@ApiTags('debug')
@Controller('api/debug')
export class DebugController {
  constructor(
    private debugService: DebugService,
  ) {
    this.debugService.debugDatabase();
  }

  @Get('test')
  @ApiOperation({ summary: 'Returns a test string message and the URL of the Game Server.' })
  @ApiCreatedResponse({ type: DebugResponseDto })
  test(): DebugResponseDto {
    return {
      gameServerUrl: config.gameServerUrl,
      debugMessage: 'Hello from the main server (REST API)',
    };
  }
}
