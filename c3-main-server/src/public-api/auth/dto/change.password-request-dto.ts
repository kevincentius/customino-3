import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequestDto {
  @ApiProperty()
  passwordResetCode!: string;
  
  @ApiProperty()
  newPassword!: string;
}