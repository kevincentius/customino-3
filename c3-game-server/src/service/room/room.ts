import { Game } from "@shared/game/engine/game/game";
import { RemotePlayer } from "@shared/game/engine/player/remote-player";
import { ServerPlayer } from "@shared/game/engine/player/server-player";
import { ClientEvent } from "@shared/game/network/model/event/client-event";
import { GameEvent } from "@shared/game/network/model/event/game-event";
import { ServerEvent, ServerEventEntry } from "@shared/game/network/model/event/server-event";
import { StartGameData } from "@shared/game/network/model/start-game-data";
import { LobbyEvent } from "@shared/model/room/lobby-event";
import { RoomInfo } from "@shared/model/room/room-info";
import { RoomSlot } from "service/room/room-slot";
import { Session } from "service/session/session";

export class Room {
  createdAt = Date.now();
  lastActivity = Date.now();
  slots: RoomSlot[];

  game?: Game;

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
      const players = this.slots.map(slot => slot.session.getClientInfo());
      this.slots.forEach((slot, index) => {
        const startGameData: StartGameData = {
          players: players,
          localPlayerIndex: index,
        }
        slot.session.socket.emit(LobbyEvent.START_GAME, startGameData);
      });

      this.game = new Game({
        players: players,
        localPlayerIndex: null,
      }, true);

      this.game.gameOverSubject.subscribe(gameResult => {
        for (const slot of this.slots) {
          slot.session.socket.emit(LobbyEvent.GAME_OVER, gameResult);
        }
      });

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
    const playerIndex = this.slots.findIndex(slot => slot.session == session);

    // simulate game immediately
    (this.game!.players[playerIndex] as ServerPlayer).handleEvent(clientEvent);

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
