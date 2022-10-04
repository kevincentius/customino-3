import { ApiProperty } from "@nestjs/swagger";

export class RegisterResultDto {
  @ApiProperty()
  success!: boolean;
  
  @ApiProperty()
  error?: string;
  
  @ApiProperty()
  accountId?: number;
}
