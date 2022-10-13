import { ApiProperty } from "@nestjs/swagger";
import { AccountInfo } from "shared-modules/account/dto/account-info-dto";
import { RatingInfo } from "shared-modules/rating/dto/rating-info-dto";

export class LeaderboardEntry {
  @ApiProperty()
  rank!: number;

  @ApiProperty()
  accountInfo!: AccountInfo;

  @ApiProperty()
  ratingInfo!: RatingInfo;
}
