import { Injectable, OnModuleInit } from "@nestjs/common";
import { GlobalDataService } from "service/global-data/global-data.service";
import { RoomService } from "./room-service";

@Injectable()
export class ServerRoomService implements OnModuleInit {
  constructor(
    private roomService: RoomService,
    private globalDataService: GlobalDataService,
  ) {}

  async onModuleInit() {
    const serverRoomConfigs = await this.globalDataService.getServerRoomConfigs();
    for (const serverRoomConfig of serverRoomConfigs) {
      const gameMode = await this.globalDataService.getGameMode(serverRoomConfig.gameModeId);
      const gameModeSeason = await this.globalDataService.getCurrentSeason(gameMode.id);
      
      this.roomService.createServerRoom(
        gameMode.roomName,
        {
          gameRule: JSON.parse(gameModeSeason.ruleJson),
        }
      )
    }
  }
}
