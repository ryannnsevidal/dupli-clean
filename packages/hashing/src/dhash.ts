export function dhash64FromGrayMatrix(gray: number[][]): string {
  // Difference hash: resize to 9x8, compute horizontal differences
  const N = 8;
  const resized = resizeMatrix(gray, N + 1);
  
  let bits = BigInt(0);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const v = resized[i][j] > resized[i][j + 1] ? 1n : 0n;
      bits = (bits << 1n) | v;
    }
  }
  return bits.toString(16).padStart(16, '0');
}

function resizeMatrix(matrix: number[][], newSize: number): number[][] {
  const oldSize = matrix.length;
  const result: number[][] = [];
  
  for (let i = 0; i < newSize; i++) {
    result[i] = [];
    for (let j = 0; j < newSize; j++) {
      const oldI = Math.floor((i * oldSize) / newSize);
      const oldJ = Math.floor((j * oldSize) / newSize);
      result[i][j] = matrix[oldI][oldJ];
    }
  }
  
  return result;
}
