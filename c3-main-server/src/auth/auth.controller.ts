import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'account/account.service';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { AuthService, AuthResult, RegisterResult } from 'auth/auth.service';
import { ConfirmEmailRequestDto } from 'auth/dto/confirm-email-request-dto';
import { LoginDto } from 'auth/dto/login-dto';
import { LocalAuthGuard } from 'auth/local-auth-guard';
import { MailService } from 'mail/mail.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private mailService: MailService,
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
    const account = (await this.accountService.findByUsername(body.username))!;

    console.log(account);
    if (account.email) {
      // async email delivery (deliberately no await here)
      this.mailService.sendEmailConfirmation(account.email, account.username, account.emailConfirmCode!);
    }
    return {
      success: true,
    };
  }
  
  @Post('email-confirmation-code')
  @ApiOperation({ summary: 'Attempt to confirm the user\'s email address using the code sent to him.' })
  @ApiCreatedResponse({ type: Boolean })
  async confirmEmailByCode(@Body() body: ConfirmEmailRequestDto): Promise<boolean> {
    console.log('test');
    return this.accountService.confirmEmailByCode(body.emailConfirmationCode);
  }
}
