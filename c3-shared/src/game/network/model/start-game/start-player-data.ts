import { ClientInfo } from "@shared/model/session/client-info";

export interface StartPlayerData {
  clientInfo: ClientInfo;
  randomSeed: number;
}
