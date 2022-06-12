import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RoomInfo } from '@shared/model/room/room-info';
import { LobbyService } from 'app/game-server/lobby.service';
import { DebugService } from 'app/main-server/api/v1';
import { SocketService } from 'app/service/socket.service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  @Output() enterRoom = new EventEmitter<number>();

  rooms!: RoomInfo[];

  constructor(
    private socketService: SocketService,
    private lobbyService: LobbyService,
    private debugService: DebugService,
    private mainService: MainService,

    private location: Location,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    const debugResponse = await this.debugService.test();
    await this.socketService.connect(debugResponse.gameServerUrl);

    this.rooms = await this.lobbyService.getRooms();
  }

  onBackClick() {
    this.mainService.openScreen(MainScreen.MENU);
  }

  onJoinRoom(roomId: number) {
    this.enterRoom.emit(roomId);
  }

  async onCreateRoom() {
    const room = await this.lobbyService.createRoom();
    this.enterRoom.emit(room.id);

    this.onRefresh(); // refresh is unnecessary when the GUI is implemented later
  }

  async onRefresh() {
    this.rooms = await this.lobbyService.getRooms();
  }

  async onRoomClick(room: RoomInfo) {
    await this.lobbyService.joinRoom(room.id);
    this.enterRoom.emit(room.id);
  }
}
