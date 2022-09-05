
import { Controller, Get } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { clientDownloadUrl, serverVersion } from "config/version";
import { ServerInfoDto } from "model/server-info-dto";

@ApiTags('app')
@Controller('api/app')
export class AppController {
  @Get('info')
  @ApiOperation({ summary: 'Returns information about the server such as supported client version.' })
  @ApiCreatedResponse({ type: ServerInfoDto })
  getInfo(): ServerInfoDto {
    return {
      version: serverVersion,
      clientDownloadUrl: clientDownloadUrl,
    };
  }
}
