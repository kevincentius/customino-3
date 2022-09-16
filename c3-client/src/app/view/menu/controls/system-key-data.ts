import { SystemKey } from "@shared/game/network/model/system-key";

export interface SystemKeyData {
  systemKey: SystemKey;
  name: string;
  description: string;
  default: string;
}

export const systemKeyDataArray: SystemKeyData[] = [
  {
    systemKey: SystemKey.START_GAME,
    name: 'Start game (host)',
    description: 'Starts the next round for all players in the room. Only the room creator is allowed to do this.',
    default: 'F2',
  },
  {
    systemKey: SystemKey.TOGGLE_GUI,
    name: 'Toggle chat (room)',
    description: 'Toggle between viewing the game and the room chat / interface.',
    default: 'Backquote',
  },
  {
    systemKey: SystemKey.SPECTATOR_ON,
    name: 'Spectate',
    description: 'Press this key while in a room to watch instead of playing.',
    default: 'F4',
  },
  {
    systemKey: SystemKey.SPECTATOR_OFF,
    name: 'Unspectate (play)',
    description: 'Press this key while in a room to play instead of watching.',
    default: 'KeyF',
  },
  {
    systemKey: SystemKey.EXIT,
    name: 'Exit (go back)',
    description: 'Leave the current game, room or screen.',
    default: 'Escape',
  },
  {
    systemKey: SystemKey.DEBUG,
    name: 'Debug (performance)',
    description: 'Toggle performance statistics for testing purposes.',
    default: 'F8',
  },
];
