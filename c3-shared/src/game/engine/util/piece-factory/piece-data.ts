
interface PieceData {
  name: string;
  matSize: number;
  sparse: number[][];
  color?: number;
}

export const pieceDataArray: PieceData[][] = [
  [// 1
      { name: '.', matSize: 1, sparse: [[0, 0]] }
  ], [ // 2
      { name: ':', matSize: 2, sparse: [[1, 0], [1, 1]] }
  ], [ //3
      { name: 'I', matSize: 3, sparse: [[1, 0], [1, 1], [1, 2]] },
      { name: 'L', matSize: 2, sparse: [[0, 1], [1, 0], [1, 1]] }
  ], [ // 4
      { name: 'I', matSize: 4, color: 4, sparse: [[1, 0], [1, 1], [1, 2], [1, 3]] },
      { name: 'L', matSize: 3, color: 1, sparse: [[0, 2], [1, 0], [1, 1], [1, 2]] },
      { name: 'J', matSize: 3, color: 5, sparse: [[0, 0], [1, 0], [1, 1], [1, 2]] },
      { name: 'S', matSize: 3, color: 3, sparse: [[0, 1], [0, 2], [1, 0], [1, 1]] },
      { name: 'Z', matSize: 3, color: 0, sparse: [[0, 0], [0, 1], [1, 1], [1, 2]] },
      { name: 'T', matSize: 3, color: 6, sparse: [[0, 1], [1, 0], [1, 1], [1, 2]] },
      { name: 'O', matSize: 2, color: 2, sparse: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  ], [ // 5
      { name: 'I', matSize: 5, sparse: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'L', matSize: 4, sparse: [[1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'J', matSize: 4, sparse: [[1, 0], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'H', matSize: 4, sparse: [[1, 2], [1, 3], [2, 0], [2, 1], [2, 2]] },
      { name: 'N', matSize: 4, sparse: [[1, 0], [1, 1], [2, 1], [2, 2], [2, 3]] },
      { name: 'Y', matSize: 4, sparse: [[1, 2], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'R', matSize: 4, sparse: [[1, 1], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'E', matSize: 3, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 0]] },
      { name: 'F', matSize: 3, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]] },
      { name: 'P', matSize: 3, sparse: [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2]] },
      { name: 'Q', matSize: 3, sparse: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] },
      { name: 'S', matSize: 3, sparse: [[0, 1], [0, 2], [1, 1], [2, 0], [2, 1]] },
      { name: 'Z', matSize: 3, sparse: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]] },
      { name: 'T', matSize: 3, sparse: [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2]] },
      { name: 'C', matSize: 3, sparse: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]] },
      { name: 'V', matSize: 3, sparse: [[0, 2], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'W', matSize: 3, sparse: [[0, 2], [1, 1], [1, 2], [2, 0], [2, 1]] },
      { name: 'X', matSize: 3, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]] },
  ], [ // 6
      { name: 'I', matSize: 6, sparse: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]] },
      { name: 'Li', matSize: 5, sparse: [[1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'Ji', matSize: 5, sparse: [[1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'Ti', matSize: 5, sparse: [[1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'Lo', matSize: 4, sparse: [[0, 3], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Jo', matSize: 4, sparse: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'P', matSize: 4, sparse: [[1, 0], [1, 1], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Q', matSize: 4, sparse: [[1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Tr', matSize: 4, sparse: [[0, 2], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Tl', matSize: 4, sparse: [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'D', matSize: 4, sparse: [[1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'C', matSize: 4, sparse: [[1, 0], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'F', matSize: 4, sparse: [[1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [3, 1]] },
      { name: 'E', matSize: 4, sparse: [[1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [3, 2]] },
      { name: 'So', matSize: 4, sparse: [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]] },
      { name: 'Zo', matSize: 4, sparse: [[0, 3], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0]] },
      { name: 'Xr', matSize: 4, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]] },
      { name: 'Xl', matSize: 4, sparse: [[0, 2], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]] },
      { name: '0', matSize: 3, sparse: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] },
      { name: 'Wr', matSize: 4, sparse: [[0, 2], [0, 3], [1, 1], [1, 2], [2, 0], [2, 1]] },
      { name: 'Wl', matSize: 4, sparse: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]] },
      { name: 'Ur', matSize: 3, sparse: [[0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'Ul', matSize: 3, sparse: [[0, 0], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'S', matSize: 4, sparse: [[0, 2], [0, 3], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'Z', matSize: 4, sparse: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [2, 3]] },
      { name: 'Mi', matSize: 5, sparse: [[1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Ni', matSize: 5, sparse: [[1, 0], [1, 1], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'Si', matSize: 5, sparse: [[1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2]] },
      { name: 'Zi', matSize: 5, sparse: [[1, 0], [1, 1], [1, 2], [2, 2], [2, 3], [2, 4]] },
      { name: 'Rr', matSize: 3, sparse: [[0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [2, 2]] },
      { name: 'Rl', matSize: 3, sparse: [[0, 1], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'Pi', matSize: 3, sparse: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 1], [2, 2]] },
      { name: 'Qi', matSize: 3, sparse: [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]] },
      { name: 'V', matSize: 3, sparse: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1]] },
      { name: '4r', matSize: 4, sparse: [[0, 2], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]] },
      { name: '4l', matSize: 4, sparse: [[0, 1], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1]] },
      { name: '?', matSize: 4, sparse: [[1, 0], [1, 1], [1, 3], [2, 1], [2, 2], [2, 3]] },
      { name: '5', matSize: 4, sparse: [[1, 0], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2]] },
      { name: '\\', matSize: 4, sparse: [[0, 3], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1]] },
      { name: '/', matSize: 4, sparse: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]] },
      { name: '1r', matSize: 5, sparse: [[1, 1], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: '1l', matSize: 5, sparse: [[1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
      { name: 'Fi', matSize: 4, sparse: [[1, 0], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'Ei', matSize: 4, sparse: [[1, 1], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] },
      { name: 'To', matSize: 5, sparse: [[0, 2], [1, 2], [2, 2], [3, 1], [3, 2], [3, 3]] },
      { name: 'Fr', matSize: 4, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]] },
      { name: 'Fl', matSize: 4, sparse: [[0, 2], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0]] },
      { name: 'Xi', matSize: 5, sparse: [[0, 2], [1, 2], [2, 1], [2, 2], [2, 3], [3, 2]] },
      { name: 'A', matSize: 3, sparse: [[0, 2], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
      { name: 'St', matSize: 4, sparse: [[0, 2], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1]] },
      { name: 'Zt', matSize: 4, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]] },
      { name: 'No', matSize: 4, sparse: [[1, 0], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]] },
      { name: 'Mo', matSize: 4, sparse: [[1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2]] },
      { name: 'K', matSize: 3, sparse: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [2, 2]] },
      { name: 'h', matSize: 3, sparse: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [2, 2]] },
      { name: 'μ', matSize: 3, sparse: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0]] },
      { name: 'Po', matSize: 4, sparse: [[0, 1], [1, 0], [1, 1], [2, 1], [2, 2], [2, 3]] },
      { name: 'Qo', matSize: 4, sparse: [[0, 2], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2]] },
  ]
];
