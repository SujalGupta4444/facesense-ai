import React from 'react';
import { motion } from 'framer-motion';
import { Emotion } from '@/types/detection';

interface EmotionChartProps {
  emotions: Record<Emotion, number>;
  totalFaces: number;
}

const EMOTION_DATA: Record<Emotion, { label: string; emoji: string; color: string }> = {
  happy: { label: 'Happy', emoji: '😊', color: 'bg-success' },
  sad: { label: 'Sad', emoji: '😢', color: 'bg-blue-500' },
  angry: { label: 'Angry', emoji: '😠', color: 'bg-destructive' },
  neutral: { label: 'Neutral', emoji: '😐', color: 'bg-muted-foreground' },
  surprised: { label: 'Surprised', emoji: '😲', color: 'bg-warning' },
  fearful: { label: 'Fearful', emoji: '😨', color: 'bg-purple-500' },
  disgusted: { label: 'Disgusted', emoji: '🤢', color: 'bg-green-700' },
};

export const EmotionChart: React.FC<EmotionChartProps> = ({ emotions, totalFaces }) => {
  const maxValue = Math.max(...Object.values(emotions), 1);

  return (
    <div className="glass-card p-4 border border-primary/20">
      <h3 className="font-display text-sm text-primary mb-4">Emotion Distribution</h3>
      
      <div className="space-y-3">
        {(Object.entries(emotions) as [Emotion, number][]).map(([emotion, count], index) => {
          const { label, emoji, color } = EMOTION_DATA[emotion];
          const percentage = totalFaces > 0 ? (count / totalFaces) * 100 : 0;
          const barWidth = (count / maxValue) * 100;

          return (
            <motion.div
              key={emotion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{emoji}</span>
                  <span className="text-muted-foreground">{label}</span>
                </span>
                <span className="text-foreground font-medium">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`h-full ${color} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalFaces === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          No faces detected yet
        </p>
      )}
    </div>
  );
};
