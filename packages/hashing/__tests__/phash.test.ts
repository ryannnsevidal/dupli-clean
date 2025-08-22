import { describe, it, expect } from 'vitest';
import { phash64FromGrayMatrix, hammingHex64, bucket16 } from '../src/phash';

describe('Perceptual Hash', () => {
  it('should generate consistent hashes for identical matrices', () => {
    const matrix1 = Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 128));
    const matrix2 = Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 128));
    
    const hash1 = phash64FromGrayMatrix(matrix1);
    const hash2 = phash64FromGrayMatrix(matrix2);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(16); // 64 bits = 16 hex chars
  });

  it('should generate different hashes for different matrices', () => {
    const matrix1 = Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 128));
    const matrix2 = Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 0));
    
    const hash1 = phash64FromGrayMatrix(matrix1);
    const hash2 = phash64FromGrayMatrix(matrix2);
    
    expect(hash1).not.toBe(hash2);
  });

  it('should calculate correct Hamming distance', () => {
    const hash1 = '0000000000000000';
    const hash2 = '0000000000000001';
    const hash3 = '0000000000000003';
    
    expect(hammingHex64(hash1, hash1)).toBe(0);
    expect(hammingHex64(hash1, hash2)).toBe(1);
    expect(hammingHex64(hash1, hash3)).toBe(2);
  });

  it('should extract correct bucket from hash', () => {
    const hash = '1234567890abcdef';
    const bucket = bucket16(hash);
    
    expect(bucket).toBe(0x1234);
    expect(bucket).toBeGreaterThanOrEqual(0);
    expect(bucket).toBeLessThanOrEqual(0xFFFF);
  });
});
