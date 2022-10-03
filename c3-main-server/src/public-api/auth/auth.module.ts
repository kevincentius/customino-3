import { Module } from '@nestjs/common';
import { AccountModule } from 'shared-modules/account/account.module';
import { LocalStrategy } from 'public-api/auth/local.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'public-api/auth/jwt.strategy';
import { config } from 'config/config';
import { MailModule } from 'mail/mail.module';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
      secret: config.jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    MailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
