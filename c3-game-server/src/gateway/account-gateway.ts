
import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SessionInfo } from '@shared/model/session/session-info';
import { websocketGatewayOptions } from 'config/config';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(websocketGatewayOptions)
export class AccountGateway {

  constructor(
    private sessionService: SessionService,
  ) {}

  private logger: Logger = new Logger('AccountGateway');

  @SubscribeMessage(LobbyEvent.LOGIN)
  async login(socket: Socket, args: any[]): Promise<SessionInfo | null> {
    console.log(socket, args);

    const registered: boolean | null = args[0];
    const username: string = (args[1] as string).trim();

    // validate username
    if (username.length < 3 || username.length > 15) { return null; }

    const guestName = this.sessionService.registerGuest(socket, username);

    const session = this.sessionService.getSession(socket);
    if (registered == null) {
      // TODO: session service checks if guest name is taken
      session.userId = null;
      session.username = guestName;

      const sessionInfo: SessionInfo = {
        sessionId: session.sessionId,
      };
      return sessionInfo;
    } else {
      // accounts not supported yet
      return null;
    }
  }
}