
export interface PlayerResult {
  rank: number; // starts from 0!
  score: number;
  afk: boolean;
}

export interface GameResult {
  players: PlayerResult[];
}
