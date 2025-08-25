import { ModelConfig } from './types';

// Pre-trained model configurations
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  clip: {
    name: 'CLIP',
    version: '1.0',
    inputSize: [224, 224],
    outputSize: 512,
    description: 'OpenAI CLIP model for image-text similarity'
  },
  vgg16: {
    name: 'VGG16',
    version: '1.0',
    inputSize: [224, 224],
    outputSize: 4096,
    description: 'VGG16 features for image similarity'
  },
  resnet50: {
    name: 'ResNet50',
    version: '1.0',
    inputSize: [224, 224],
    outputSize: 2048,
    description: 'ResNet50 features for image similarity'
  },
  efficientnet: {
    name: 'EfficientNet-B0',
    version: '1.0',
    inputSize: [224, 224],
    outputSize: 1280,
    description: 'EfficientNet-B0 features for image similarity'
  }
};

export function getModelConfig(model: string): ModelConfig | null {
  return MODEL_CONFIGS[model] || null;
}

export function listAvailableModels(): string[] {
  return Object.keys(MODEL_CONFIGS);
}

// Model URLs for downloading pre-trained weights
export const MODEL_URLS = {
  clip: 'https://storage.googleapis.com/dupliclean-models/clip-image-encoder.onnx',
  vgg16: 'https://storage.googleapis.com/dupliclean-models/vgg16-features.onnx',
  resnet50: 'https://storage.googleapis.com/dupliclean-models/resnet50-features.onnx',
  efficientnet: 'https://storage.googleapis.com/dupliclean-models/efficientnet-b0-features.onnx'
};

export function getModelUrl(model: string): string | null {
  return MODEL_URLS[model as keyof typeof MODEL_URLS] || null;
}
