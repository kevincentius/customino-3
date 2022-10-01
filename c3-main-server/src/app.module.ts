import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'controller/app/app.controller';
import { DebugService } from 'service/debug-service';
import { DebugController } from './controller/debug/debug.controller';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { HttpExceptionFilter } from 'config/exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AccountModule,
    AuthModule,
    MailModule,
  ],
  controllers: [
    DebugController,
    AppController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    DebugService,
  ]
})
export class AppModule {}
