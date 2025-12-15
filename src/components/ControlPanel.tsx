import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Upload, Settings2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DetectionSettings } from '@/types/detection';

interface ControlPanelProps {
  isWebcamActive: boolean;
  isModelLoading: boolean;
  settings: DetectionSettings;
  onToggleWebcam: () => void;
  onUploadImage: (file: File) => void;
  onSettingsChange: (settings: DetectionSettings) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isWebcamActive,
  isModelLoading,
  settings,
  onToggleWebcam,
  onUploadImage,
  onSettingsChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-5 border border-primary/20 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm text-primary">Controls</h3>
      </div>

      {/* Main Actions */}
      <div className="space-y-3">
        <Button
          variant={isWebcamActive ? 'destructive' : 'neon'}
          size="lg"
          className="w-full"
          onClick={onToggleWebcam}
          disabled={isModelLoading}
        >
          {isWebcamActive ? (
            <>
              <CameraOff className="w-5 h-5" />
              Stop Webcam
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Start Webcam
            </>
          )}
        </Button>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isModelLoading}
          />
          <Button
            variant="outline"
            size="lg"
            className="w-full pointer-events-none"
            disabled={isModelLoading}
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </Button>
        </div>
      </div>

      {/* Confidence Threshold */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Confidence Threshold</Label>
          <span className="text-sm font-mono text-primary">
            {(settings.confidenceThreshold * 100).toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[settings.confidenceThreshold * 100]}
          min={10}
          max={90}
          step={5}
          onValueChange={([value]) =>
            onSettingsChange({ ...settings, confidenceThreshold: value / 100 })
          }
          className="py-2"
        />
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Bounding Boxes
          </Label>
          <Switch
            checked={settings.showBoundingBoxes}
            onCheckedChange={(checked) =>
              onSettingsChange({ ...settings, showBoundingBoxes: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            😊 Show Emotions
          </Label>
          <Switch
            checked={settings.showEmotions}
            onCheckedChange={(checked) =>
              onSettingsChange({ ...settings, showEmotions: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            😷 Show Mask Status
          </Label>
          <Switch
            checked={settings.showMaskStatus}
            onCheckedChange={(checked) =>
              onSettingsChange({ ...settings, showMaskStatus: checked })
            }
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isModelLoading
                ? 'bg-warning animate-pulse'
                : 'bg-success'
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isModelLoading ? 'Loading AI models...' : 'AI models ready'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
