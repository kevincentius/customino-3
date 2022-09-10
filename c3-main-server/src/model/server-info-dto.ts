import { ApiProperty } from "@nestjs/swagger";

export class ServerInfoDto {
  @ApiProperty({ description: 'The version number of the server. For example, server version 0.1 will only support client versions 0.1.x.' })
  version!: string;

  @ApiProperty({ description: 'URL to download the latest (or compatible) client to play on the current server version.' })
  clientDownloadUrl!: string;
}
