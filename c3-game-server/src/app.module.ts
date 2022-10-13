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
import { ApiModule, Configuration, ConfigurationParameters } from 'main-server/api/v1';
import { config } from 'config/config';
import { GlobalDataService } from './service/global-data/global-data.service';

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
    GlobalDataService,
  ],
})
export class AppModule {}
