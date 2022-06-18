import { BoardState } from "@shared/game/engine/serialization/board-state";

export interface PlayerState {
  frame: number;
  alive: boolean;
  pieceQueue: number[][];
  attackQueue: string;
  attackRule: any;
  randomState: string;
  board: BoardState;
  pieceGen: any;
  activePiece: any;
  garbageGen: any;
}
