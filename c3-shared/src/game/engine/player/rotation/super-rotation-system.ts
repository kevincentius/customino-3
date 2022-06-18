import { Piece } from "@shared/game/engine/player/piece";
import { RotationSystem } from "@shared/game/engine/player/rotation/rotation-system";

export class SuperRotationSystem implements RotationSystem {
    
  // 180 spin except O piece:
  // 0 -> 2: up then down
  // 2 -> 0: down then up
  // L -> R: left then right
  // R -> L: right then left

  // [initial rotation][end rotation][kick priority][xy]
  srsly: number[][][][] = [[
      [                                      ],    // 0 -> 0 (no rotation)
      [[ 0,-1], [-1,-1], [+2, 0]  , [+2,-1,1]],    // 0 -> R
      [[+1, 0], [-1, 0]                      ],    // 0 -> 2 (180)
      [[ 0,+1], [-1,+1], [+2, 0]  , [+2,+1,1]],    // 0 -> L
  ], [
      [[ 0,+1], [+1,+1], [-2, 0,1], [-2,+1,1]],    // R -> 0
      [                                      ],    // R -> R (no rotation)
      [[ 0,+1], [+1,+1], [-2, 0,1], [-2,+1,1]],    // R -> 2
      [[ 0,+1], [ 0,-1]                      ],    // R -> L (180)
  ], [
      [[ 0,+1], [ 0,-1]                      ],    // 2 -> 0 (180)
      [[ 0,-1], [-1,-1], [+2, 0,1], [+2,-1,1]],    // 2 -> R
      [                                      ],    // 2 -> 2 (no rotation)
      [[ 0,+1], [-1,+1], [+2, 0,1], [+2,+1,1]],    // 2 -> L
  ], [
      [[ 0,-1], [+1,-1], [-2, 0,1], [-2,-1,1]],    // L -> 0
      [[ 0,-1], [ 0,+1]                      ],    // L -> R (180)
      [[ 0,-1], [+1,-1], [-2, 0,1], [-2,-1,1]],    // L -> 2
      [                                      ],    // L -> L (no rotation)
  ]];
  iSrsly: number[][][][] = [[
      [                                  ],    // 0 -> 0 (no rotation)
      [[ 0,-2], [ 0,+1], [+1,-2], [-2,+1]],    // 0 -> R
      [[+1, 0], [-1, 0]                  ],    // 0 -> 2 (180)
      [[ 0,-1], [ 0,+2], [-2,-1], [+1,+2]],    // 0 -> L
  ], [
      [[ 0,+2], [ 0,-1], [-1,+2], [+2,-1]],    // R -> 0
      [                                  ],    // R -> R (no rotation)
      [[ 0,-1], [ 0,+2], [-2,-1], [+1,+2]],    // R -> 2
      [[ 0,+1], [ 0,-1]                  ],    // R -> L (180)
  ], [
      [[ 0,+1], [ 0,-1]                  ],    // 2 -> 0 (180)
      [[ 0,+1], [ 0,-2], [+2,+1], [-1,-2]],    // 2 -> R
      [                                  ],    // 2 -> 2 (no rotation)
      [[ 0,+2], [ 0,-1], [-1,+2], [+2,-1]],    // 2 -> L
  ], [
      [[ 0,+1], [ 0,-2], [+2,+1], [-1,-2]],    // L -> 0
      [[ 0,-1], [ 0,+1]                  ],    // L -> R (180)
      [[ 0,-2], [ 0,+1], [+1,-2], [-2,+1]],    // L -> 2
      [                                  ],    // L -> L (no rotation)
  ]];

  getKickTable(piece: Piece, drot: number) {
      if (piece.size == 4) {
          const iPieceId = 0;
          let initRot = piece.rotation;
          let endRot = (initRot + drot + 400000) % 4;
          return (piece.pieceId == iPieceId ? this.iSrsly : this.srsly)
              [initRot][endRot];
      } else {
          return this.getKickTableNonTetromino(drot);
      }
  };

  getKickTableNonTetromino(drot: number) {
      drot = (drot + 4000000) % 4;
      if (drot == 1) {
          return [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1], [0, 2], [0, -2]];
      } else {
          return [[0, -1], [0, 1], [1, 0], [1, -1], [1, 1], [-1, 0], [-1, -1], [-1, 1], [0, -2], [0, 2]];
      }
  }
}
