import { ApiProperty } from "@nestjs/swagger";

export class RatingInfo {
  @ApiProperty()
  rating!: number;

  @ApiProperty()
  rd!: number;

  @ApiProperty()
  vol!: number;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  matches!: number;

  @ApiProperty()
  lastMatchTimestamp?: number;
}
