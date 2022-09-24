import { Injectable } from '@angular/core';
import { UserRule } from '@shared/game/engine/model/rule/user-rule/user-rule';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SocketService } from 'app/service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameAppService {

  constructor(
    private socketService: SocketService
  ) {}

  async getServerInfo() {
    return this.socketService.emitQuery(LobbyEvent.GET_SERVER_INFO);
  }

  updateUserRule(userRule: UserRule) {
    this.socketService.emit(LobbyEvent.UPDATE_USER_RULE, userRule);
  }
}
