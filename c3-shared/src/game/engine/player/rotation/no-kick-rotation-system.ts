import { Piece } from "@shared/game/engine/player/piece";

export class NoKickRotationSystem implements NoKickRotationSystem {
  getKickTable(_piece: Piece, _drot: number): number[][] {
    return [];
  }
}
