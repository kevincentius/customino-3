import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'account/account.service';
import { AuthService, AuthResult } from 'auth/auth.service';
import { LoginDto } from 'auth/dto/login-dto';
import { LocalAuthGuard } from 'auth/local-auth-guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Attempt to login with an existing account.' })
  @ApiCreatedResponse({ type: AuthResult })
  async login(@Body() body: LoginDto) {
    return await this.authService.createJwtToken(
      (await this.accountService.findByUsername(body.username))!);
  }
}
