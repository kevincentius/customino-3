import { Tile } from "@shared/game/engine/model/tile";

export class MatUtil {
  static isInside(i: number, j: number, matrix: any[][]) {
    return i >= 0
      && j >= 0
      && i < matrix.length
      && j < matrix[0].length;
  }

  static rotate(matrix: any[][]) {
    let m = new Array(matrix.length);
    for (let i = 0; i < m.length; i++) {
      m[i] = new Array(matrix.length);
      for (let j = 0; j < m[i].length; j++) {
        m[i][j] = matrix[matrix.length - 1 - j][i];
      }
    }
    return m;
  }

  static countEmptyRowsBottom(matrix: any[][]) {
    for (let n = 0; n < matrix.length; n++) {
      let i = matrix.length - 1 - n;
      for (let cell of matrix[i]) {
        if (cell != null) {
          return n;
        }
      }
    }
    return 0;
  }

  static countEmptyRowsTop(matrix: any[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let cell of matrix[i]) {
        if (cell != null) {
          return i;
        }
      }
    }
    return 0;
  }

  static shiftDown(matrix: any[][], rows: number[]) {
    let shift = 0;
    for (let i = rows[rows.length - 1]; i >= rows.length; i--) {
      while (i - shift == rows[rows.length - 1 - shift]) {
        shift++;
      }
      matrix[i] = matrix[i - shift];
    }
  }

  static clearLines(matrix: any[][], rows: number[]) {
    this.shiftDown(matrix, rows);
    
    // create new empty rows
    for (let i = 0; i < rows.length; i++) {
      matrix[i] = Array(matrix[i].length);
    }
  }

  static addBottomRows(matrix: any[][], rows: any[][]) {
    for (let i = 0; i < matrix.length - rows.length; i++) {
      matrix[i] = matrix[i + rows.length];
    }
    
    for (let i = 0; i < rows.length; i++) {
      matrix[i + matrix.length - rows.length] = rows[i];
    }
  }
}
