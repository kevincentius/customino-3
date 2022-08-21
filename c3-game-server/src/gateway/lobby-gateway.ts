
import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RoomSettings } from '@shared/game/engine/model/room-settings';
import { GameReplay } from '@shared/game/engine/recorder/game-replay';
import { ClientEvent } from '@shared/game/network/model/event/client-event';
import { LobbyEvent } from '@shared/model/room/lobby-event';
import { websocketGatewayOptions } from 'config/config';
import { RoomService } from 'service/room/room-service';
import { SessionService } from 'service/session/session-service';
import { Socket } from 'socket.io';

@WebSocketGateway(websocketGatewayOptions)
export class LobbyGateway {

  constructor(
    private roomService: RoomService,
    private sessionService: SessionService,
  ) {}

  private logger: Logger = new Logger('LobbyGateway');

  @SubscribeMessage(LobbyEvent.GET_ROOMS)
  getRooms() {
    return this.roomService.getRoomInfos();
  }

  @SubscribeMessage(LobbyEvent.CREATE_ROOM)
  createRoom(socket: Socket) {
    const session = this.sessionService.getSession(socket);
    return this.roomService
      .createRoom(session)
      .getRoomInfo();
  }

  @SubscribeMessage(LobbyEvent.JOIN_ROOM)
  joinRoom(socket: Socket, roomId: number) {
    const session = this.sessionService.getSession(socket);
    return this.roomService.join(session, roomId);
  }

  @SubscribeMessage(LobbyEvent.GET_ROOM_INFO)
  getRoomInfo(socket: Socket, roomId: number) {
    return this.roomService.getRoom(roomId).getRoomInfo(true);
  }

  @SubscribeMessage(LobbyEvent.LEAVE_ROOM)
  getRoom(socket: Socket) {
    return this.roomService.leave(this.sessionService.getSession(socket));
  }

  @SubscribeMessage(LobbyEvent.START_GAME)
  startGame(socket: Socket) {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.startGame(session);
    }
  }

  @SubscribeMessage(LobbyEvent.CHANGE_ROOM_SETTINGS)
  changeRoomSettings(socket: Socket, roomSettings: RoomSettings) {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.changeRoomSettings(session, roomSettings);
    }
  }

  @SubscribeMessage(LobbyEvent.CHANGE_SLOT_TEAM)
  changeSlotTeam(socket: Socket, args: any[]) {
    const slotIndex: number = args[0];
    const team: number = args[1];

    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.changeSlotTeam(session, slotIndex, team);
    }
  }

  @SubscribeMessage(LobbyEvent.SET_SPECTATOR_MODE)
  setSpectatorMode(socket: Socket, spectator: boolean) {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);

    if (room) {
      room.setSpectatorMode(session, spectator);
    }
  }

  @SubscribeMessage(LobbyEvent.POST_CHAT_MESSAGE)
  postChatMessage(socket: Socket, message: string) {
    const session = this.sessionService.getSession(socket);

    // must login before chat
    if (session.username == null) { return; }

    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.postChatMessage(session, message);
    }
  }

  @SubscribeMessage(LobbyEvent.RESET_SCORES)
  resetScores(socket: Socket) {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.resetScores(session);
    }
  }

  @SubscribeMessage(LobbyEvent.GAME_EVENTS)
  flushGameEvents(socket: Socket, clientEvent: ClientEvent) {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      room.recvClientEvent(session, clientEvent);
    }
  }

  @SubscribeMessage(LobbyEvent.GET_REPLAY)
  getReplay(socket: Socket): GameReplay | null {
    const session = this.sessionService.getSession(socket);
    const room = this.roomService.getRoom(session.roomId!);
    if (room) {
      return room.getLastGameReplay();
    } else {
      return null;
    }
  }
}