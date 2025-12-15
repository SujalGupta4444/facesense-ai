import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ShieldOff, Activity } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { EmotionChart } from './EmotionChart';
import { DetectionStats } from '@/types/detection';

interface DashboardProps {
  stats: DetectionStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Faces"
          value={stats.totalFaces}
          icon={Users}
          color="primary"
          delay={0}
        />
        <StatsCard
          title="With Mask"
          value={stats.withMask}
          icon={ShieldCheck}
          color="success"
          delay={0.1}
        />
        <StatsCard
          title="No Mask"
          value={stats.withoutMask}
          icon={ShieldOff}
          color="destructive"
          delay={0.2}
        />
        <StatsCard
          title="Detection Rate"
          value={stats.totalFaces > 0 ? '~30 FPS' : '—'}
          icon={Activity}
          color="secondary"
          delay={0.3}
        />
      </div>

      {/* Emotion Chart */}
      <EmotionChart emotions={stats.emotions} totalFaces={stats.totalFaces} />
    </motion.div>
  );
};
