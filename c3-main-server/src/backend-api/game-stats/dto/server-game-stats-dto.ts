import { ApiProperty } from "@nestjs/swagger";

export class ServerGameStatsDto {
  @ApiProperty()
  gameModeSeasonId!: number;

  @ApiProperty({ type: Number, isArray: true })
  accountIdsByRanking!: number[];
}

