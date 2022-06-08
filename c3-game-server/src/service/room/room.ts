import { Game } from "@shared/game/engine/game/game";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { ServerEvent, ServerEventEntry } from "@shared/game/network/model/event/server-event";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { LobbyEvent } from "@shared/model/room/lobby-event";
import { RoomInfo } from "@shared/model/room/room-info";
import { RoomSlot } from "service/room/room-slot";
import { ServerGame } from "game/server-game";
import { Session } from "service/session/session";
import { ServerPlayer } from "game/server-player";
import { GameEventType } from "@shared/game/network/model/event/game-event";
import { SystemEvent } from "@shared/game/network/model/event/system-event";
import { GameReplay } from "@shared/game/engine/recorder/game-replay";
import { GameRecorder } from "@shared/game/engine/recorder/game-recorder";

export class Room {
  createdAt = Date.now();
  lastActivity = Date.now();
  slots: RoomSlot[];

  provideReplay = true;
  lastGameReplay?: GameReplay;

  // only for the current game session:
  game?: ServerGame;
  

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
      this.game!.players.find(p => (p as ServerPlayer).clientInfo.sessionId == session.sessionId)?.die();

      const playerIndex = this.game!.players.findIndex(p => (p as ServerPlayer).clientInfo.sessionId == session.sessionId);
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
      const players = this.slots
        .filter(slot => slot.playing)
        .map(slot => slot.session.getClientInfo());
      const startGameData: StartGameData = { players: players }

      // broadcast the start of game
      this.slots.forEach(slot => slot.session.socket.emit(LobbyEvent.START_GAME, startGameData));

      // start server game
      this.game = new ServerGame(startGameData, players);
      
      this.game.gameOverSubject.subscribe(gameResult => {
        for (const slot of this.slots) {
          slot.session.socket.emit(LobbyEvent.GAME_OVER, gameResult);
        }
      });
      
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

  getRoomInfo(): RoomInfo {
    return {
      id: this.id,
      name: this.name,
      host: this.creator.getClientInfo(),

      slots: this.slots.map(roomSlot => roomSlot.getRoomSlotInfo()),
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
    const playerIndex = this.game!.players.findIndex(player => player.clientInfo.sessionId == session.sessionId);

    // simulate game immediately
    this.game!.players[playerIndex].handleEvent(clientEvent);

    // broadcast server event
    const playerEvents: ServerEventEntry[] = [{
      playerIndex: playerIndex,
      clientEvent: clientEvent,
    }];

    for (const slot of this.slots) {
      if (slot.session == session) continue;

      const serverEvent: ServerEvent = {
        roomId: this.id,
        playerEvents: playerEvents
      };
      slot.session.socket.emit(LobbyEvent.SERVER_EVENT, serverEvent);
    }
  }
}
