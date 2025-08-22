// DCT-based perceptual hash (pHash)
export function phash64FromGrayMatrix(matrix: number[][]): string {
  const dct = computeDCT(matrix);
  
  // Extract low-frequency components (top-left 8x8)
  const lowFreq: number[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      lowFreq.push(dct[i][j]);
    }
  }
  
  // Calculate median
  const sorted = [...lowFreq].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // Generate 64-bit hash
  let hash = 0n;
  for (let i = 0; i < lowFreq.length; i++) {
    if (lowFreq[i] > median) {
      hash |= 1n << BigInt(i);
    }
  }
  
  return hash.toString(16).padStart(16, '0');
}

// Compute 2D DCT
function computeDCT(matrix: number[][]): number[][] {
  const N = matrix.length;
  const result: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));
  
  for (let u = 0; u < N; u++) {
    for (let v = 0; v < N; v++) {
      let sum = 0;
      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          const cosU = Math.cos((Math.PI * u * (2 * x + 1)) / (2 * N));
          const cosV = Math.cos((Math.PI * v * (2 * y + 1)) / (2 * N));
          sum += matrix[x][y] * cosU * cosV;
        }
      }
      const alphaU = u === 0 ? 1 / Math.sqrt(N) : Math.sqrt(2 / N);
      const alphaV = v === 0 ? 1 / Math.sqrt(N) : Math.sqrt(2 / N);
      result[u][v] = alphaU * alphaV * sum;
    }
  }
  
  return result;
}

// Hamming distance for hex strings
export function hammingHex64(hash1: string, hash2: string): number {
  if (hash1.length !== 16 || hash2.length !== 16) {
    throw new Error('Hashes must be 16-character hex strings');
  }
  
  let distance = 0;
  for (let i = 0; i < 16; i++) {
    const val1 = parseInt(hash1[i], 16);
    const val2 = parseInt(hash2[i], 16);
    distance += (val1 ^ val2).toString(2).split('1').length - 1;
  }
  
  return distance;
}

// Extract first 16 bits for bucketing
export function bucket16(hash: string): number {
  return parseInt(hash.substring(0, 4), 16);
}
