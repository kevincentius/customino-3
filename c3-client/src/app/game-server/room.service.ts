import { Injectable } from "@angular/core";
import { LobbyEvent } from "@shared/model/room/lobby-event";
import { RoomInfo } from "@shared/model/room/room-info";
import { SocketService } from "app/service/socket.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  roomInfoSubject = new Subject<RoomInfo>();

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.on(LobbyEvent.ROOM_INFO, (roomInfo: RoomInfo) => {
      this.roomInfoSubject.next(roomInfo);
    });
  }

  async getRoomInfo(roomId: number): Promise<RoomInfo | null> {
    return this.socketService.emitQuery(LobbyEvent.GET_ROOM_INFO, roomId);
  }
}
