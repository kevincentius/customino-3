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

export class Room {
  createdAt = Date.now();
  lastActivity = Date.now();
  slots: RoomSlot[];
  settings: RoomSettings = {
    gameRule: { 
      roomRule: getDefaultRoomRule(),
    },
  };
  host!: Session;

  provideReplay = true;
  lastGameReplay?: GameReplay;

  // only for the current game session:
  game?: ServerGame;
  r = new RandomGen();

  constructor(
    public id: number,
    public name: string,
    public creator: Session,
    private sessionService: SessionService,
  ) {
    this.slots =[new RoomSlot(creator)];
    this.host = creator;
  }

  leave(session: Session) {
    const prevSlotCount = this.slots.length;
    this.slots = this.slots.filter(slot => slot.session !== session);

    if (this.isRunning()) {
      const playerIndex = this.game!.players.findIndex(p => p.startPlayerData.clientInfo.sessionId == session.sessionId);
      
      // if a player leaves, treat him as dead in the game
      if (playerIndex != -1) {
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
    }

    if (this.slots.length != prevSlotCount) {
      this.broadcastRoomInfo();
    }
  }

  join(session: Session) {
    if (!this.isInRoom(session)) {
      this.slots.push(new RoomSlot(session));

      this.broadcastRoomInfo();
    }
  }

  startGame(session: Session) {
    if (!this.isRunning() && this.host == session && this.isInRoom(session) && this.slots.filter(slot => slot.settings.playing).length > 0) {
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
      this.game = new ServerGame(startGameData, players);
      
      this.game.gameOverSubject.subscribe(gameResult => {
        for (const slot of this.slots) {
          if (slot.playerIndex != null) {
            slot.addScore(gameResult.players[slot.playerIndex].score);
          }
        }
        
        for (const slot of this.slots) {
          slot.session.socket.emit(LobbyEvent.GAME_OVER, this.getRoomInfo());
        }
      });

      for (const player of this.game.players) {
        player.serverEventSubject.subscribe(map => {
          this.slots.forEach(slot => {
            const serverPlayerEvent = map.get(slot.playerIndex == null ? -1 : slot.playerIndex);
            if (serverPlayerEvent) {
              const serverEvent: ServerEvent = {
                roomId: this.id,
                playerEvents: [ serverPlayerEvent ],
              };
              slot.session.socket.emit(LobbyEvent.SERVER_EVENT, serverEvent);
            }
          })
        });
      }
      
      // debug replay
      if (this.provideReplay) {
        const recorder = new GameRecorder(this.game);
        this.game.gameOverSubject.subscribe(gameResult => {
          this.lastGameReplay = recorder.asReplay();
        });
      }
      
      this.game.start();
    }
  }

  changeRoomSettings(session: Session, roomSettings: RoomSettings) {
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
        this.broadcastRoomInfo();
      }
    }
  }
  
  setSpectatorMode(session: Session, spectator: boolean) {
    const slot = this.slots.filter(slot => slot.session == session)[0];
    if (slot) {
      slot.settings.playing = !spectator;
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
      host: this.host.getClientInfo(),

      settings: this.settings,
      slots: this.slots.map(roomSlot => roomSlot.getRoomSlotInfo()),
      gameState: gameState ? this.game?.serialize() ?? null : null,
    };
  }

  getLastGameReplay() {
    return this.lastGameReplay ?? null;
  }

  destroy() {
    // destroy game instance
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

    const playerIndex = this.game!.players.findIndex(player => player.startPlayerData.clientInfo.sessionId == session.sessionId);
    if (playerIndex == -1) {
      return;
    }

    // simulate game immediately
    this.game!.players[playerIndex].handleEvent(clientEvent);
  }

  postChatMessage(session: Session, message: string) {
    const chatMessage: ChatMessage = {
      username: session.username!,
      timestamp: Date.now(),
      message: message,
    };
    for (const slot of this.slots) {
      slot.session.socket.emit(LobbyEvent.POST_CHAT_MESSAGE, chatMessage);
    }
  }
}
