import { hammingHex64 } from './phash';

export function hammingDistance(aHex: string, bHex: string): number {
  return hammingHex64(aHex, bHex);
}

export function isSimilar(phashA: string, phashB: string, threshold: number = 5): boolean {
  return hammingDistance(phashA, phashB) <= threshold;
}

export function isNearDuplicate(
  phashA: string, 
  phashB: string, 
  ahashA?: string, 
  ahashB?: string, 
  dhashA?: string, 
  dhashB?: string
): boolean {
  const phashDist = hammingDistance(phashA, phashB);
  
  // Primary threshold
  if (phashDist <= 5) return true;
  
  // Secondary threshold with other hashes
  if (phashDist <= 10) {
    if (ahashA && ahashB && hammingDistance(ahashA, ahashB) <= 5) return true;
    if (dhashA && dhashB && hammingDistance(dhashA, dhashB) <= 5) return true;
  }
  
  return false;
}
