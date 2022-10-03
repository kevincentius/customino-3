import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountInfoDto } from 'shared-modules/account/dto/account-info-dto';
import { t } from 'util/transaction';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  @ApiOperation({})
  @ApiCreatedResponse({ type: AccountInfoDto })
  async findByUsername(@Query('username') username: string): Promise<AccountInfoDto | null> {
    return await t(async em => {
      const accountEntity = await this.accountService.findByUsername(em, username);
      if (accountEntity == null) {
        return null;
      } else {
        const {password: password, ...account} = accountEntity;
        return {
          username: account.username,
          emailConfirmed: account.emailConfirmedAt != null,
          createdAt: account.createdAt,
          lastLogin: account.lastLogin,
        };
      }
    });
  }
}
