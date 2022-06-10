import { BoardState } from "@shared/game/engine/serialization/board-state";

export interface PlayerState {
  frame: number;
  alive: boolean;
  debugCount: number;
  randomState: string;
  board: BoardState;
}
