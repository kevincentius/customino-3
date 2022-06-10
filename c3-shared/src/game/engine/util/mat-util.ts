
export class MatUtil {
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
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] != null) {
          return n;
        }
      }
    }
  }

  static countEmptyRowsTop(matrix: any[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] != null) {
          return i;
        }
      }
    }
  }
}
