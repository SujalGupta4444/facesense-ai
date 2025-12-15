import React, { useRef, useEffect, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { DetectionOverlay } from './DetectionOverlay';
import { FaceDetection, DetectionSettings } from '@/types/detection';

interface VideoCanvasProps {
  isWebcamActive: boolean;
  isModelLoading: boolean;
  uploadedImage: string | null;
  detections: FaceDetection[];
  settings: DetectionSettings;
  webcamError: string | null;
}

export const VideoCanvas = forwardRef<HTMLVideoElement, VideoCanvasProps>(
  ({ isWebcamActive, isModelLoading, uploadedImage, detections, settings, webcamError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 640, height: 480 });

    // Update dimensions on resize
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDimensions({
            width: rect.width,
            height: rect.height,
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const renderPlaceholder = () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
      >
        {isModelLoading ? (
          <>
            <Loader2 className="w-16 h-16 mb-4 animate-spin text-primary" />
            <p className="font-display text-lg neon-text">Loading AI Models...</p>
            <p className="text-sm mt-2">This may take a few seconds</p>
          </>
        ) : webcamError ? (
          <>
            <Camera className="w-16 h-16 mb-4 text-destructive" />
            <p className="text-destructive text-center px-8">{webcamError}</p>
          </>
        ) : (
          <>
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-display text-lg">No Video Feed</p>
            <p className="text-sm mt-2">Start the webcam or upload an image</p>
          </>
        )}
      </motion.div>
    );

    return (
      <div
        ref={containerRef}
        className="relative aspect-video glass-card border border-primary/30 overflow-hidden glow-border"
      >
        {/* Scan line effect */}
        {isWebcamActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="scan-line absolute inset-0" />
          </div>
        )}

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary/50" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary/50" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary/50" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary/50" />

        {/* Video element */}
        <AnimatePresence mode="wait">
          {isWebcamActive && !webcamError && (
            <motion.video
              key="video"
              ref={ref}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          )}

          {uploadedImage && !isWebcamActive && (
            <motion.img
              key="image"
              src={uploadedImage}
              alt="Uploaded for detection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {!isWebcamActive && !uploadedImage && renderPlaceholder()}
        </AnimatePresence>

        {/* Detection overlay */}
        <DetectionOverlay
          detections={detections}
          settings={settings}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />

        {/* Live indicator */}
        {isWebcamActive && !webcamError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/50"
          >
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-medium text-destructive">LIVE</span>
          </motion.div>
        )}

        {/* Detection count */}
        {detections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/50"
          >
            <span className="text-xs font-display text-primary">
              {detections.length} face{detections.length !== 1 ? 's' : ''} detected
            </span>
          </motion.div>
        )}
      </div>
    );
  }
);

VideoCanvas.displayName = 'VideoCanvas';
