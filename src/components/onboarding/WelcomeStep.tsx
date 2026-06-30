import React from 'react';
import { motion } from 'motion/react';

export default function WelcomeStep() {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-center md:text-left"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-theme-text uppercase">
          Welcome to Gaidrid
        </h1>
        <p className="text-theme-text-muted text-xs leading-relaxed max-w-sm">
          Gaidrid turns your browser tab into a highly customized, distraction-free cockpit and ambient dashboard workspace.
        </p>
      </div>
      <div className="p-4 rounded-2xl bg-theme-input-bg/40 border border-theme-border/40 text-left space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-bold text-theme-text">
          <span>Ambient Workspace Environment</span>
        </div>
        <p className="text-[11px] text-theme-text-muted leading-relaxed">
          Designed to replace chaotic and unorganized default tab spaces with structured widgets: custom notes, a Pomodoro timer, live financial quotes, local weather, calendar schedules, and categorized favorites.
        </p>
      </div>
    </motion.div>
  );
}
