import { PlayerStats } from "@shared/game/engine/player/stats/player-stats";
import { RoomSlotInfo } from "@shared/model/room/room-slot-info";
import { RoomSlotSettings } from "@shared/model/room/room-slot-settings";
import { Session } from "service/session/session";

export class RoomSlot {
  // index of the player in the game engine
  public playerIndex: number | null = null;
  public settings: RoomSlotSettings = {
    team: null,
    playing: true,
  };

  private score = 0;
  private stats?: PlayerStats;


  constructor(
    public session: Session,
  ) {}
  
  getRoomSlotInfo(): RoomSlotInfo {
    return {
      player: this.session.getClientInfo(),
      score: this.score,
      stats: this.stats,
      settings: this.settings,
    };
  }

  addScore(score: number) { this.score += score; }
  resetScore() { this.score = 0; }
  updateStats(stats: PlayerStats) { this.stats = stats; }
}
