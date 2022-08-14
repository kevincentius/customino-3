
export enum LobbyEvent {
  // events fired by the client
  UPDATE_LOCAL_RULE    = 'e',

  GET_ROOMS            = '1',
  CREATE_ROOM          = '2',
  JOIN_ROOM            = '3',
      
  GET_ROOM_INFO        = '4',
  LEAVE_ROOM           = '5',
  START_GAME           = '6', // also by server
  CHANGE_ROOM_SETTINGS = '7',

  GAME_EVENTS          = '8',
  GET_REPLAY           = '9',

  // events fired by the server
  SESSION_INFO         = 'a',
  ROOM_INFO            = 'b',
  SERVER_EVENT         = 'c',
  GAME_OVER            = 'd',
}
