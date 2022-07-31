import { ClientInfo } from "@shared/model/session/client-info";

/**
 * The room slot will hold information such as score and previous game stats for the player.
 * 
 * Room slots are created dynamically when someone joins the room.
 * */
export interface RoomSlotInfo {
  player: ClientInfo;
  playing: boolean; // play or spectate
  score: number;
}
