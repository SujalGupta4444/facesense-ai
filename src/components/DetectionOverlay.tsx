import React from 'react';
import { motion } from 'framer-motion';
import { FaceDetection, DetectionSettings } from '@/types/detection';

interface DetectionOverlayProps {
  detections: FaceDetection[];
  settings: DetectionSettings;
  containerWidth: number;
  containerHeight: number;
}

const EMOTION_EMOJI: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  surprised: '😲',
  fearful: '😨',
  disgusted: '🤢',
};

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detections,
  settings,
  containerWidth,
  containerHeight,
}) => {
  if (!settings.showBoundingBoxes) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detections
        .filter((d) => d.confidence >= settings.confidenceThreshold)
        .map((detection) => {
          const { x, y, width, height } = detection.box;
          
          // Scale coordinates to container size
          const scaleX = containerWidth / 640; // Assuming 640 as base width
          const scaleY = containerHeight / 480; // Assuming 480 as base height
          
          const boxStyle = {
            left: `${x * scaleX}px`,
            top: `${y * scaleY}px`,
            width: `${width * scaleX}px`,
            height: `${height * scaleY}px`,
          };

          const borderColor = detection.hasMask ? 'border-success' : 'border-destructive';
          const shadowColor = detection.hasMask ? 'shadow-glow-success' : 'shadow-glow-destructive';

          return (
            <motion.div
              key={detection.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`detection-box ${borderColor} ${shadowColor}`}
              style={boxStyle}
            >
              {/* Detection info label */}
              <div className="absolute -top-8 left-0 flex gap-2 items-center">
                {/* Mask status */}
                {settings.showMaskStatus && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      detection.hasMask
                        ? 'bg-success/20 text-success border border-success/50'
                        : 'bg-destructive/20 text-destructive border border-destructive/50'
                    }`}
                  >
                    {detection.hasMask ? '✓ Mask' : '✗ No Mask'}
                  </span>
                )}

                {/* Emotion */}
                {settings.showEmotions && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/50">
                    {EMOTION_EMOJI[detection.emotion.emotion]} {detection.emotion.emotion}
                  </span>
                )}
              </div>

              {/* Confidence score */}
              <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
                {(detection.confidence * 100).toFixed(0)}% confident
              </div>

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-current" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-current" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-current" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-current" />
            </motion.div>
          );
        })}
    </div>
  );
};
