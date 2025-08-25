import { SimilarityResult, EmbeddingModel } from './types';
import { computeCosineSimilarity, normalizeEmbedding } from './embeddings';
import { hammingHex64 } from '@dupli/hashing';

export interface SimilarityOptions {
  hashThreshold?: number; // Hamming distance threshold for perceptual hashes
  embeddingThreshold?: number; // Cosine similarity threshold for embeddings
  model?: EmbeddingModel;
  useBoth?: boolean; // Use both hash and embedding similarity
}

export class SimilarityDetector {
  private options: Required<SimilarityOptions>;

  constructor(options: SimilarityOptions = {}) {
    this.options = {
      hashThreshold: options.hashThreshold ?? 5,
      embeddingThreshold: options.embeddingThreshold ?? 0.85,
      model: options.model ?? 'clip',
      useBoth: options.useBoth ?? true
    };
  }

  /**
   * Check if two assets are similar using perceptual hashing
   */
  checkHashSimilarity(hash1: string, hash2: string): boolean {
    const distance = hammingHex64(hash1, hash2);
    return distance <= this.options.hashThreshold;
  }

  /**
   * Check if two embeddings are similar using cosine similarity
   */
  checkEmbeddingSimilarity(embedding1: number[], embedding2: number[]): boolean {
    const similarity = computeCosineSimilarity(embedding1, embedding2);
    return similarity >= this.options.embeddingThreshold;
  }

  /**
   * Comprehensive similarity check using both hash and embedding
   */
  checkSimilarity(
    hash1: string,
    hash2: string,
    embedding1?: number[],
    embedding2?: number[]
  ): SimilarityResult {
    const hashSimilar = this.checkHashSimilarity(hash1, hash2);
    const hashDistance = hammingHex64(hash1, hash2);
    
    let embeddingSimilar = false;
    let embeddingSimilarity = 0;
    
    if (embedding1 && embedding2) {
      embeddingSimilarity = computeCosineSimilarity(embedding1, embedding2);
      embeddingSimilar = embeddingSimilarity >= this.options.embeddingThreshold;
    }

    // Determine overall similarity
    let isSimilar = false;
    if (this.options.useBoth && embedding1 && embedding2) {
      // Both methods must agree for high confidence
      isSimilar = hashSimilar && embeddingSimilar;
    } else if (embedding1 && embedding2) {
      // Use embedding as primary, hash as secondary
      isSimilar = embeddingSimilar || (hashSimilar && embeddingSimilarity > 0.7);
    } else {
      // Fallback to hash only
      isSimilar = hashSimilar;
    }

    return {
      assetId1: '', // Will be set by caller
      assetId2: '', // Will be set by caller
      similarity: embeddingSimilarity,
      distance: hashDistance,
      model: this.options.model
    };
  }

  /**
   * Find similar assets in a collection
   */
  findSimilarAssets(
    targetHash: string,
    targetEmbedding: number[],
    candidates: Array<{
      id: string;
      hash: string;
      embedding?: number[];
    }>
  ): Array<{ id: string; similarity: SimilarityResult }> {
    const similar: Array<{ id: string; similarity: SimilarityResult }> = [];

    for (const candidate of candidates) {
      const similarity = this.checkSimilarity(
        targetHash,
        candidate.hash,
        targetEmbedding,
        candidate.embedding
      );

      if (similarity.similarity >= this.options.embeddingThreshold || 
          similarity.distance <= this.options.hashThreshold) {
        similar.push({
          id: candidate.id,
          similarity: {
            ...similarity,
            assetId1: '', // Will be set by caller
            assetId2: candidate.id
          }
        });
      }
    }

    // Sort by similarity score
    return similar.sort((a, b) => b.similarity.similarity - a.similarity.similarity);
  }

  /**
   * Batch similarity detection for multiple assets
   */
  batchSimilarityDetection(
    assets: Array<{
      id: string;
      hash: string;
      embedding?: number[];
    }>
  ): Array<{ asset1: string; asset2: string; similarity: SimilarityResult }> {
    const results: Array<{ asset1: string; asset2: string; similarity: SimilarityResult }> = [];

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const asset1 = assets[i];
        const asset2 = assets[j];

        const similarity = this.checkSimilarity(
          asset1.hash,
          asset2.hash,
          asset1.embedding,
          asset2.embedding
        );

        if (similarity.similarity >= this.options.embeddingThreshold || 
            similarity.distance <= this.options.hashThreshold) {
          results.push({
            asset1: asset1.id,
            asset2: asset2.id,
            similarity: {
              ...similarity,
              assetId1: asset1.id,
              assetId2: asset2.id
            }
          });
        }
      }
    }

    return results;
  }
}

// Factory function to create similarity detector
export function createSimilarityDetector(options: SimilarityOptions = {}): SimilarityDetector {
  return new SimilarityDetector(options);
}

// Utility function to compute similarity score from multiple metrics
export function computeCombinedSimilarity(
  hashDistance: number,
  embeddingSimilarity: number,
  weights: { hash: number; embedding: number } = { hash: 0.3, embedding: 0.7 }
): number {
  const normalizedHashScore = Math.max(0, 1 - hashDistance / 64); // Normalize hash distance
  return weights.hash * normalizedHashScore + weights.embedding * embeddingSimilarity;
}
