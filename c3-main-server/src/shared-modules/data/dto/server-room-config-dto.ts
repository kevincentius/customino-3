import { ApiProperty } from "@nestjs/swagger";

export class ServerRoomConfig {
  @ApiProperty()
  gameModeId!: number;
}
