import { Injectable } from '@angular/core';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { RoomInfo } from '@shared/model/room/room-info';
import { SessionInfo } from '@shared/model/session/session-info';
import { SocketService } from 'app/service/socket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  clientInfoSubject = new Subject<SessionInfo>();

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.on(LobbyEvent.SESSION_INFO, (sessionInfo: SessionInfo) => {
      this.clientInfoSubject.next(sessionInfo);
    });
  }

  async getRooms(): Promise<RoomInfo[]> {
    return this.socketService.emitQuery(LobbyEvent.GET_ROOMS);
  }

  async createRoom(): Promise<RoomInfo> {
    return this.socketService.emitQuery(LobbyEvent.CREATE_ROOM);
  }

  async joinRoom(roomId: number): Promise<RoomInfo | null> {
    return this.socketService.emitQuery(LobbyEvent.JOIN_ROOM, roomId);
  }
}
