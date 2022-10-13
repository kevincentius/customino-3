import { ApiProperty } from "@nestjs/swagger";
import { GameMode } from "shared-modules/data/dto/game-mode-dto";
import { GameModeSeason } from "shared-modules/data/dto/game-mode-season-dto";
import { ServerRoomConfig } from "shared-modules/data/dto/server-room-config-dto";

export class GlobalData {
  @ApiProperty({ type: GameMode, isArray: true })
  gameModes!: GameMode[];

  @ApiProperty({ type: GameModeSeason, isArray: true })
  gameModeSeasons!: GameModeSeason[];

  @ApiProperty({ type: ServerRoomConfig, isArray: true })
  serverRoomConfigs!: ServerRoomConfig[];
}
