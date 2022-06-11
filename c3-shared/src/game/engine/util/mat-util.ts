
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
        m[i][j] = matrix[j][matrix[0].length - 1 - i];
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
    return 0;
  }

  static countEmptyRowsTop(matrix: any[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] != null) {
          return i;
        }
      }
    }
    return 0;
  }
}
