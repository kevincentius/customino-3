import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordResponseDto {
  @ApiProperty()
  passwordResetCode!: string;
  
  @ApiProperty()
  newPassword!: string;
}