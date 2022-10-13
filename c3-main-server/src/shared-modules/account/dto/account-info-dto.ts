import { ApiProperty } from "@nestjs/swagger";

export class AccountInfo {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  emailConfirmed!: boolean;

  @ApiProperty()
  createdAt!: number;
  
  @ApiProperty()
  lastLogin!: number;
}
