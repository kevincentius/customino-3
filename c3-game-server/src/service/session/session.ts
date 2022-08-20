import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { ClientInfo } from "@shared/model/session/client-info";
import { Socket } from "socket.io";

export class Session {
  roomId?: number;

  // userRule must be set by the client when connecting!
  userRule!: UserRule;

  constructor(
    public socket: Socket,
    public sessionId: number,
    public userId: number | null,
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
