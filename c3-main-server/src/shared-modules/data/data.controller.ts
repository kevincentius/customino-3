import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GlobalData } from 'shared-modules/data/dto/global-data-dto';
import { globalData } from 'shared-modules/data/instance/global-data';

@ApiTags('data')
@Controller('data')
export class DataController {
  @Get('global-data')
  @ApiOperation({ summary: 'Gets static / hardcoded data for the current server version.' })
  @ApiCreatedResponse({ type: GlobalData })
  getGlobalData() {
    return globalData;
  }
}
