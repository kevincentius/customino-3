import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { RoomSlotInfo } from '@shared/model/room/room-slot-info';
import { EnterLeaveTransition } from 'app/view/util/enter-leave-transition';
import { InputState } from 'app/control/keyboard';
import { getLocalSettings } from 'app/service/user-settings/user-settings.service';
import { soloStyle, teamStyles } from 'app/style/team-styles';
import { ChatContainerComponent } from 'app/view/chat/chat-container/chat-container.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  @ViewChild('chat', { static: false }) chat!: ChatContainerComponent;

  private roomId!: number;
  roomInfo!: RoomInfo;
  lastGameReplay?: GameReplay;
  debug = false; //!environment.production;

  private subscriptions: Subscription[] = [];

  private game?: ClientGame;
  recorder?: GameRecorder;

  showSettings = false;

  // playerRule: PlayerRule = {...getDefaultRoomRule(), ...getLocalSettings().localRule};
  
  lastGameStats?: { playerInfo: PlayerInfo; stats: PlayerStats; }[];

  displayComboCount = 5;

  enterLeaveTransition = new EnterLeaveTransition(250);

  waitForTeamChange = false;

  chatMessageInput = '';

  constructor(
    private roomService: RoomService,
    public mainService: MainService,
  ) {
    window!.onkeydown = (ev: KeyboardEvent) => {
      let handled = true;
      if (ev.key == 'F2' && !(this.game && this.game.running)) {
        this.onStartGameClick();
      } else if (ev.key == '`' && this.game) {
        this.setHideGui(this.enterLeaveTransition.state);
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

  getSessionId() {
    return this.mainService.sessionInfo.sessionId;
  }

  ngOnInit() {
    this.subscriptions.push(... [
      this.roomService.roomInfoSubject.subscribe(roomInfo => {
        console.log('received roomInfo', roomInfo);
        if (this.roomId == roomInfo.id) {
          this.roomInfo = roomInfo;
        }
      }),

      this.roomService.roomChatMessageSubject.subscribe(chatMessage => this.chat.pushChatMessage(chatMessage)),

      this.roomService.startGameSubject.subscribe(this.onRecvStartGame.bind(this)),
      this.roomService.serverEventSubject.subscribe(this.onRecvServerEvent.bind(this)),
      this.roomService.gameOverSubject.subscribe(this.onRecvGameOver.bind(this)),
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setHideGui(hideGui: boolean) {
    this.enterLeaveTransition.setState(!hideGui);
    this.mainService.pixi.keyboard.setEnabled(!hideGui);
  }

  async show(roomId: number) {
    this.showSettings = false;
    this.waitForTeamChange = false;
    this.roomId = roomId;
    this.lastGameStats = undefined;
    this.roomInfo = undefined!;
    this.roomInfo = (await this.roomService.getRoomInfo(roomId))!;
    if (this.roomInfo.gameState?.running) {
      const game = new ClientGame(this.roomInfo.gameState.startGameData, getLocalSettings().localRule, undefined);
      game.load(this.roomInfo.gameState);
      this.game = game;
      this.startGame();
    } else {
      this.setHideGui(false);
    }
  }

  isPlayersReady() {
    return this.roomInfo.slots.filter(slot => slot.settings.playing).length > 0;
  }

  onStartGameClick() {
    this.roomService.startGame();
  }

  async onBackClick() {
    await this.roomService.leave();
    if (this.game) {
      this.game.destroy();
      this.game = undefined;
    }
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
    this.game = new ClientGame(startGameData, getLocalSettings().localRule, localPlayerIndex);
    this.startGame();

    // if not spectator, setup local player
    if (localPlayerIndex != -1) {
      const localPlayer = this.game.players[localPlayerIndex] as LocalPlayer;
      localPlayer.eventsSubject.subscribe(clientEvent => this.roomService.flushGameEvents(clientEvent));
      localPlayer.gameOverSubject.subscribe(() => this.onLocalPlayerDeath());
      this.mainService.pixi.keyboard.bindToPlayer(localPlayer);
      this.mainService.pixi.keyboard.state = InputState.PRECLOCK;
      this.game.clockStartSubject.subscribe(() => this.mainService.pixi.keyboard.state = InputState.ENABLED);
    }
    
    // record game replay
    this.recorder = new GameRecorder(this.game);
    this.game.gameOverSubject.subscribe(r => this.lastGameReplay = this.recorder!.asReplay());
  }

  private startGame() {
    this.game!.start();
    this.mainService.pixi.bindGame(this.game!);
    musicService.setVolumeGame();
    this.setHideGui(true);
  }

  onRecvServerEvent(serverEvent: ServerEvent) {
    if (this.roomId == serverEvent.roomId) {
      this.game!.handleServerEvent(serverEvent);
    }
  }

  async onRecvGameOver(roomInfo: RoomInfo) {
    musicService.setVolumeMenu();
    this.mainService.pixi.keyboard.state = InputState.DISABLED;

    // update stats
    this.lastGameStats = this.game!.players.map(player => ({
      playerInfo: player.playerInfo,
      stats: player.statsTracker.stats,
    }));

    this.roomInfo = roomInfo;

    setTimeout(() => this.setHideGui(false), 500);
  }

  onLocalPlayerDeath() {
    this.mainService.pixi.keyboard.state = InputState.DISABLED;
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


  onResetScoresClick() {
    this.roomService.resetScores();
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

  // gui binding  
  getLastGameStats(slot: RoomSlotInfo) {
    return this.game == null ? null
      : this.game.players
        .filter(p => p.playerInfo.name == slot.player.username)
        .map(p => p.statsTracker.stats);
  }

  // gui binding
  getCombos(stats: PlayerStats) {
    const sortedCombos = Array.from(stats.combos.entries())
      .map(e => ({combo: parseInt(e[0].substring(1)), times: e[1]}))
      .sort((a, b) => b.combo - a.combo);
    
    const ret = [];
    
    for (let combos of sortedCombos) {
      for (let i = 0; i < combos.times; i++) {
        ret.push(combos.combo);

        if (ret.length >= this.displayComboCount) { break }
      }
      if (ret.length >= this.displayComboCount) { break }
    }

    return ret;
  }

  downloadDebug() {
    if (this.game) {
      saveAs(new Blob([JSON.stringify(this.recorder!.asReplay())]), `CM-Debug-Replay-${format(new Date(), 'yyyy-MM-dd-HH-mm:ss.SSS')}.json`);
    }
  }

  getTeamTextColor(team: number | null) {
    return '#' + (team == null ? soloStyle : teamStyles[team]).roomTextColor.toString(16).padStart(6, '0');
  }

  getTeamBgColor(team: number | null) {
    return '#' + (team == null ? soloStyle : teamStyles[team]).roomIconColor.toString(16).padStart(6, '0');
  }

  onTeamIconClick(slotIndex: number) {
    if (this.isHost()) {
      const prevTeam = this.roomInfo.slots[slotIndex].settings.team;
      const team = prevTeam == null ? 0
        : prevTeam == teamStyles.length - 1 ? null
        : prevTeam + 1;

      this.roomService.changeSlotTeam(slotIndex, team);
    }
  }

  // spectator mode
  isSpectator() {
    return !this.roomInfo.slots.filter(slot => slot.player.sessionId == this.getSessionId())[0].settings.playing;
  }

  onToggleSpectatorModeClick() {
    this.roomService.setSpectatorMode(!this.isSpectator())
  }
  // --------------
}
