import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Configuration } from './configuration';

import { DataService } from './api/data.service';
import { GameStatsService } from './api/game-stats.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    DataService,
    GameStatsService
  ],
  providers: [
    DataService,
    GameStatsService
  ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): DynamicModule {
        return {
            module: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( httpService: HttpService) { }
}
