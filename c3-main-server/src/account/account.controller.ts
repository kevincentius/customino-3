import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountEntity } from 'entity/account.entity';
import { t } from 'service/transaction';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  @ApiOperation({ summary: 'Returns ' })
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
