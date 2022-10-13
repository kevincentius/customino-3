import { ApiProperty } from "@nestjs/swagger";

export class GameMode {
  @ApiProperty()
  id!: number;
  
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  roomName!: string;
}
