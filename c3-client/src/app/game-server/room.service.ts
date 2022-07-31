import { Injectable } from "@angular/core";
import { GameResult } from "@shared/game/engine/game/game-result";
import { RoomSettings } from "@shared/game/engine/model/room-settings";
import { GameReplay } from "@shared/game/engine/recorder/game-replay";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { ServerEvent } from "@shared/game/network/model/event/server-event";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";
import { LobbyEvent } from "@shared/model/room/lobby-event";
import { RoomInfo } from "@shared/model/room/room-info";
import { SocketService } from "app/service/socket.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  roomInfoSubject = new Subject<RoomInfo>();
  startGameSubject = new Subject<StartGameData>();
  gameOverSubject = new Subject<GameResult>();
  serverEventSubject = new Subject<ServerEvent>();

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.on(LobbyEvent.ROOM_INFO, (roomInfo: RoomInfo) => {
      this.roomInfoSubject.next(roomInfo);
    });

    this.socketService.on(LobbyEvent.START_GAME, (startGameData: StartGameData) => {
      this.startGameSubject.next(startGameData);
    });

    this.socketService.on(LobbyEvent.SERVER_EVENT, (serverEvent: ServerEvent) => {
      this.serverEventSubject.next(serverEvent);
    });

    this.socketService.on(LobbyEvent.GAME_OVER, (gameResult: GameResult) => {
      this.gameOverSubject.next(gameResult);
    });
  }

  async getRoomInfo(roomId: number): Promise<RoomInfo | null> {
    return this.socketService.emitQuery(LobbyEvent.GET_ROOM_INFO, roomId);
  }

  async leave(): Promise<void> {
    return this.socketService.emit(LobbyEvent.LEAVE_ROOM);
  }

  async startGame() {
    return this.socketService.emit(LobbyEvent.START_GAME);
  }

  async flushGameEvents(clientEvent: ClientEvent) {
    this.socketService.emit(LobbyEvent.GAME_EVENTS, clientEvent);
  }

  async getReplay(): Promise<GameReplay | null> {
    return this.socketService.emitQuery(LobbyEvent.GET_REPLAY);
  }

  async changeRoomSettings(roomSettings: RoomSettings) {
    this.socketService.emit(LobbyEvent.CHANGE_ROOM_SETTINGS, roomSettings);
  }
}
