import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'controller/app/app.controller';
import { DebugService } from 'service/debug-service';
import { DebugController } from './controller/debug/debug.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
  ],
  controllers: [
    AppController,
    DebugController,
  ],
  providers: [
    DebugService,
  ]
})
export class AppModule {}
