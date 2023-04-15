
export interface PlayerStats {
  activeTime: number;
  pieces: number;
  linesCleared: number;
  garbageLinesCleared: number;
  digLinesCleared: number;
  combos: number[];
  maxCombo: number;
  powerGenerated: number;
  attackGenerated: number;
  blockGenerated: number;
  attackReceived: number;
  attackSpawned: number;
  afk: boolean;
}
