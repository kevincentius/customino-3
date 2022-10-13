import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MailModule } from './shared-modules/mail/mail.module';
import { HttpExceptionFilter } from 'config/exception-filter';
import { BackendApiModule } from './backend-api/backend-api.module';
import { PublicApiModule } from './public-api/public-api.module';
import { LeaderboardModule } from './shared-modules/leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    BackendApiModule,
    PublicApiModule,

    MailModule,

    LeaderboardModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ]
})
export class AppModule {}
