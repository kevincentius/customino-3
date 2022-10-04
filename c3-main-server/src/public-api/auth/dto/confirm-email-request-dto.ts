import { ApiProperty } from "@nestjs/swagger";

export class ConfirmEmailRequestDto {
  @ApiProperty()
  emailConfirmationCode!: string;
}
