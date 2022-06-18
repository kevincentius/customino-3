import { Piece } from "@shared/game/engine/player/piece";
import { NearestRotationSystem } from "@shared/game/engine/player/rotation/nearest-rotation-system";
import { NoKickRotationSystem } from "@shared/game/engine/player/rotation/no-kick-rotation-system";
import { SuperRotationSystem } from "@shared/game/engine/player/rotation/super-rotation-system";

export enum RotationSystemType {
  NO_KICK='strict',
  NEAREST='nearest',
  SRS='srs',
}

export interface RotationSystem {
    getKickTable(piece: Piece, drot: number): number[][];
}

export function createRotationSystem(rotSys: RotationSystemType) {
  switch (rotSys) {
    case RotationSystemType.NO_KICK: return new NoKickRotationSystem();
    case RotationSystemType.NEAREST: return new NearestRotationSystem();
    case RotationSystemType.SRS: return new SuperRotationSystem();
    default: throw new Error();
  }
}
