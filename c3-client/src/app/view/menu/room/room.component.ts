import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '@shared/game/engine/game/game';
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

      this.roomService.startGameSubject.subscribe((startGameData: StartGameData) => {
        this.game = new Game(startGameData);
        this.game.start();
        this.mainService.pixi.bindGame(this.game);
        if (startGameData.localPlayerIndex != null) {
          this.mainService.pixi.keyboard.enabled = true;
          this.mainService.pixi.keyboard.bindToPlayer(this.game.players[startGameData.localPlayerIndex!]);
        }
        this.mainService.displayGui = false;
      }),
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
}
