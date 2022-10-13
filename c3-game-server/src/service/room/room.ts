import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { ServerEvent } from "@shared/game/network/model/event/server-event";
import { LobbyEvent } from "@shared/model/room/lobby-event";
import { RoomInfo } from "@shared/model/room/room-info";
import { RoomSlot } from "service/room/room-slot";
import { ServerGame } from "game/server-game";
import { Session } from "service/session/session";
import { GameEventType } from "@shared/game/network/model/event/game-event";
import { SystemEvent } from "@shared/game/network/model/event/system-event";
import { GameReplay } from "@shared/game/engine/recorder/game-replay";
import { GameRecorder } from "@shared/game/engine/recorder/game-recorder";
import { StartGameData } from "@shared/game/network/model/start-game/start-game-data";
import { RandomGen } from "@shared/game/engine/util/random-gen";
import { RoomSettings } from "@shared/game/engine/model/room-settings";
import { getDefaultRoomRule } from "@shared/game/engine/model/rule/room-rule/room-rule";
import { SessionService } from "service/session/session-service";
import { StartPlayerData } from "@shared/game/network/model/start-game/start-player-data";
import { ChatMessage } from "@shared/model/room/chat-message";
import { RoomAutoStart } from "./room-auto-start";
import { Subject } from "rxjs";
import { GameStatsService } from "main-server/api/v1";
import { ClientInfo } from "@shared/model/session/client-info";
import { p } from "service/util/api-util";
import { GameResult } from "@shared/game/engine/game/game-result";

export class Room {
  slotsChangeSubject = new Subject<void>(); // roomInfo must be broadcast right after this subject is emitted due to change by RoomAutoStart
  gameOverSubject = new Subject<void>();

  createdAt = Date.now();
  lastActivity = Date.now();
  slots: RoomSlot[];
  settings: RoomSettings = {
    gameRule: { 
      roomRule: getDefaultRoomRule(),
    },
  };
  host!: Session | null;

  provideReplay = true;
  lastGameReplay?: GameReplay;

  autoStart = new RoomAutoStart(this);
  // only for the current game session:
  game?: ServerGame;
  r = new RandomGen();

  constructor(
    public id: number,
    public name: string,
    public creator: Session | null,
    private sessionService: SessionService,
    private gameStatsService: GameStatsService,
    private gameModeSeasonId?: number,
  ) {
    this.slots = creator == null ? [] : [new RoomSlot(creator)];
    this.host = creator;

    if (creator == null) {
      this.autoStart.configure(15000);
    }
  }

  leave(session: Session) {
    const prevSlotCount = this.slots.length;
    this.slots = this.slots.filter(slot => slot.session !== session);

    if (this.isRunning()) {
      const playerIndex = this.game!.players.findIndex(p => p.startPlayerData.clientInfo.sessionId == session.sessionId);
      
      // if a player leaves, treat him as dead in the game
      if (playerIndex != -1) {
        this.killPlayer(playerIndex);
      }
    }

    if (this.slots.length != prevSlotCount) {
      this.slotsChangeSubject.next();
      this.broadcastRoomInfo();
    }
  }

  killPlayer(playerIndex: number) {
    this.game!.players[playerIndex].die();

    const frame = this.game!.players[playerIndex].frame;
    const serverEvent: ServerEvent = {
      roomId: this.id,
      playerEvents: [{
        playerIndex: playerIndex,
        clientEvent: {
          gameEvents: [{
            frame: frame,
            timestamp: -1,
            type: GameEventType.SYSTEM,
            gameOver: true,
          } as SystemEvent],
          frame: frame + 1,
        },
      }]
    };
    this.slots.forEach(slot => {
      slot.session.socket.emit(LobbyEvent.SERVER_EVENT, serverEvent);
    });
  }

  abortGame() {
    this.game!.abort();
    this.slots.forEach(slot => slot.session.socket.emit(LobbyEvent.ABORT_GAME));
  }

  join(session: Session) {
    if (!this.isInRoom(session)) {
      this.slots.push(new RoomSlot(session));
      this.slotsChangeSubject.next();
      this.broadcastRoomInfo();
    }
  }

  startGame(session: Session | null) {
    if ((session == null || (this.host == session && this.isInRoom(session))) && this.canStartGame()) {
      const playerSlots = this.slots.filter(slot => slot.settings.playing);
      this.slots.forEach(slot => slot.playerIndex = null);
      playerSlots.forEach((playerSlot, index) => playerSlot.playerIndex = index);

      const players = playerSlots.map(slot => slot.session.getClientInfo());
      
      const globalSeed = this.r.int();
      
      const startGameData: StartGameData = {
        roomRule: this.settings.gameRule.roomRule,
        players: playerSlots.map(slot => {
          const clientInfo = slot.session.getClientInfo()
          const startPlayerData: StartPlayerData = {
            clientInfo: clientInfo,
            randomSeed: globalSeed,
            slotSettings: slot.settings,
            userRule: this.sessionService.getSessionById(clientInfo.sessionId).userRule,
          };
          return startPlayerData;
        }),
        randomSeed: this.r.int(),
      }

      // broadcast the start of game
      this.slots.forEach(slot => slot.session.socket.emit(LobbyEvent.START_GAME, startGameData));

      // start server game
      if (this.game) {
        this.game.destroy();
      }
      this.game = this.createNewGame(startGameData, players);

    }
  }

