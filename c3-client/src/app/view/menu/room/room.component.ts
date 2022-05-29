import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '@shared/game/engine/game/game';
import { LocalPlayer } from '@shared/game/engine/player/local-player';
import { ServerEvent } from '@shared/game/network/model/event/server-event';
import { StartGameData } from '@shared/game/network/model/start-game-data';
import { RoomInfo } from '@shared/model/room/room-info';
import { RoomService } from 'app/game-server/room.service';
import { MainService } from 'app/view/main/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private roomId!: number;
  roomInfo!: RoomInfo;

  private subscriptions: Subscription[] = [];

  private game!: Game;

  constructor(
    private roomService: RoomService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(... [
      this.roomService.roomInfoSubject.subscribe(roomInfo => {
        if (this.roomId == roomInfo.id) {
          this.roomInfo = roomInfo;
        }
      }),

      this.roomService.startGameSubject.subscribe(this.onRecvStartGame.bind(this)),
      this.roomService.serverEventSubject.subscribe(this.onRecvServerEvent.bind(this)),
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async show(roomId: number) {
    this.roomId = roomId;
    this.roomInfo = (await this.roomService.getRoomInfo(roomId))!;
  }

  onStartGameClick() {
    this.roomService.startGame();
  }

  isRunning() {
    return !!(this.game?.running);
  }

  onRecvStartGame(startGameData: StartGameData) {
    if (this.game) {
      this.game.destroy();
    }
    
    this.game = new Game(startGameData);
    this.game.start();
    this.mainService.pixi.bindGame(this.game);
    if (startGameData.localPlayerIndex != null) {
      const localPlayer = this.game.players[startGameData.localPlayerIndex] as LocalPlayer;
      localPlayer.eventsSubject.subscribe(clientEvent => this.roomService.flushGameEvents(clientEvent));
      this.mainService.pixi.keyboard.bindToPlayer(localPlayer);
      this.mainService.pixi.keyboard.enabled = true;
    }
    this.mainService.displayGui = false;
  }

  onRecvServerEvent(serverEvent: ServerEvent) {
    if (this.roomId == serverEvent.roomId) {
      for (const playerEvent of serverEvent.playerEvents) {
        this.game.players[playerEvent.playerIndex].handleEvent(playerEvent.clientEvent);
      }
    }
  }
}
