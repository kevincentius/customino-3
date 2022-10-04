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
import { MsGameStatsModule } from './main-server/bu-ms-game-stats/ms-game-stats.module';
import { ApiModule, Configuration, ConfigurationParameters } from 'main-server/api/v1';
import { config } from 'config/config';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: config.mainServerUrl,
    apiKeys: { 'Api-Key': config.jwtConstants.secret },
    accessToken: config.jwtConstants.secret,
    username: 'itsme',
    password: config.jwtConstants.secret,
    withCredentials: true,
  };
  return new Configuration(params);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MsGameStatsModule,
    ApiModule.forRoot(apiConfigFactory),
  ],
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
