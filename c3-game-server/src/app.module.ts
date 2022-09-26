import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from 'gateway/lobby-gateway';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { AppGateway } from './gateway/app.gateway';
import { ServerRoomService } from 'service/room/server-room-service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    AppGateway,
    LobbyGateway,
    
    SessionService,
    RoomService,
    ServerRoomService,
  ],
})
export class AppModule {}
