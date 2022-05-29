import { Injectable } from '@angular/core';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { RoomInfo } from '@shared/model/room/room-info';
import { SocketService } from 'app/service/socket.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  constructor(
    private socketService: SocketService
  ) { }

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
