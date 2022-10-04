import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordRequestDto {
  @ApiProperty({ required: false })
  email?: string;
  
  @ApiProperty({ required: false })
  username?: string;
}