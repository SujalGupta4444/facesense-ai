import { useCallback, useEffect, useRef, useState } from 'react';

export interface WebcamState {
  isActive: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<WebcamState>({
    isActive: false,
    error: null,
    hasPermission: null,
  });

  // Start webcam
  const startWebcam = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState({
        isActive: true,
        error: null,
        hasPermission: true,
      });

      console.log('Webcam started successfully');
    } catch (err: any) {
      console.error('Error accessing webcam:', err);
      
      let errorMessage = 'Failed to access webcam';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is in use by another application. Please close other apps and try again.';
      }

      setState({
        isActive: false,
        error: errorMessage,
        hasPermission: err.name === 'NotAllowedError' ? false : null,
      });
    }
  }, []);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState((prev) => ({
      ...prev,
      isActive: false,
    }));

    console.log('Webcam stopped');
  }, []);

  // Toggle webcam
  const toggleWebcam = useCallback(() => {
    if (state.isActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  }, [state.isActive, startWebcam, stopWebcam]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    state,
    startWebcam,
    stopWebcam,
    toggleWebcam,
  };
};
