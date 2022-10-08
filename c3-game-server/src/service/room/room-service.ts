import { Injectable } from "@nestjs/common";
import { RoomSettings } from "@shared/game/engine/model/room-settings";
import { RoomInfo } from "@shared/model/room/room-info";
import { GameStatsService } from "main-server/api/v1";
import { Room } from "service/room/room";
import { Session } from "service/session/session";
import { SessionService, SessionServiceEvent } from "service/session/session-service";

/**
 * This service is aware of all rooms in the server, and guarantees that each client can only be in one room at any given time.
 */
@Injectable()
export class RoomService {

  roomMap = new Map<number, Room>();

  nextRoomId = 1;

  constructor(
    private sessionService: SessionService,
    private gameStatsService: GameStatsService,
  ) {}

  onModuleInit() {
    this.sessionService.eventEmitter.on(SessionServiceEvent.SESSION_DESTROYED, this.leave.bind(this));
  }

  getRoomInfos(): RoomInfo[] {
    return Array
      .from(this.roomMap.values())
      .map(room => room.getRoomInfo());
  }
  
  /**
   * Creates a new room and makes the client join the room.
   * 
   * If the client was already in another room, the client is considered as leaving that room.
   */
  createUserRoom(session: Session): Room {
    const roomId = this.nextRoomId++;
    
    this.leave(session);

    const room = new Room(roomId, `${session.username}'s Room`, session, this.sessionService, this.gameStatsService);
    this.roomMap.set(room.id, room);

    session.roomId = room.id;

    return room;
  }

  createServerRoom(name: string, roomSettings: RoomSettings, gameModeSeasonId?: number): Room {
    const roomId = this.nextRoomId++;

    const room = new Room(roomId, name, null, this.sessionService, this.gameStatsService, gameModeSeasonId);
    room.changeRoomSettings(null, roomSettings);

    this.roomMap.set(room.id, room);

    return room;
  }

  getRoom(roomId: number): Room {
    return this.roomMap.get(roomId)!;
  }

  /**
   * Remove the client from any room he is in, if any.
   */
  leave(session: Session) {
    if (session.roomId) {
      const room = this.getRoom(session.roomId);
      room.leave(session);
      session.roomId = undefined;
      if (room.shouldBeDestroyed()) {
        room.destroy();
        this.roomMap.delete(room.id);
      }
    }
  }
  
  /**
   * Adds the client to the room.
   * If the client was already in the room, nothing happens.
   * If the client was in another room, he will be removed from that other room.
   */
  join(session: Session, roomId: number): RoomInfo | null {
    const room = this.roomMap.get(roomId);
    if (room) {
      if (session.roomId != room.id) {
        this.leave(session);
      }

      session.roomId = room.id;
      room.join(session);

      return room.getRoomInfo(true);
    } else {
      return null;
    }
  }
}
