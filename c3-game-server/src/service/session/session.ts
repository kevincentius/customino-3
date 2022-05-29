import { ClientInfo } from "@shared/model/session/client-info";
import { Socket } from "socket.io";

export class Session {
  roomId?: number;

  constructor(
    public socket: Socket,
    public sessionId: number,
    public userId: number,
    public username: string,
  ) {}
  
  getClientInfo(): ClientInfo {
    return {
      id: this.sessionId,
      userId: this.userId,
      username: this.username,
    };
  }
}
