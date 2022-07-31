
export interface PlayerStats {
  activeTime: number;
  pieces: number;
  combos: Map<string, number>;
  powerGenerated: number;
  attackGenerated: number;
  blockGenerated: number;
  attackReceived: number;
  attackSpawned: number;
}
