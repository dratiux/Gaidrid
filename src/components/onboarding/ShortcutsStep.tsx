import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['G', 'H'], label: 'Switch Viewport to Workspace Home' },
  { keys: ['G', 'S'], label: 'Go to System Settings Panel' },
  { keys: ['V'], label: 'Quick cycle theme accent colors' },
] as const;

export default function ShortcutsStep() {
  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 text-center md:text-left"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase flex items-center gap-2 justify-center md:justify-start">
          Chords & Navigation
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Gaidrid is designed to keep you highly efficient using keyboard-only shortcuts.
        </p>
      </div>

      <div className="space-y-2.5">
        {SHORTCUTS.map((shortcut, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-theme-input-bg/40 border border-theme-border/45">
            <span className="text-xs font-semibold text-theme-text text-left">{shortcut.label}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((k, kIdx) => (
                <kbd key={kIdx} className="font-mono font-black text-[9px] bg-theme-input-bg px-2 py-0.5 rounded border border-theme-border text-theme-text">
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-theme-accent/5 border border-theme-accent/25 text-theme-text p-3 rounded-2xl text-[10px] font-bold text-left">
        <CheckCircle2 size={13} className="text-theme-accent shrink-0" />
        <span>Setup complete! Click 'Launch Workspace' to begin customized operations.</span>
      </div>
    </motion.div>
  );
}