  private createNewGame(startGameData: StartGameData, players: ClientInfo[]) {
    p(this.gameStatsService.test()).then(c => console.log('test', c));

    const game = new ServerGame(startGameData, players);

    game.gameOverSubject.subscribe(gameResult => {
      if (this.gameModeSeasonId) {
        const accountIdsByRanking = this.slots
          .filter(slot => slot.playerIndex != null && slot.session.accountId != null)
          .map(slot => ({
            accountId: slot.session.getClientInfo().accountId,
            rank: gameResult.players[slot.playerIndex!].rank,
          }))
          .sort((a, b) => a.rank - b.rank)
          .map(x => x.accountId!);

        // no await here - continue game
        p(this.gameStatsService.postGameResult(JSON.parse(JSON.stringify({
          accountIdsByRanking: accountIdsByRanking,
          gameModeSeasonId: this.gameModeSeasonId,
        }))));
      }

      for (const slot of this.slots) {
        if (slot.playerIndex != null) {
          slot.addScore(gameResult.players[slot.playerIndex].score);
          slot.updateStats(game!.players[slot.playerIndex].statsTracker.stats);
        }
      }

      this.kickAfkPlayers(gameResult);

      this.gameOverSubject.next();

      for (const slot of this.slots) {
        slot.session.socket.emit(LobbyEvent.GAME_OVER, this.getRoomInfo());
      }
    });

    for (const player of game.players) {
      player.serverEventSubject.subscribe(map => {
        this.slots.forEach(slot => {
          const serverPlayerEvent = map.get(slot.playerIndex == null ? -1 : slot.playerIndex);
          if (serverPlayerEvent) {
            const serverEvent: ServerEvent = {
              roomId: this.id,
              playerEvents: [serverPlayerEvent],
            };
            slot.session.socket.emit(LobbyEvent.SERVER_EVENT, serverEvent);

            if (serverPlayerEvent.serverEvent?.disconnect == true && slot.playerIndex == serverPlayerEvent.playerIndex) {
              console.log('disconnect drop player');
              this.postChatMessage(null, `${slot.session.username} was dropped from the round due to lag.`);
            }
          }
        });
      });
    }

    // debug replay
    if (this.provideReplay) {
      const recorder = new GameRecorder(game);
      game.gameOverSubject.subscribe(gameResult => {
        this.lastGameReplay = recorder.asReplay();
      });
    }

    game.start();
    return game;
  }

  private kickAfkPlayers(gameResult: GameResult) {
    let slotsChanged = false;
    this.slots.forEach(slot => {
      if (slot.playerIndex != null && gameResult.players[slot.playerIndex].afk) {
        slot.settings.playing = false;
        slotsChanged = true;
      }
    });
    if (slotsChanged) {
      this.slotsChangeSubject.next();
    }
  }

  changeRoomSettings(session: Session | null, roomSettings: RoomSettings) {
    if (this.host == session) {
      this.settings = roomSettings;
      this.broadcastRoomInfo();
    }
  }

  changeSlotTeam(session: Session, slotIndex: number, team: number) {
    if (this.host == session && this.slots.length > slotIndex) {
      const slot = this.slots[slotIndex];
      if (slot.settings.team != team) {
        this.slots[slotIndex].settings.team = team;
        this.slotsChangeSubject.next();
        this.broadcastRoomInfo();
      }
    }
  }
  
  setSpectatorMode(session: Session, spectator: boolean) {
    const slot = this.slots.filter(slot => slot.session == session)[0];
    if (slot) {
      slot.settings.playing = !spectator;
      this.slotsChangeSubject.next();
      this.broadcastRoomInfo();
    }
  }

  setAutostart(session: Session, delay: number | undefined) {
    if (this.host == session) {
      this.autoStart.configure(delay);
      this.broadcastRoomInfo();
    }
  }

  resetScores(session: Session) {
    if (this.host == session) {
      this.slots.forEach(slot => slot.resetScore());
      this.broadcastRoomInfo();
    }
  }

  isInRoom(session: Session) {
    return this.slots.find(slot => slot.session == session);
  }

  isEmpty() {
    return this.slots.length == 0;
  }

  isRunning() {
    return !!(this.game?.running);
  }

  getRoomInfo(gameState=false): RoomInfo {
    return {
      id: this.id,
      name: this.name,
      host: this.host == null ? null : this.host.getClientInfo(),

      settings: this.settings,
      slots: this.slots.map(roomSlot => roomSlot.getRoomSlotInfo()),
      gameState: gameState ? this.game?.serialize() ?? null : null,
      autoStartMs: this.autoStart.getMsUntilAutoStart(),
    };
  }

  getLastGameReplay() {
    return this.lastGameReplay ?? null;
  }

  destroy() {
    this.autoStart?.destroy();
    this.game?.destroy();
  }

  private broadcastRoomInfo() {
    const roomInfo = this.getRoomInfo();
    for (const slot of this.slots) {
      slot.session.socket.emit(LobbyEvent.ROOM_INFO, roomInfo);
    }
  }
  
  recvClientEvent(session: Session, clientEvent: ClientEvent) {
    if (!this.game) {
      return;
    }

    const playerIndex = this.game.players.findIndex(player => player.startPlayerData.clientInfo.sessionId == session.sessionId);
    if (playerIndex == -1) {
      return;
    }

    // simulate game immediately
    this.game.players[playerIndex].handleEvent(clientEvent);
  }

  postChatMessage(session: Session | null, message: string) {
    const chatMessage: ChatMessage = {
      username: session == null ? null : session.username!,
      timestamp: Date.now(),
      message: message,
    };
    for (const slot of this.slots) {
      slot.session.socket.emit(LobbyEvent.POST_CHAT_MESSAGE, chatMessage);
    }
  }

  shouldBeDestroyed() {
    return this.isEmpty() && this.creator != null;
  }

  canStartGame() {
    return !this.isRunning() && this.slots.filter(slot => slot.settings.playing).length > 0;
  }
}
