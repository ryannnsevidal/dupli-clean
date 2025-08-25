import sharp from 'sharp';
import { EmbeddingResult, EmbeddingOptions, EmbeddingModel } from './types';
import { getModelConfig } from './models';

// Simple embedding generator using image features
// In a production environment, this would use actual pre-trained models
export class EmbeddingGenerator {
  private model: EmbeddingModel;
  private config: any;

  constructor(model: EmbeddingModel = 'clip') {
    this.model = model;
    this.config = getModelConfig(model);
  }

  async generateEmbedding(imageBuffer: Buffer): Promise<EmbeddingResult> {
    try {
      // Preprocess image
      const processedImage = await this.preprocessImage(imageBuffer);
      
      // Generate embedding (simplified version)
      const embedding = await this.extractFeatures(processedImage);
      
      return {
        vector: embedding,
        model: this.model,
        confidence: 0.95
      };
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    const config = this.config;
    if (!config) {
      throw new Error(`Model config not found for ${this.model}`);
    }

    const [width, height] = config.inputSize;
    
    return await sharp(imageBuffer)
      .resize(width, height, { fit: 'fill' })
      .removeAlpha()
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  private async extractFeatures(imageBuffer: Buffer): Promise<number[]> {
    // Simplified feature extraction
    // In production, this would use actual ML models
    const pixels = new Uint8Array(imageBuffer);
    
    // Create a simple feature vector based on image statistics
    const features: number[] = [];
    
    // Average RGB values
    let rSum = 0, gSum = 0, bSum = 0;
    for (let i = 0; i < pixels.length; i += 3) {
      rSum += pixels[i];
      gSum += pixels[i + 1];
      bSum += pixels[i + 2];
    }
    
    const pixelCount = pixels.length / 3;
    features.push(rSum / pixelCount / 255);
    features.push(gSum / pixelCount / 255);
    features.push(bSum / pixelCount / 255);
    
    // Add some texture features (simplified)
    for (let i = 0; i < 10; i++) {
      features.push(Math.random() * 0.1); // Placeholder for texture features
    }
    
    // Pad to expected size
    const expectedSize = this.config?.outputSize || 512;
    while (features.length < expectedSize) {
      features.push(0);
    }
    
    return features.slice(0, expectedSize);
  }

  async generateBatchEmbeddings(imageBuffers: Buffer[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];
    
    for (const buffer of imageBuffers) {
      try {
        const result = await this.generateEmbedding(buffer);
        results.push(result);
      } catch (error) {
        console.error('Error processing image in batch:', error);
        // Continue with other images
      }
    }
    
    return results;
  }
}

// Factory function to create embedding generator
export function createEmbeddingGenerator(options: EmbeddingOptions = {}): EmbeddingGenerator {
  return new EmbeddingGenerator(options.model);
}

// Utility function to normalize embeddings
export function normalizeEmbedding(embedding: number[]): number[] {
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return embedding;
  
  return embedding.map(val => val / magnitude);
}

// Utility function to compute embedding similarity
export function computeCosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  
  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) return 0;
  
  return dotProduct / denominator;
}
