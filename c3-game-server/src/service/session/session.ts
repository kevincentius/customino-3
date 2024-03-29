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
    public accountId: number | null,
    public username: string | null,
  ) {}
  
  getClientInfo(): ClientInfo {
    return {
      sessionId: this.sessionId,
      accountId: this.accountId,
      username: this.username!,
    };
  }
}
