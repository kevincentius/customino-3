import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from 'gateway/lobby-gateway';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { AppGateway } from './gateway/app.gateway';
import { AccountGateway } from 'gateway/account-gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
    AppGateway,
    AccountGateway,
    LobbyGateway,
    
    SessionService,
    RoomService,
  ],
})
export class AppModule {}
