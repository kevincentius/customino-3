
export enum LobbyEvent {
  // events fired by the client
  GET_ROOMS      = '1',
  CREATE_ROOM    = '2',
  JOIN_ROOM      = '3',

  GET_ROOM_INFO  = '4',
  START_GAME     = '5', // also by server

  GAME_EVENTS    = '6',
  GET_REPLAY     = '7',

  // events fired by the server
  SESSION_INFO   = '10',
  ROOM_INFO      = '7',
  SERVER_EVENT   = '8',
  GAME_OVER      = '9',
}
