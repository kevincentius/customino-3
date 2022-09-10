import { SystemKey } from "@shared/game/network/model/system-key";

export interface SystemKeyData {
  systemKey: SystemKey;
  name: string;
  default: string;
}

export const systemKeyDataArray: SystemKeyData[] = [
  {
    systemKey: SystemKey.START_GAME,
    name: 'Start game (host)',
    default: 'F2',
  },
  {
    systemKey: SystemKey.TOGGLE_GUI,
    name: 'Toggle chat (room)',
    default: 'Backquote',
  },
  {
    systemKey: SystemKey.SPECTATOR_ON,
    name: 'Spectate',
    default: 'F4',
  },
  {
    systemKey: SystemKey.SPECTATOR_OFF,
    name: 'Unspectate (play)',
    default: 'KeyF',
  },
  {
    systemKey: SystemKey.EXIT,
    name: 'Exit (go back)',
    default: 'Escape',
  },
  {
    systemKey: SystemKey.DEBUG,
    name: 'Debug (performance)',
    default: 'F8',
  },
];
