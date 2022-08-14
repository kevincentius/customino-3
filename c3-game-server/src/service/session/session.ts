import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { ClientInfo } from "@shared/model/session/client-info";
import { Socket } from "socket.io";

export class Session {
  roomId?: number;
  localRule!: LocalRule; // must be set by the client when connecting!

  constructor(
    public socket: Socket,
    public sessionId: number,
    public userId: number,
    public username: string,
  ) {}
  
  getClientInfo(): ClientInfo {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      username: this.username,
    };
  }
}
