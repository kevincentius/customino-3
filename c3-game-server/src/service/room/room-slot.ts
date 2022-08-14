import { RoomSlotInfo } from "@shared/model/room/room-slot-info";
import { RoomSlotSettings } from "@shared/model/room/room-slot-settings";
import { Session } from "service/session/session";

export class RoomSlot {
  // index of the player in the game engine
  public playerIndex: number | null = null;
  public settings: RoomSlotSettings = {
    team: null,
  };

  private score = 0;


  constructor(
    public session: Session,
    public playing = true,
  ) {}
  
  getRoomSlotInfo(): RoomSlotInfo {
    return {
      player: this.session.getClientInfo(),
      playing: this.playing,
      score: this.score,
      settings: this.settings,
    };
  }

  addScore(score: number) { this.score += score; }
  resetScore() { this.score = 0; }
}
