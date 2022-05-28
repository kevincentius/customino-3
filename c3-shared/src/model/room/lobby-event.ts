
export enum LobbyEvent {
  // events fired by the client
  GET_ROOMS     = 'lobby.getRooms',
  CREATE_ROOM   = 'lobby.createRoom',
  JOIN_ROOM     = 'lobby.joinRoom',

  GET_ROOM_INFO = 'room.getRoomInfo',
  START_GAME    = 'room.startGame', // also by server

  // events fired by the server
  ROOM_INFO     = 'room.roomInfo',
}
