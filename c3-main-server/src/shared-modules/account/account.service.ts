import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'shared-modules/account/entity/account.entity';
import { EntityManager } from 'typeorm';
import { AccountInfo } from 'shared-modules/account/dto/account-info-dto';
const crypto = require("crypto");

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

@Injectable()
export class AccountService {
  async createAccount(em: EntityManager, passwordClearText: string, username: string, email: string) {
    const password = await this.hashPassword(passwordClearText);

    const ct = Date.now();
    await em.insert(AccountEntity, {
      username: username,
      password: password,
      email: email,
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
    return await em.createQueryBuilder(AccountEntity, 'account')
      .where("LOWER(account.username) = LOWER(:username)", { username })
      .getOne();
  }

  async findByEmail(em: EntityManager, email: string) {
    return await em.createQueryBuilder(AccountEntity, 'account')
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
    await this.update(em, account);

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
      await this.update(em, account);

      return true;
    } else {
      return false;
    }
  }
  
  async logIp(em: EntityManager, account: AccountEntity, ip: any) {
    const loggedIps = (account.ipCsv ?? '').split(',');
    loggedIps.pop();
    
    if (loggedIps.length < 1000 && loggedIps.indexOf(ip) == -1) {
      loggedIps.push(ip);
      loggedIps.sort();
    }
    account.ipCsv = loggedIps.join(',') + ',';
    await this.update(em, account);
  }
  
  private async update(em: EntityManager, account: AccountEntity) {
    await em.update(AccountEntity, { id: account.id }, account);
  }

  toAccountInfo(account: AccountEntity): AccountInfo {
    return {
      id: account.id,
      username: account.username,
      emailConfirmed: account.emailConfirmedAt != null,
      createdAt: account.createdAt,
      lastLogin: account.lastLogin,
    }
  }
}
