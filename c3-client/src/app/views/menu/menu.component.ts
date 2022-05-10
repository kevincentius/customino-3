import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DebugResponse } from '@shared/debug-response';
import { ExampleSharedClass } from '@shared/test-shared';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  example = new ExampleSharedClass();

  connected = false;
  mainServerDebugMessage?: string;
  gameServerDebugMessage?: string;

  constructor(
    private httpClient: HttpClient,
  ) { }

  async ngOnInit() {
    const debugResponse = await firstValueFrom(this.httpClient.get(`${environment.mainServerUrl}/api/debug`)) as DebugResponse;
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
