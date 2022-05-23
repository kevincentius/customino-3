import { Component, ViewChild } from "@angular/core";
import { MainService } from "app/view/main/main.service";
import { LobbyComponent } from "app/view/menu/lobby/lobby.component";
import { RoomComponent } from "app/view/menu/room/room.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MainService],
})
export class MainComponent {

  @ViewChild('lobby', { static: true })
  private lobby!: LobbyComponent;
  
  @ViewChild('room', { static: true })
  private room!: RoomComponent;

  onEnterRoom(roomId: number) {
    this.room.show(roomId);
  }
}
