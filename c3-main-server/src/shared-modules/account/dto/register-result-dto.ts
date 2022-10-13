import { ApiProperty } from "@nestjs/swagger";

export class RegisterResult {
  @ApiProperty()
  success!: boolean;
  
  @ApiProperty()
  error?: string;
  
  @ApiProperty()
  accountId?: number;
}
