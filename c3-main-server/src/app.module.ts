import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'controller/app/app.controller';
import { DebugService } from 'service/debug-service';
import { DebugController } from './controller/debug/debug.controller';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from 'auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AccountModule,
    AuthModule,
  ],
  controllers: [
    DebugController,
    AppController,
  ],
  providers: [
    DebugService,
  ]
})
export class AppModule {}
