import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { t } from 'service/transaction';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, passwordClearText: string): Promise<any> {
    return await t(async em => {
      const user = await this.authService.validateUser(em, username, passwordClearText);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    });
  }
}