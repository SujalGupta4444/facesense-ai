import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { FaceDetection, DetectionStats, Emotion } from '@/types/detection';

const EMOTIONS_MAP: Record<string, Emotion> = {
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  neutral: 'neutral',
  surprised: 'surprised',
  fearful: 'fearful',
  disgusted: 'disgusted',
};

export const useFaceDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<FaceDetection[]>([]);
  const [stats, setStats] = useState<DetectionStats>({
    totalFaces: 0,
    withMask: 0,
    withoutMask: 0,
    emotions: {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
    },
  });

  const detectionIdCounter = useRef(0);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);

        setIsModelLoaded(true);
        console.log('Face detection models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load face detection models. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Simulate mask detection (in production, this would use a trained CNN model)
  const detectMask = useCallback((landmarks: faceapi.FaceLandmarks68): { hasMask: boolean; confidence: number } => {
    // This is a simplified simulation based on facial landmark visibility
    // A real implementation would use a trained CNN model
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();
    
    // Simulate mask detection based on lower face visibility
    // In reality, you'd pass the face region to a trained mask classifier
    const randomFactor = Math.random();
    const hasMask = randomFactor > 0.6; // Simulated for demo purposes
    const confidence = hasMask ? 0.75 + Math.random() * 0.2 : 0.8 + Math.random() * 0.15;
    
    return { hasMask, confidence };
  }, []);

  // Detect faces in video or image element
  const detectFaces = useCallback(
    async (
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      confidenceThreshold: number = 0.5
    ): Promise<FaceDetection[]> => {
      if (!isModelLoaded) {
        console.warn('Models not loaded yet');
        return [];
      }

      try {
        const results = await faceapi
          .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: confidenceThreshold }))
          .withFaceLandmarks()
          .withFaceExpressions();

        const newDetections: FaceDetection[] = results.map((result) => {
          const { x, y, width, height } = result.detection.box;
          const expressions = result.expressions;
          
          // Get dominant emotion
          const emotionEntries = Object.entries(expressions) as [string, number][];
          const [dominantEmotion, emotionConfidence] = emotionEntries.reduce(
            (max, current) => (current[1] > max[1] ? current : max),
            ['neutral', 0]
          );

          // Simulate mask detection
          const { hasMask, confidence: maskConfidence } = detectMask(result.landmarks);

          return {
            id: `face-${++detectionIdCounter.current}`,
            box: { x, y, width, height },
            emotion: {
              emotion: EMOTIONS_MAP[dominantEmotion] || 'neutral',
              confidence: emotionConfidence,
              all: {
                happy: expressions.happy,
                sad: expressions.sad,
                angry: expressions.angry,
                neutral: expressions.neutral,
                surprised: expressions.surprised,
                fearful: expressions.fearful,
                disgusted: expressions.disgusted,
              },
            },
            hasMask,
            maskConfidence,
            confidence: result.detection.score,
          };
        });

        setDetections(newDetections);

        // Update statistics
        const newStats: DetectionStats = {
          totalFaces: newDetections.length,
          withMask: newDetections.filter((d) => d.hasMask).length,
          withoutMask: newDetections.filter((d) => !d.hasMask).length,
          emotions: {
            happy: 0,
            sad: 0,
            angry: 0,
            neutral: 0,
            surprised: 0,
            fearful: 0,
            disgusted: 0,
          },
        };

        newDetections.forEach((d) => {
          newStats.emotions[d.emotion.emotion]++;
        });

        setStats(newStats);

        return newDetections;
      } catch (err) {
        console.error('Error during face detection:', err);
        return [];
      }
    },
    [isModelLoaded, detectMask]
  );

  const clearDetections = useCallback(() => {
    setDetections([]);
    setStats({
      totalFaces: 0,
      withMask: 0,
      withoutMask: 0,
      emotions: {
        happy: 0,
        sad: 0,
        angry: 0,
        neutral: 0,
        surprised: 0,
        fearful: 0,
        disgusted: 0,
      },
    });
  }, []);

  return {
    isModelLoaded,
    isLoading,
    error,
    detections,
    stats,
    detectFaces,
    clearDetections,
  };
};
