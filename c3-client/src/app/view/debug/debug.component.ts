import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ExampleSharedClass } from '@shared/test-shared';
import { DebugService } from 'app/main-server/api/v1';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    });

    socket.on('debugMessage', data => {
      this.gameServerDebugMessage = data;
    });
  }
}
