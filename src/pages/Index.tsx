import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { VideoCanvas } from '@/components/VideoCanvas';
import { ControlPanel } from '@/components/ControlPanel';
import { Dashboard } from '@/components/Dashboard';
import { useWebcam } from '@/hooks/useWebcam';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { DetectionSettings } from '@/types/detection';

const Index: React.FC = () => {
  const { videoRef, state: webcamState, toggleWebcam } = useWebcam();
  const { isModelLoaded, isLoading, error, detections, stats, detectFaces, clearDetections } =
    useFaceDetection();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<DetectionSettings>({
    confidenceThreshold: 0.5,
    showBoundingBoxes: true,
    showEmotions: true,
    showMaskStatus: true,
  });

  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>();
  const lastDetectionTime = useRef<number>(0);
  const DETECTION_INTERVAL = 100; // Run detection every 100ms for smoother performance

  // Handle model loading errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Run detection loop for webcam
  useEffect(() => {
    if (!webcamState.isActive || !isModelLoaded || !videoRef.current) {
      return;
    }

    const runDetection = async (timestamp: number) => {
      if (timestamp - lastDetectionTime.current >= DETECTION_INTERVAL) {
        if (videoRef.current && videoRef.current.readyState === 4) {
          await detectFaces(videoRef.current, settings.confidenceThreshold);
        }
        lastDetectionTime.current = timestamp;
      }
      animationFrameRef.current = requestAnimationFrame(runDetection);
    };

    animationFrameRef.current = requestAnimationFrame(runDetection);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [webcamState.isActive, isModelLoaded, detectFaces, settings.confidenceThreshold]);

  // Handle webcam toggle
  const handleToggleWebcam = useCallback(() => {
    if (!webcamState.isActive) {
      setUploadedImage(null);
      clearDetections();
    }
    toggleWebcam();
  }, [webcamState.isActive, toggleWebcam, clearDetections]);

  // Handle image upload
  const handleUploadImage = useCallback(
    async (file: File) => {
      if (!isModelLoaded) {
        toast.error('Please wait for AI models to load');
        return;
      }

      // Stop webcam if active
      if (webcamState.isActive) {
        toggleWebcam();
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);

        // Create image element for detection
        const img = new Image();
        img.onload = async () => {
          uploadedImageRef.current = img;
          await detectFaces(img, settings.confidenceThreshold);
          toast.success(`Detected ${stats.totalFaces} face(s) in the image`);
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    },
    [isModelLoaded, webcamState.isActive, toggleWebcam, detectFaces, settings.confidenceThreshold, stats.totalFaces]
  );

  // Re-run detection when confidence threshold changes for uploaded image
  useEffect(() => {
    if (uploadedImageRef.current && uploadedImage && !webcamState.isActive) {
      detectFaces(uploadedImageRef.current, settings.confidenceThreshold);
    }
  }, [settings.confidenceThreshold, uploadedImage, webcamState.isActive, detectFaces]);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Video/Canvas Area - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-4">
            <VideoCanvas
              ref={videoRef}
              isWebcamActive={webcamState.isActive}
              isModelLoading={isLoading}
              uploadedImage={uploadedImage}
              detections={detections}
              settings={settings}
              webcamError={webcamState.error}
            />

            {/* Dashboard */}
            <Dashboard stats={stats} />
          </div>

          {/* Control Panel - Right sidebar on large screens */}
          <div className="lg:col-span-1">
            <ControlPanel
              isWebcamActive={webcamState.isActive}
              isModelLoading={isLoading}
              settings={settings}
              onToggleWebcam={handleToggleWebcam}
              onUploadImage={handleUploadImage}
              onSettingsChange={setSettings}
            />

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 border border-border/50 mt-4"
            >
              <h4 className="font-display text-sm text-primary mb-2">About This App</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This AI-powered application uses TensorFlow.js and face-api.js to perform 
                real-time face detection and emotion recognition directly in your browser. 
                No data is sent to any server.
              </p>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="text-warning">⚠️ Note:</span> Mask detection is simulated 
                  in this demo. A production system would use a trained CNN model.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
