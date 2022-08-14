import { Injectable } from '@angular/core';
import { LocalRule } from '@shared/game/engine/model/rule/local-rule/local-rule';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SocketService } from 'app/service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private socketService: SocketService
  ) {}

  updateLocalRule(localRule: LocalRule) {
    this.socketService.emit(LobbyEvent.UPDATE_LOCAL_RULE, localRule);
  }
}
