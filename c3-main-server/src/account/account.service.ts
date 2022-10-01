import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'config/data-source';
import { AccountEntity } from 'entity/account.entity';
import { RegisterAccountDto } from 'account/dto/register-account-dto';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

@Injectable()
export class AccountService {
  private accountRepository = AppDataSource.getRepository(AccountEntity);

  async createAccount(registerAccountDto: RegisterAccountDto) {
    const password = await this.hashPassword(registerAccountDto.passwordClearText);

    const ct = Date.now();
    const account = await this.accountRepository.insert({
      username: registerAccountDto.username,
      password: password,
      email: registerAccountDto.email,
      emailConfirmCode: [...Array(32)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join(''),
      createdAt: ct,
      lastLogin: ct,
    });

    return account;
  }

  async hashPassword(passwordClearText: string) {
    return bcrypt.hash(passwordClearText, 12);
  }

  async verifyPassword(passwordClearText: string, password: string) {
    return bcrypt.compare(passwordClearText, password);
  }

  async findByUsername(username: string) {
    return this.accountRepository.createQueryBuilder()
    .where("LOWER(username) = LOWER(:username)", { username })
    .getOne();
  }

  async confirmEmailByCode(emailConfirmationCode: string) {
    const account = await this.accountRepository.findOneBy({
      emailConfirmCode: emailConfirmationCode,
    });

    if (account) {
      account.emailConfirmedAt = account.emailConfirmedAt ?? Date.now();
      await this.accountRepository.update({ id: account.id, }, account);
      return true;
    } else {
      return false;
    }
  }
}
