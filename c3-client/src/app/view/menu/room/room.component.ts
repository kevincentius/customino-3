import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientGame } from '@shared/game/engine/game/client-game';
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
import { RoomSettings } from '@shared/game/engine/model/room-settings';
import { musicService } from 'app/pixi/display/sound/music-service';
import { PlayerInfo } from '@shared/game/engine/player/player-info';
import { PlayerStats } from '@shared/game/engine/player/stats/player-stats';
import { InputState } from 'app/control/keyboard';
import { getLocalSettings } from 'app/service/user-settings/user-settings.service';
import { ChatContainerComponent } from 'app/view/chat/chat-container/chat-container.component';
import { timeoutWrapper } from 'app/util/ng-zone-util';
import { ChatMessage } from '@shared/model/room/chat-message';
import { RoomAutoStartCountdownComponent } from '../room-auto-start-countdown/room-auto-start-countdown.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnDestroy {
  debug = false; //!environment.production;

  @ViewChild('chat', { static: false }) chat!: ChatContainerComponent;
  chatMessageInput = '';
  chatMessages: ChatMessage[] = [];

  @ViewChild('autoStartCountdown', { static: false }) autoStartCountdown!: RoomAutoStartCountdownComponent;
  countdownEndMs?: number;

  private subscriptions: Subscription[] = [];

  private roomId!: number;

  private game?: ClientGame;
  recorder?: GameRecorder;

  // VIEW MODEL
  roomInfo!: RoomInfo;
  showRoomGui = false;
  showSettings = false;

  lastGameReplay?: GameReplay;
  lastGameStats?: { playerInfo: PlayerInfo; stats: PlayerStats; }[];

  getSessionId() { return this.mainService.sessionInfo.sessionId; }
  canStartGame() { return !this.isRunning() && this.isHost() && this.isPlayersReady(); }
  isPlayersReady() { return this.roomInfo.slots.filter(slot => slot.settings.playing).length > 0; }
  isRunning() { return !!(this.game?.running); }
  isHost() { return this.roomInfo.host != null && this.roomInfo.host.sessionId == this.mainService.sessionInfo.sessionId; }
  isSpectator() { return !this.roomInfo.slots.filter(slot => slot.player.sessionId == this.getSessionId())[0].settings.playing; }
  // ---------

  constructor(
    private roomService: RoomService,
    public mainService: MainService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    window!.onkeydown = (ev: KeyboardEvent) => {
      let handled = true;
      if (ev.key == 'F2' && !(this.game && this.game.running)) {
        this.onStartGameClick();
      } else if (ev.key == '`' && this.game) {
        this.setShowRoomGui(!this.showRoomGui);
      } else if (ev.key == 'F8') {
        this.mainService.pixi.togglePerformanceDisplay();
      } else {
        handled = false;
      }

      if (handled) {
        ev.stopPropagation();
        ev.preventDefault();
      }
    };
  }

  ngAfterViewInit() {
    this.subscriptions.push(... [
      this.roomService.roomInfoSubject.subscribe(roomInfo => {
        if (this.roomId == roomInfo.id) {
          this.updateRoomInfo(roomInfo);
        }
      }),

      this.roomService.roomChatMessageSubject.subscribe(chatMessage => {
        this.chatMessages.push(chatMessage);
        this.chat?.refresh();
      }),

      this.roomService.startGameSubject.subscribe(this.onRecvStartGame.bind(this)),
      this.roomService.serverEventSubject.subscribe(this.onRecvServerEvent.bind(this)),
      this.roomService.gameOverSubject.subscribe(this.onRecvGameOver.bind(this)),
    ]);
  }

  private updateRoomInfo(roomInfo: RoomInfo) {
    console.log(roomInfo);
    this.roomInfo = roomInfo;
    this.countdownEndMs = this.roomInfo.autoStartMs == undefined ? undefined : Date.now() + this.roomInfo.autoStartMs;
    this.autoStartCountdown?.updateCountdown(this.countdownEndMs);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async show(roomId: number) {
    this.roomId = roomId;
    this.roomInfo = undefined!;
    this.lastGameStats = undefined;
    this.showRoomGui = false;
    this.cd.detectChanges();

    const roomInfo = (await this.roomService.getRoomInfo(this.roomId))!;
    
    this.showRoomGui = true;
    this.showSettings = false;
    this.updateRoomInfo(roomInfo);

    if (this.roomInfo.gameState?.running) {
      const game = new ClientGame(timeoutWrapper(this.ngZone), this.roomInfo.gameState.startGameData, getLocalSettings().localRule, undefined);
      game.load(this.roomInfo.gameState);
      this.game = game;
      this.startGame();
    }
  }

  setShowRoomGui(showRoomGui: boolean) {
    this.showRoomGui = showRoomGui;
    this.mainService.pixi.keyboard.setEnabled(!this.showRoomGui);
    this.cd.detectChanges();
  }

  downloadDebug() {
    if (this.game) {
      saveAs(new Blob([JSON.stringify(this.recorder!.asReplay())]), `CM-Debug-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
    }
  }

  async onBackClick() {
    await this.roomService.leave();
    if (this.game) {
      this.game.destroy();
      this.game = undefined;
    }
    this.mainService.openScreen(MainScreen.LOBBY);
  }

  private startGame() {
    this.game!.start();
    this.mainService.pixi.bindGame(this.game!);
    musicService.setVolumeGame(this.ngZone);

    this.showRoomGui = false;
    this.cd.detectChanges();
  }

  onStartGameClick() {
    this.roomService.startGame();
  }

  onRecvStartGame(startGameData: StartGameData) {
    // destroy last game
    if (this.game) {
      this.game.destroy();
    }
    
    // start new game
    const localPlayerIndex = startGameData.players.findIndex(p => p.clientInfo.sessionId == this.mainService.sessionInfo.sessionId);
    this.game = new ClientGame(timeoutWrapper(this.ngZone), startGameData, getLocalSettings().localRule, localPlayerIndex);
    this.startGame();

    // if not spectator, setup local player
    if (localPlayerIndex != -1) {
      const localPlayer = this.game.players[localPlayerIndex] as LocalPlayer;
      localPlayer.eventsSubject.subscribe(clientEvent => this.roomService.flushGameEvents(clientEvent));
      localPlayer.gameOverSubject.subscribe(() => this.mainService.pixi.keyboard.state = InputState.DISABLED);
      this.mainService.pixi.keyboard.bindToPlayer(localPlayer);
      this.mainService.pixi.keyboard.state = InputState.PRECLOCK;
      this.game.clockStartSubject.subscribe(() => this.mainService.pixi.keyboard.state = InputState.ENABLED);
    }
    
    // record game replay
    this.recorder = new GameRecorder(this.game);
    this.game.gameOverSubject.subscribe(r => this.lastGameReplay = this.recorder!.asReplay());
  }

  onRecvServerEvent(serverEvent: ServerEvent) {
    if (this.roomId == serverEvent.roomId) {
      this.game!.handleServerEvent(serverEvent);
    }
  }

  async onRecvGameOver(roomInfo: RoomInfo) {
    musicService.setVolumeMenu(this.ngZone);
    this.mainService.pixi.keyboard.state = InputState.DISABLED;

    // update stats
    this.lastGameStats = this.game!.players.map(player => ({
      playerInfo: player.playerInfo,
      stats: player.statsTracker.stats,
    }));

    this.updateRoomInfo(roomInfo);

    setTimeout(() => {
      this.showRoomGui = true;
      this.cd.detectChanges();
    }, 500);
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

  onResetScoresClick() {
    this.roomService.resetScores();
  }

  onSettingsClick() {
    this.showSettings = true;
    this.cd.detectChanges();
  }

  onCancelSettings() {
    this.showSettings = false;
    this.cd.detectChanges();
  }

  onSaveSettings(settings: RoomSettings) {
    this.showSettings = false;
    this.roomService.changeRoomSettings(settings);
    this.cd.detectChanges();
  }

  // spectator mode
  onToggleSpectatorModeClick() {
    this.roomService.setSpectatorMode(!this.isSpectator())
  }
}
