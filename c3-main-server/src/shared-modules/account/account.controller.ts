import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountEntity } from 'shared-modules/account/entity/account.entity';
import { t } from 'util/transaction';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  @ApiOperation({})
  @ApiCreatedResponse({ type: AccountEntity })
  async findByUsername(@Query('username') username: string) {
    return await t(async em => {
      const accountEntity = await this.accountService.findByUsername(em, username);
      if (accountEntity == null) {
        return null;
      } else {
        const {password: password, ...account} = accountEntity;
        return account;
      }
    });
  }
}
