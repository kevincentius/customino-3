import { Injectable } from '@angular/core';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { SessionInfo } from '@shared/model/session/session-info';
import { SocketService } from 'app/service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private socketService: SocketService
  ) {}
}
