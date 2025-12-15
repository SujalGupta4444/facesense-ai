import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'destructive' | 'warning' | 'secondary';
  delay?: number;
}

const colorClasses = {
  primary: 'text-primary border-primary/30 shadow-glow',
  success: 'text-success border-success/30 shadow-glow-success',
  destructive: 'text-destructive border-destructive/30 shadow-glow-destructive',
  warning: 'text-warning border-warning/30 shadow-glow-warning',
  secondary: 'text-secondary border-secondary/30 shadow-glow-secondary',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card p-4 border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}/10`}>
          <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.p
            key={value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="stats-value text-2xl"
          >
            {value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
