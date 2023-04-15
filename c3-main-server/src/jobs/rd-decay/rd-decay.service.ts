import { Injectable } from '@nestjs/common';
import { RatingService } from 'shared-modules/rating/rating.service';
import { t } from 'util/transaction';

@Injectable()
export class RdDecayService {
  constructor(
    private ratingService: RatingService,
  ) {}

  increaseRd() {
    t(em => em.query('UPDATE RATING SET rd = rd + 5'));
  }
}
