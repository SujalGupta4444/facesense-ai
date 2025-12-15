// Types for face detection and emotion recognition

export interface FaceDetection {
  id: string;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  emotion: EmotionResult;
  hasMask: boolean;
  maskConfidence: number;
  confidence: number;
}

export interface EmotionResult {
  emotion: Emotion;
  confidence: number;
  all: Record<Emotion, number>;
}

export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised' | 'fearful' | 'disgusted';

export interface DetectionStats {
  totalFaces: number;
  withMask: number;
  withoutMask: number;
  emotions: Record<Emotion, number>;
}

export interface DetectionSettings {
  confidenceThreshold: number;
  showBoundingBoxes: boolean;
  showEmotions: boolean;
  showMaskStatus: boolean;
}
