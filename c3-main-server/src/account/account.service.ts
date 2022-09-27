import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'config/data-source';
import { LoginDto } from 'auth/dto/login-dto';
import { AccountEntity } from 'entity/account.entity';
import { RegisterAccountDto } from 'account/dto/register-account-dto';

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
      createdAt: ct,
      lastLogin: ct,
    });

    console.log('created', account);
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
}
