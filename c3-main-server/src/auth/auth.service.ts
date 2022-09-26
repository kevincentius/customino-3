import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'account/account.service';
import { AccountEntity } from 'entity/account.entity';

export class AuthResult {
  jwtToken: any;
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, passwordClearText: string): Promise<any> {
    const account = await this.accountService.findByUsername(username);
    if (account && account.password == passwordClearText) { // TODO: HASH await this.accountService.hashPassword(passwordClearText)) {
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async createJwtToken(account: AccountEntity): Promise<AuthResult> {
    const payload = { username: account.username, sub: account.id };
    return {
      jwtToken: this.jwtService.sign(payload),
    };
  }

  async createGuestJwtToken(username: string): Promise<AuthResult> {
    const payload = { username: username };
    return {
      jwtToken: this.jwtService.sign(payload),
    };
  }
}