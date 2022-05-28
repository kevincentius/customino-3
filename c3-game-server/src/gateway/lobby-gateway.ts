
import { Logger } from '@nestjs/common';
import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { websocketGatewayOptions } from 'config/config';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(websocketGatewayOptions)
export class LobbyGateway {

  constructor(
    private roomService: RoomService,
    private sessionService: SessionService,
  ) {}

  private logger: Logger = new Logger('LobbyGateway');

  @SubscribeMessage(LobbyEvent.GET_ROOMS)
  getRooms() {
    return this.roomService.getRoomInfos();
  }

  @SubscribeMessage(LobbyEvent.CREATE_ROOM)
  createRoom(socket: Socket) {
    const session = this.sessionService.getSession(socket);
    return this.roomService
      .createRoom(session)
      .getRoomInfo();
  }

  @SubscribeMessage(LobbyEvent.JOIN_ROOM)
  joinRoom(socket: Socket, roomId: number) {
    const session = this.sessionService.getSession(socket);
    return this.roomService.join(session, roomId);
  }

  @SubscribeMessage(LobbyEvent.GET_ROOM_INFO)
  getRoomInfo(socket: Socket, roomId: number) {
    return this.roomService.getRoom(roomId).getRoomInfo();
  }

}