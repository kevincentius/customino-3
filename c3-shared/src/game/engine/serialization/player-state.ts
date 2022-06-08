import { ClientInfo } from "@shared/model/session/client-info";

export interface PlayerState {
  clientInfo: ClientInfo;
  frame: number;
  alive: boolean;
  debugCount: number;
}
