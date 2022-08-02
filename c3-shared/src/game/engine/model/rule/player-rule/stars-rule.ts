
export interface StarsRule {
  useStars: boolean;

  multipliers: number[]; // starts from 0 stars! Index = number of stars the player currently has.
  multiplierScalesByProgress: boolean;

  powerRequired: number[]; // starts from how to get the 1st star. Index = number of stars the player currently has.
  powerDecayPerPiece: boolean;
  powerDecayPerPieceRate: number[];

  powerDecay: boolean;
  powerDecayRate: number[]; // starts from decay rate when getting the 1st star. Index = number of stars the player currently has.
  powerDecayScalesByProgress: boolean;
}
