import { Controller, Post, Body, UseGuards, Ip } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'account/account.service';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { AuthService, AuthResult, RegisterResult } from 'auth/auth.service';
import { ChangePasswordRequestDto } from 'auth/dto/change.password-request-dto';
import { ConfirmEmailRequestDto } from 'auth/dto/confirm-email-request-dto';
import { LoginDto } from 'auth/dto/login-dto';
import { ResetPasswordRequestDto } from 'auth/dto/reset-password-request-dto';
import { ResetPasswordResponseDto } from 'auth/dto/reset-password-response-dto';
import { LocalAuthGuard } from 'auth/local-auth-guard';
import { MailService } from 'mail/mail.service';
import { t } from 'service/transaction';

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
  async login(@Body() body: LoginDto, @Ip() ip: any): Promise<AuthResult> {
    return await t(async em => {
      const account = (await this.accountService.findByUsername(em, body.username))!;
      await this.accountService.logIp(em, account, ip);

      return await this.authService.createJwtToken(account);
    });
  }
  
  @Post('register')
  @ApiOperation({ summary: 'Attempt to create a new account.' })
  @ApiCreatedResponse({ type: RegisterResult })
  async register(@Body() body: RegisterAccountDto): Promise<RegisterResult> {
    // DB transaction
    return await t(async em => {
      const result = await this.authService.register(em, body);

      // Confirmation email
      if (result.success) {
        const account = (await this.accountService.findByUsername(em, body.username))!;
        if (account.email) {
          // send email without await
          this.mailService.sendEmailConfirmation(account.email, account.username, account.emailConfirmCode!);
        }
      }

      return result;
    });
  }
  
  @Post('email-confirmation-code')
  @ApiOperation({ summary: 'Attempt to confirm the user\'s email address using the code sent to him.' })
  @ApiCreatedResponse({ type: Boolean })
  async confirmEmailByCode(@Body() body: ConfirmEmailRequestDto): Promise<boolean> {
    return await t(async em => this.accountService.confirmEmailByCode(em, body.emailConfirmationCode));
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Creates a new reset password token and sends this to the user\'s email address.' })
  @ApiCreatedResponse({ type: ResetPasswordResponseDto })
  async forgotPassword(@Body() body: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    return await t(async em => {
      let account = body.email ? await this.accountService.findByEmail(em, body.email)
                    : body.username ? await this.accountService.findByUsername(em, body.username)
                    : undefined;

      if (account && account.email) {
        const passwordResetCode = await this.accountService.createResetPasswordCode(em, account.id);

        this.mailService.sendPasswordReset(account.email, account.username, passwordResetCode);

        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Account not found.',
        };
      }
    });
  }

  @Post('change-password')
  @ApiOperation({})
  @ApiCreatedResponse({ type: Boolean })
  async changePassword(@Body() body: ChangePasswordRequestDto): Promise<boolean> {
    return await t(async em => {
      return this.accountService.changePassword(em, body.passwordResetCode, body.newPassword);
    });
  }
}
