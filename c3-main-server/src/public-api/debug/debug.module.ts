import { Module } from '@nestjs/common';
import { DebugService } from 'public-api/debug/debug-service';
import { DebugController } from 'public-api/debug/debug.controller';

@Module({
  controllers: [
    DebugController,
  ],
  providers: [
    DebugService,
  ]
})
export class DebugModule {}
