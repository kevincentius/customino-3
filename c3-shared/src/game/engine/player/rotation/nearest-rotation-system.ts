import { Piece } from "@shared/game/engine/player/piece";
import { RotationSystem } from "@shared/game/engine/player/rotation/rotation-system";

export class NearestRotationSystem implements RotationSystem {
  getKickTable(_piece: Piece, drot: number) {
    drot = (drot + 4000000) % 4;
    if (drot == 1) {
      return [[0, -1], [0, 1], [1, 0], [1, -1], [1, 1], [0, -2], [0, 2], [-1, 0], [-1, -1], [-1, 1]];
    } else {
      return [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [0, 2], [0, -2], [-1, 0], [-1, 1], [-1, -1]];
    }
  }
}
