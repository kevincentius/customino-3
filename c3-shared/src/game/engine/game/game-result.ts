
export interface PlayerResult {
  rank: number; // starts from 0!
  score: number;
}

export interface GameResult {
  players: PlayerResult[];
}
