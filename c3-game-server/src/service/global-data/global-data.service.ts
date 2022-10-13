import { Injectable } from '@nestjs/common';
import { DataService } from 'main-server/api/v1';
import { GlobalData } from 'main-server/api/v1/model/global-data';
import { p } from 'service/util/api-util';

@Injectable()
export class GlobalDataService {
  private globalData!: GlobalData

  constructor(
    private dataService: DataService,
  ) {}

  private async getCachedGlobalData() {
    if (!this.globalData) {
      this.globalData = await p(this.dataService.getGlobalData());
    }
    return this.globalData;
  }

  async getServerRoomConfigs() {
    return (await this.getCachedGlobalData()).serverRoomConfigs;
  }

  async getGameMode(gameModeId: number) {
    return (await this.getCachedGlobalData()).gameModes
      .filter(gameMode => gameMode.id == gameModeId)[0];
  }

  async getCurrentSeason(gameModeId: number) {
    return (await this.getCachedGlobalData()).gameModeSeasons
      .filter(gameModeSeason => gameModeSeason.gameModeId == gameModeId)
      .reduce((prev, curr) => prev.endTimestamp < curr.endTimestamp ? prev : curr);
  }
}
