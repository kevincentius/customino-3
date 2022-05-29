import { RoomSlotInfo } from "@shared/model/room/room-slot-info";
import { Session } from "service/session/session";

export class RoomSlot {
  constructor(
    public session: Session,
    public playing = true,
  ) {}
  
  getRoomSlotInfo(): RoomSlotInfo {
    return {
      player: this.session.getClientInfo(),
      playing: this.playing
    };
  }
}
