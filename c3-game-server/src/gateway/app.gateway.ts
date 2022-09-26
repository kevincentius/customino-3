import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserRule } from '@shared/game/engine/model/rule/user-rule/user-rule';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SessionInfo } from '@shared/model/session/session-info';
import { config } from 'config/config';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(config.webSocketGatewayOptions)
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

  @SubscribeMessage(LobbyEvent.GET_SERVER_INFO)
  getServerInfo(socket: Socket) {
    return {};
  }

  @SubscribeMessage(LobbyEvent.GET_SESSION_INFO)
  getSessionInfo(socket: Socket): SessionInfo {
    const session = this.sessionService.getSession(socket);
    return {
      sessionId: session.sessionId,
    };
  }

  @SubscribeMessage(LobbyEvent.UPDATE_USER_RULE)
  updateUserRule(socket: Socket, userRule: UserRule) {
    const session = this.sessionService.getSession(socket);
    session.userRule = userRule;
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

  async handleConnection(client: any) {
    try {
      this.logger.log(`Client connected: ${client.id}.`);
  
      await this.sessionService.createSession(client);

      client.emit('debugMessage', 'Hello from the server.');
    } catch (error) {
      this.logger.error(error);
    }
  }
}