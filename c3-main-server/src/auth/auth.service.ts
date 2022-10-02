import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { AccountService } from 'account/account.service';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { AccountEntity } from 'entity/account.entity';
import { DataSource, EntityManager } from 'typeorm';

export class AuthResult {
  jwtToken: any;
}

export class RegisterResult {
  @ApiProperty()
  success!: boolean;
  
  @ApiProperty()
  error?: string;
  
  @ApiProperty()
  accountId?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateUser(em: EntityManager, username: string, passwordClearText: string): Promise<any> {
    const account = await this.accountService.findByUsername(em, username);
    if (account && await this.accountService.verifyPassword(passwordClearText, account.password)) {
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

  async register(em: EntityManager, body: RegisterAccountDto) {
    // validation
    if (!body.username.match(/^[a-zA-Z][a-zA-Z0-9]{2,14}$/)) {
      return {
        success: false,
        error: 'Username must be alphanumeric and start with a letter.',
      };
    } else if (!body.email || !body.email.match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/)) {
      return {
        success: false,
        error: 'Email address seems to be invalid.',
      }
    } else if (body.passwordClearText.length == 0) {
      return {
        success: false,
        error: 'Password seems to be invalid.',
      }
    } else if (body.passwordClearText.length < 3 || ['tetris','cultris','password'].indexOf(body.passwordClearText.toLowerCase()) != -1) {
      return {
        success: false,
        error: 'Password needs a little finishing touch',
      }
    } else if (await this.accountService.findByUsername(em, body.username) != null) {
      return {
        success: false,
        error: 'Username is already taken.',
      };
    }
    
    const accountByEmail = await this.accountService.findByEmail(em, body.email!);
    if (accountByEmail) {
      return {
        success: false,
        error: `Email address is registered as ${accountByEmail.username}`,
      }
    }

    await this.accountService.createAccount(em, body);

    return {
      success: true,
    };
  }
}