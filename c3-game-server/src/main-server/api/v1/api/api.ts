export * from './data.service';
import { DataService } from './data.service';
export * from './game-stats.service';
import { GameStatsService } from './game-stats.service';
export const APIS = [DataService, GameStatsService];
