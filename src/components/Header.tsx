import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Brain, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-6"
    >
      <div className="flex items-center justify-center gap-4">
        {/* Logo */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="relative p-3 rounded-full border-2 border-primary bg-background">
            <Scan className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            <span className="text-gradient">VISION</span>
            <span className="text-foreground">AI</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Face Mask Detection & Emotion Recognition
          </p>
        </div>
      </div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 mt-4"
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Brain className="w-4 h-4 text-primary" />
          <span>Real-time AI</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 text-success" />
          <span>Mask Detection</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>😊</span>
          <span>Emotion Recognition</span>
        </div>
      </motion.div>
    </motion.header>
  );
};
