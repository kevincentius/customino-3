import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'account/account.service';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { AuthService, AuthResult, RegisterResult } from 'auth/auth.service';
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
  
  @Post('register')
  @ApiOperation({ summary: 'Attempt to create a new account.' })
  @ApiCreatedResponse({ type: RegisterResult })
  async register(@Body() body: RegisterAccountDto): Promise<RegisterResult> {
    if (await this.accountService.findByUsername(body.username) != null) {
      return {
        success: false,
        error: 'Username is already taken.',
      };
    }

    await this.accountService.createAccount(body);
    return {
      success: true,
    };
  }
}
