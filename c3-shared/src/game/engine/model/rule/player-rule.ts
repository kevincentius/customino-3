
export interface PlayerRule {
  width: number;
  height: number;
  invisibleHeight: number;

  previews: number;

  garbageSpawnDelay: number;
  garbageSpawnRate: number;
  garbageCleanlinessBetween: number;
  garbageCleanlinessWithin: number;
  garbageEdgeLimitation: number;
}

export const playerRule: PlayerRule = {
  width: 10,
  height: 18,
  invisibleHeight: 18,

  previews: 5,

  garbageSpawnDelay: 1,
  garbageSpawnRate: 1,
  garbageCleanlinessBetween: 0,
  garbageCleanlinessWithin: 100,
  garbageEdgeLimitation: 0,
}
