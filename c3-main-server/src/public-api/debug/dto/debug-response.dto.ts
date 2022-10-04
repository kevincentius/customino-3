import { ApiProperty } from "@nestjs/swagger";

export class DebugResponseDto {
  @ApiProperty({ description: 'This is where the client can connect to the game server via websocket.' })
  gameServerUrl!: string;
  
  @ApiProperty()
  debugMessage!: string;
}
