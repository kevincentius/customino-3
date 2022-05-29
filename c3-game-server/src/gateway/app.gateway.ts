
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { websocketGatewayOptions } from 'config/config';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(websocketGatewayOptions)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  // @WebSocketServer() server!: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private sessionService: SessionService,
  ) {}

  @SubscribeMessage('msgToServer')
  handleMessage(message: string): void {
    this.logger.log('Received debug message from a client:', message);
  }

  afterInit() {
    this.logger.log('Gateway initialized.');
  }

  handleDisconnect(client: Socket) {
    try {
      this.logger.log(`Client disconnected: ${client.id}.`);
      
      this.sessionService.destroySession(client);
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleConnection(client: Socket) {
    try {
      this.logger.log(`Client connected: ${client.id}.`);
  
      client.emit('debugMessage', 'Hello from the server.');
  
      this.sessionService.createSession(client);
    } catch (error) {
      this.logger.error(error);
    }
  }
}