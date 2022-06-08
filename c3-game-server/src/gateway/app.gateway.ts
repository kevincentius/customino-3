
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SessionInfo } from '@shared/model/session/session-info';
import { websocketGatewayOptions } from 'config/config';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(websocketGatewayOptions)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  // @WebSocketServer() server!: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private sessionService: SessionService,
    private roomService: RoomService,
  ) {}

  @SubscribeMessage('msgToServer')
  handleMessage(message: string): void {
    this.logger.log('Received debug message from a client:', message);
  }

  afterInit() {
    this.logger.log('Gateway initialized.');
  }

  handleDisconnect(socket: Socket) {
    try {
      this.logger.log(`Client disconnected: ${socket.id}.`);

      const session = this.sessionService.getSession(socket);

      if (session.roomId) {
        const room = session.roomId ? this.roomService.getRoom(session.roomId) : null;
        room!.leave(session);
      }
      this.sessionService.destroySession(socket);
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleConnection(client: Socket) {
    try {
      this.logger.log(`Client connected: ${client.id}.`);
  
      client.emit('debugMessage', 'Hello from the server.');
  
      const session = this.sessionService.createSession(client);

      const sessionInfo: SessionInfo = {
        sessionId: session.sessionId,
      }
      session.socket.emit(LobbyEvent.SESSION_INFO, sessionInfo);
    } catch (error) {
      this.logger.error(error);
    }
  }
}