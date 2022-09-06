
export interface PlayerStats {
  activeTime: number;
  pieces: number;
  combos: number[];
  powerGenerated: number;
  attackGenerated: number;
  blockGenerated: number;
  attackReceived: number;
  attackSpawned: number;
  afk: boolean;
}
