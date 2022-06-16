import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { ServerEvent, ServerPlayerEvent } from "@shared/game/network/model/event/server-event";
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

export class Room {
  createdAt = Date.now();
  lastActivity = Date.now();
  slots: RoomSlot[];

  provideReplay = true;
  lastGameReplay?: GameReplay;

  // only for the current game session:
  game?: ServerGame;
  r = new RandomGen();

  constructor(
    public id: number,
    public name: string,
    public creator: Session,
  ) {
    this.slots =[new RoomSlot(creator, true)];
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
    if (!this.isRunning() && this.creator == session && this.isInRoom(session)) {
      const playerSlots = this.slots.filter(slot => slot.playing);
      this.slots.forEach(slot => slot.playerIndex = null);
      playerSlots.forEach((playerSlot, index) => playerSlot.playerIndex = index);

      const players = playerSlots.map(slot => slot.session.getClientInfo());
      
      const globalSeed = this.r.int();
      
      const startGameData: StartGameData = {
        players: players.map(p => ({
          clientInfo: p,
          randomSeed: globalSeed,
        })),
        randomSeed: this.r.int(),
      }

      // broadcast the start of game
      this.slots.forEach(slot => slot.session.socket.emit(LobbyEvent.START_GAME, startGameData));

      // start server game
      this.game = new ServerGame(startGameData, players);
      
      this.game.gameOverSubject.subscribe(gameResult => {
        for (const slot of this.slots) {
          slot.session.socket.emit(LobbyEvent.GAME_OVER, gameResult);
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
              if (serverEvent.playerEvents.find(p => p.serverEvent)) {
                console.log(serverEvent);
              }
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
      host: this.creator.getClientInfo(),

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
}
