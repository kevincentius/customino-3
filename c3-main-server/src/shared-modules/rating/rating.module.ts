import { Module } from '@nestjs/common';
import { RatingService } from 'shared-modules/rating/rating.service';

@Module({
  exports: [RatingService],
  providers: [RatingService],
})
export class RatingModule {}
