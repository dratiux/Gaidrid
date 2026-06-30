import React from 'react';
import { motion } from 'motion/react';
import { UserSettings } from '../../types';
import { THEME_LIST } from '../../lib/constants';

interface ThemeStepProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const THEMES_PREVIEW = THEME_LIST.slice(0, 6);

export default function ThemeStep({ settings, onUpdateSettings }: ThemeStepProps) {
  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase flex items-center gap-2">
          Workspace Aesthetics
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Select a visual theme accent. Changes will apply immediately in the background so you can see them live.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
        {THEMES_PREVIEW.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onUpdateSettings({ theme: t.value as any })}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
              settings.theme === t.value
                ? 'border-theme-accent bg-theme-accent/5'
                : 'border-theme-border/50 bg-theme-input-bg/40 hover:border-theme-border'
            }`}
          >
            <div
              className="w-5 h-5 rounded-full border border-theme-border/60 shrink-0 flex items-center justify-center shadow-inner relative"
              style={{ backgroundColor: t.color }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: t.accent }}
              />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block text-theme-text uppercase tracking-wide leading-none">{t.label}</span>
              <span className="text-[9px] text-theme-text-muted font-mono mt-0.5 block">{t.text}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
