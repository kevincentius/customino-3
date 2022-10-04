import { ApiProperty } from "@nestjs/swagger";

export class AccountInfoDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  emailConfirmed!: boolean;

  @ApiProperty()
  createdAt!: number;
  
  @ApiProperty()
  lastLogin!: number;
}
