import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientGame } from '@shared/game/engine/game/client-game';
import { GameResult } from '@shared/game/engine/game/game-result';
import { LocalPlayer } from '@shared/game/engine/player/local-player';
import { GameRecorder } from '@shared/game/engine/recorder/game-recorder';
import { GameReplay } from '@shared/game/engine/recorder/game-replay';
import { ServerEvent } from '@shared/game/network/model/event/server-event';
import { RoomInfo } from '@shared/model/room/room-info';
import { RoomService } from 'app/game-server/room.service';
import { MainService } from 'app/view/main/main.service';
import { Subscription } from 'rxjs';
import {saveAs} from 'file-saver';
import { format } from 'date-fns';
import { StartGameData } from '@shared/game/network/model/start-game/start-game-data';
import { MainScreen } from 'app/view/main/main-screen';
import { playerRule, PlayerRule } from '@shared/game/engine/model/rule/player-rule/player-rule';
import { RoomSettings } from '@shared/game/engine/model/room-settings';
import { musicService } from 'app/pixi/display/sound/music-service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private roomId!: number;
  roomInfo!: RoomInfo;
  lastGameReplay?: GameReplay;
  debug = false; //!environment.production;

  private subscriptions: Subscription[] = [];

  private game!: ClientGame;

  showSettings = false;

  playerRule: PlayerRule = JSON.parse(JSON.stringify(playerRule));
  
  @ViewChild('pixiTarget') private pixiTarget!: ElementRef<HTMLDivElement>;

  constructor(
    private roomService: RoomService,
    private mainService: MainService,
  ) {}

  getSessionId() {
    return this.mainService.sessionInfo.sessionId;
  }

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
    if (this.roomInfo.gameState?.running) {
      const game = new ClientGame(this.roomInfo.gameState.startGameData, undefined);
      game.load(this.roomInfo.gameState);
      this.game = game;
      this.startGame();
    } else {
      setTimeout(() => {
        this.mainService.movePixiContainer(this.pixiTarget.nativeElement);
      });
    }
  }

  onStartGameClick() {
    this.roomService.startGame();
  }

  async onBackClick() {
    await this.roomService.leave();
    this.game.destroy();
    this.mainService.openScreen(MainScreen.LOBBY);
  }

  isRunning() {
    return !!(this.game?.running);
  }

  onRecvStartGame(startGameData: StartGameData) {
    // destroy last game
    if (this.game) {
      this.game.destroy();
    }
    
    // start new game
    const localPlayerIndex = startGameData.players.findIndex(p => p.clientInfo.sessionId == this.mainService.sessionInfo.sessionId);
    this.game = new ClientGame(startGameData, localPlayerIndex);
    this.startGame();

    // if not spectator, setup local player
    if (localPlayerIndex != -1) {
      const localPlayer = this.game.players[localPlayerIndex] as LocalPlayer;
      localPlayer.eventsSubject.subscribe(clientEvent => this.roomService.flushGameEvents(clientEvent));
      localPlayer.gameOverSubject.subscribe(() => this.onLocalPlayerDeath());
      this.mainService.pixi.keyboard.bindToPlayer(localPlayer);
      this.mainService.pixi.keyboard.enabled = true;
    }
    
    // record game replay
    const recorder = new GameRecorder(this.game);
    this.game.gameOverSubject.subscribe(r => this.lastGameReplay = recorder.asReplay());
  }

  private startGame() {
    this.game.start();
    this.mainService.pixi.bindGame(this.game);
    musicService.setVolumeGame();
    this.mainService.gameView = true;
    this.mainService.movePixiContainer(undefined);
  }

  onRecvServerEvent(serverEvent: ServerEvent) {
    if (this.roomId == serverEvent.roomId) {
      this.game.handleServerEvent(serverEvent);
    }
  }

  async onRecvGameOver(gameResult: GameResult) {
    musicService.setVolumeMenu();
    this.mainService.gameView = false;
    this.mainService.pixi.keyboard.enabled = false;
    this.mainService.animatePixiContainer(this.pixiTarget.nativeElement);
  }

  setGameView(gameView: boolean) {
    this.mainService.gameView = gameView;
    if (gameView) {
      this.mainService.movePixiContainer(undefined);
    } else {
      this.mainService.animatePixiContainer(this.pixiTarget.nativeElement);
    }
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
    saveAs(new Blob([JSON.stringify(this.lastGameReplay!)]), `CM-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
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

  async onDownloadGameStateClick() {
    const roomInfo = await this.roomService.getRoomInfo(this.roomId);
    saveAs(new Blob([JSON.stringify(roomInfo!.gameState)]), `CM-Server-State-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
  }

  private downloadServerReplay() {
    saveAs(new Blob([JSON.stringify(this.lastGameReplay)]), `CM-Server-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
  }

  isHost() {
    return this.mainService.sessionInfo.sessionId == this.roomInfo.host.sessionId;
  }



  onSettingsClick() {
    this.showSettings = true;
  }

  onCancelSettings() {
    this.showSettings = false;
  }

  onSaveSettings(settings: RoomSettings) {
    this.showSettings = false;
    this.roomService.changeRoomSettings(settings);
  }
}
