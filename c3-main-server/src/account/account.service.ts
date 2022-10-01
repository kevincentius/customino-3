import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'entity/account.entity';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { EntityManager } from 'typeorm';
const crypto = require("crypto");

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

@Injectable()
export class AccountService {
  async createAccount(em: EntityManager, registerAccountDto: RegisterAccountDto) {
    const password = await this.hashPassword(registerAccountDto.passwordClearText);

    const ct = Date.now();
    await em.insert(AccountEntity, {
      username: registerAccountDto.username,
      password: password,
      email: registerAccountDto.email,
      emailConfirmCode: this.createRandomUrlSafeCode(),
      createdAt: ct,
      lastLogin: ct,
    });
  }

  private createRandomUrlSafeCode() {
    return [...Array(128)].map(() => chars.charAt(crypto.randomInt(0, chars.length))).join('');
  }

  async hashPassword(passwordClearText: string) {
    return bcrypt.hash(passwordClearText, 12);
  }

  async verifyPassword(passwordClearText: string, password: string) {
    return bcrypt.compare(passwordClearText, password);
  }

  async findByUsername(em: EntityManager, username: string) {
    return em.createQueryBuilder(AccountEntity, 'account')
      .where("LOWER(account.username) = LOWER(:username)", { username })
      .getOne();
  }

  async findByEmail(em: EntityManager, email: string) {
    return em.createQueryBuilder(AccountEntity, 'account')
      .where("LOWER(account.email) = LOWER(:email)", { email })
      .getOne();
  }

  async confirmEmailByCode(em: EntityManager, emailConfirmationCode: string) {
    const account = await em.findOneBy(AccountEntity, {
      emailConfirmCode: emailConfirmationCode,
    });

    if (account) {
      account.emailConfirmedAt = account.emailConfirmedAt ?? Date.now();
      await em.update(AccountEntity, { id: account.id, }, account);
      return true;
    } else {
      return false;
    }
  }

  async createResetPasswordCode(em: EntityManager, accountId: number) {
    const code = this.createRandomUrlSafeCode();
    
    const account = (await em.findOneBy(AccountEntity, {
      id: accountId,
    }))!;
    account.resetPasswordCode = code;
    account.resetPasswordExpiry = Date.now() + 3600_000;
    await em.update(AccountEntity, { id: account.id }, account);

    return code;
  }
  
  async changePassword(em: EntityManager, passwordResetCode: string, newPasswordClearText: string): Promise<boolean> {
    const account = (await em.findOneBy(AccountEntity, {
      resetPasswordCode: passwordResetCode,
    }))!;

    if (!newPasswordClearText || newPasswordClearText.length < 3) {
      return false;
    }

    if (account.resetPasswordCode == passwordResetCode 
        && account.resetPasswordExpiry
        && account.resetPasswordExpiry > Date.now()) {
      account.resetPasswordCode = undefined;
      account.resetPasswordExpiry = undefined;
      account.password = await this.hashPassword(newPasswordClearText);
      em.update(AccountEntity, { id: account.id }, account);

      return true;
    } else {
      return false;
    }
  }
}
