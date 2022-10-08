import { ApiProperty } from "@nestjs/swagger";

export class GameModeSeason {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  endTimestamp!: number;
  
  @ApiProperty()
  gameModeId!: number;
  
  @ApiProperty()
  ruleJson!: string;
}
