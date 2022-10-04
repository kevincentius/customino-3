import { ApiProperty } from "@nestjs/swagger";

export class RegisterAccountDto {
  @ApiProperty()
  username!: string;
  
  @ApiProperty()
  passwordClearText!: string;
  
  @ApiProperty()
  email?: string;
}
