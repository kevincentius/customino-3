
import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:4200',
      'https://poc-c3-client.netlify.app',
    ],
    credentials: true,
  }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server!: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: string): void {
    this.logger.log('Received debug message from a client:', message);
  }

  afterInit() {
    this.logger.log('Gateway initialized.');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}.`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}.`);

    client.emit('debugMessage', 'Hello from the server.');
  }
}