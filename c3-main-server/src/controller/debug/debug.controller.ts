
import { Controller, Get } from "@nestjs/common";
import { DebugResponse } from "@shared/debug-response";
import { DebugService } from "service/debug-service";

@Controller('api/debug')
export class DebugController {
  constructor(
    private debugService: DebugService,
  ) {
    this.debugService.debugDatabase();
  }

  @Get('test')
  findAll(): DebugResponse {
    return {
      gameServerUrl: process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-game-server.herokuapp.com' : 'http://localhost:3001',
      debugMessage: 'Hello from the main server (REST API)',
    } as DebugResponse;
  }
}
