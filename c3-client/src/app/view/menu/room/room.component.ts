import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientGame } from '@shared/game/engine/game/client-game';
import { Game } from '@shared/game/engine/game/game';
import { GameResult } from '@shared/game/engine/game/game-result';
import { LocalPlayer } from '@shared/game/engine/player/local-player';
import { GameRecorder } from '@shared/game/engine/recorder/game-recorder';
import { GameReplay } from '@shared/game/engine/recorder/game-replay';
import { ServerEvent } from '@shared/game/network/model/event/server-event';
import { StartGameData } from '@shared/game/network/model/start-game-data';
import { RoomInfo } from '@shared/model/room/room-info';
import { RoomService } from 'app/game-server/room.service';
import { MainService } from 'app/view/main/main.service';
import { Subscription } from 'rxjs';
import {saveAs} from 'file-saver';
import { format } from 'date-fns';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private roomId!: number;
  roomInfo!: RoomInfo;
  lastGameReplay?: GameReplay;
  debug = !environment.production;

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
      this.roomService.gameOverSubject.subscribe(this.onRecvGameOver.bind(this)),
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
    
    this.game = new ClientGame(startGameData);
    this.game.start();
    this.mainService.pixi.bindGame(this.game);
    if (startGameData.localPlayerIndex != null) {
      const localPlayer = this.game.players[startGameData.localPlayerIndex] as LocalPlayer;
      localPlayer.eventsSubject.subscribe(clientEvent => this.roomService.flushGameEvents(clientEvent));
      localPlayer.gameOverSubject.subscribe(() => this.onLocalPlayerDeath());
      this.mainService.pixi.keyboard.bindToPlayer(localPlayer);
      this.mainService.pixi.keyboard.enabled = true;
    }
    this.mainService.displayGui = false;
    
    const recorder = new GameRecorder(this.game);
    this.game.gameOverSubject.subscribe(r => this.lastGameReplay = recorder.asReplay());
  }

  onRecvServerEvent(serverEvent: ServerEvent) {
    console.log(JSON.stringify(serverEvent));
    if (this.roomId == serverEvent.roomId) {
      for (const playerEvent of serverEvent.playerEvents) {
        this.game.players[playerEvent.playerIndex].handleEvent(playerEvent.clientEvent);
      }
    }
  }

  async onRecvGameOver(gameResult: GameResult) {
    this.mainService.displayGui = true;
    this.mainService.pixi.keyboard.enabled = false;
  }

  onLocalPlayerDeath() {
    this.mainService.pixi.keyboard.enabled = false;
  }

  async onDownloadLastReplayClick() {
    this.downloadLocalReplay();
    if (this.debug) {
      this.downloadServerReplay();
    }
  }

  private downloadLocalReplay() {
    saveAs(new Blob([JSON.stringify(this.lastGameReplay!)]), `C3-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
  }

  async onVerifyLastReplayClick() {
    const serverReplay = await this.roomService.getReplay();
    if (!serverReplay) {
      console.error('Unable to verify replay because server replay debug mode is not active (null replay received).');
    } else if (JSON.stringify(serverReplay) !== JSON.stringify(this.lastGameReplay)) {
      console.error('Server replay differs from local replay!');
      this.downloadLocalReplay();
      this.downloadServerReplay();
    } else {
      console.log('Replay verified.');
    }
  }

  private downloadServerReplay() {
    saveAs(new Blob([JSON.stringify(this.lastGameReplay!)]), `C3-Server-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
  }
}
