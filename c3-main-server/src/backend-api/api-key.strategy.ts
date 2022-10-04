import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'config/config';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor() {
    super({
      header: 'Authorization',
      prefix: 'Api-Key'
    }, true, (apiKey: string, done: any) => {
      return done(apiKey == config.backendApiSecret);
    });
  }
}
