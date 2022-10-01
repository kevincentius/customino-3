import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'entity/account.entity';
import { RegisterAccountDto } from 'account/dto/register-account-dto';
import { EntityManager } from 'typeorm';

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
      emailConfirmCode: [...Array(32)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join(''),
      createdAt: ct,
      lastLogin: ct,
    });
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
}
