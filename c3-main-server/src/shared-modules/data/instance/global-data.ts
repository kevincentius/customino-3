import { GlobalData } from "shared-modules/data/dto/global-data-dto";
import { gameModeSeasons } from "shared-modules/data/instance/game-mode-seasons";
import { gameModes } from "shared-modules/data/instance/game-modes";
import { serverRoomConfigs } from "shared-modules/data/instance/server-room-configs";

export const globalData: GlobalData = {
  gameModes: gameModes,
  gameModeSeasons: gameModeSeasons,
  serverRoomConfigs: serverRoomConfigs,
}
