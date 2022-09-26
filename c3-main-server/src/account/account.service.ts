import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'config/data-source';
import { LoginDto } from 'auth/dto/login-dto';
import { AccountEntity } from 'entity/account.entity';
import { RegisterAccountDto } from 'account/dto/register-account-dto';

@Injectable()
export class AccountService {
  private accountRepository = AppDataSource.getRepository(AccountEntity);

  async register(registerAccountDto: RegisterAccountDto) {
    const password = await this.hashPassword(registerAccountDto.passwordClearText);

    const ct = Date.now();
    this.accountRepository.create({
      username: registerAccountDto.username,
      password: password,
      email: registerAccountDto.email,
      createdAt: ct,
      lastLogin: ct,
    });
  }

  async hashPassword(passwordClearText: string) {
    return bcrypt.hash(passwordClearText, 12);
  }

  async findByUsername(username: string) {
    return this.accountRepository.findOneBy({
      username: username,
    });
  }

  async login(loginDto: LoginDto) {

  }
}
