import { Injectable } from '@angular/core';
import { UserRule } from '@shared/game/engine/model/rule/user-rule/user-rule';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SessionInfo } from '@shared/model/session/session-info';
import { ServerInfoDto } from 'app/main-server/api/v1';
import { SocketService } from 'app/service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameAppService {

  constructor(
    private socketService: SocketService
  ) {}

  async getServerInfo(): Promise<ServerInfoDto> {
    return this.socketService.emitQuery(LobbyEvent.GET_SERVER_INFO);
  }

  async getSessionInfo(): Promise<SessionInfo> {
    return this.socketService.emitQuery(LobbyEvent.GET_SESSION_INFO);
  }

  updateUserRule(userRule: UserRule) {
    this.socketService.emit(LobbyEvent.UPDATE_USER_RULE, userRule);
  }
}
