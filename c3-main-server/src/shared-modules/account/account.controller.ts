import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountInfo } from 'shared-modules/account/dto/account-info-dto';
import { t } from 'util/transaction';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('api/account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}
  
  @Get()
  @ApiOperation({})
  @ApiCreatedResponse({ type: AccountInfo })
  async findByUsername(@Query('username') username: string): Promise<AccountInfo | null> {
    return await t(async em => {
      const accountEntity = await this.accountService.findByUsername(em, username);
      if (accountEntity == null) {
        return null;
      } else {
        return this.accountService.toAccountInfo(accountEntity);
      }
    });
  }
}
