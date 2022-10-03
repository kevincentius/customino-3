import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RoomInfo } from '@shared/model/room/room-info';
import { LobbyService } from 'app/game-server/lobby.service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements OnInit {
  @Output() enterRoom = new EventEmitter<number>();

  rooms!: RoomInfo[];

  constructor(
    private lobbyService: LobbyService,
    private mainService: MainService,

    private cd: ChangeDetectorRef,
  ) {
  }

  async ngOnInit() {
  }

  onBackClick() {
    this.mainService.openScreen(MainScreen.MENU);
    soundService.play('back');
  }

  onJoinRoom(roomId: number) {
    this.enterRoom.emit(roomId);
    soundService.play('button', 0, 2);
  }

  async onCreateRoom() {
    const room = await this.lobbyService.createRoom();
    this.enterRoom.emit(room.id);

    this.onRefresh(); // refresh is unnecessary when the GUI is implemented later
    soundService.play('button', 0, 2);
  }

  async onRefresh() {
    this.rooms = await this.lobbyService.getRooms();
    this.cd.detectChanges();
  }

  async onRoomClick(room: RoomInfo) {
    await this.lobbyService.joinRoom(room.id);
    this.enterRoom.emit(room.id);
    soundService.play('button', 0, 2);
  }
}
