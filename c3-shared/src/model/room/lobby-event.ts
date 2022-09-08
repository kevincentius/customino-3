
export enum LobbyEvent {
  // events fired by the client
  GET_SERVER_INFO      = 'j', 
  UPDATE_USER_RULE     = 'e',

  GET_ROOMS            = '1',
  CREATE_ROOM          = '2',
  JOIN_ROOM            = '3',
      
  GET_ROOM_INFO        = '4',
  LEAVE_ROOM           = '5',
  START_GAME           = '6', // also by server
  CHANGE_ROOM_SETTINGS = '7',
  CHANGE_SLOT_TEAM     = 'f',
  SET_SPECTATOR_MODE   = 'h',
  POST_CHAT_MESSAGE    = 'i',

  GAME_EVENTS          = '8',
  GET_REPLAY           = '9',
  RESET_SCORES         = 'g',

  // events fired by the server
  LOGIN                = 'a',
  ROOM_INFO            = 'b',
  SERVER_EVENT         = 'c',
  GAME_OVER            = 'd',
  ABORT_GAME           = 'k',
}
