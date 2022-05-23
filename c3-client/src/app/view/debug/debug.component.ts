import { Component, OnInit } from '@angular/core';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { RoomInfo } from '@shared/model/room/room-info';
import { ExampleSharedClass } from '@shared/test-shared';
import { DebugService } from 'app/main-server/api/v1';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  example = new ExampleSharedClass();

  connected = false;
  mainServerDebugMessage?: string;
  gameServerDebugMessage?: string;

  constructor(
    private debugService: DebugService,
  ) { }

  async ngOnInit() {
    const debugResponse = await this.debugService.test();
    this.mainServerDebugMessage = debugResponse.debugMessage;
    
    const socket = io(debugResponse.gameServerUrl, { withCredentials: true });

    socket.on('connect', () => {
      this.connected = true;
      socket.emit('debugMessage', 'Hello from a client.');

      socket.emit(LobbyEvent.GET_ROOMS, (response: RoomInfo[]) => {
        console.log('Get rooms result:', response);

        socket.emit(LobbyEvent.CREATE_ROOM, (response: any) => {
          console.log('Create room result:', response);

          socket.emit(LobbyEvent.GET_ROOMS, (response: RoomInfo[]) => {
            console.log('Get rooms result:', response)
          });
        });
      });
    });

    socket.on('debugMessage', data => {
      this.gameServerDebugMessage = data;
    });

    socket.on(LobbyEvent.ROOM_INFO, (roomInfo: RoomInfo) => {
      console.log('Room Info updated:', roomInfo);
    });
  }
}
