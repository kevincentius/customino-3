import { ClientInfo } from "@shared/model/session/client-info";

export interface StartGameData {
  players: ClientInfo[];
  localPlayerIndex: number | null;
}
