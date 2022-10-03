import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { config } from 'config/config';
import { Observable } from 'rxjs';

@Injectable()
export class MsGameStatsService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async test(): Promise<any> {
    return this.httpService.get(`${config.mainServerUrl}/backend-api/game-stats/test`).subscribe(r => r.data);
  }
}
