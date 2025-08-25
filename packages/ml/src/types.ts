export interface EmbeddingResult {
  vector: number[];
  model: string;
  confidence?: number;
}

export interface SimilarityResult {
  assetId1: string;
  assetId2: string;
  similarity: number;
  distance: number;
  model: string;
}

export interface ModelConfig {
  name: string;
  version: string;
  inputSize: [number, number];
  outputSize: number;
  description: string;
}

export type EmbeddingModel = 'clip' | 'vgg16' | 'resnet50' | 'efficientnet';

export interface EmbeddingOptions {
  model?: EmbeddingModel;
  normalize?: boolean;
  batchSize?: number;
}
