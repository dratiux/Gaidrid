import { motion } from 'motion/react';
import { UserSettings } from '../../types';
import { THEME_LIST } from '../../lib/constants';
import { THEME_MAP } from '../../lib/themes';

interface ThemeStepProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export default function ThemeStep({ settings, onUpdateSettings }: ThemeStepProps) {
  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase">
          Workspace Aesthetics
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Select a visual theme. Changes apply immediately so you can see them live.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
        {THEME_LIST.map((t) => {
          const theme = THEME_MAP[t.value];
          const isSelected = settings.theme === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onUpdateSettings({ theme: t.value as any })}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-theme-accent bg-theme-accent/5'
                  : 'border-theme-border/40 bg-theme-input-bg/30 hover:border-theme-border/60'
              }`}
            >
              {/* Mini color preview */}
              <div
                className="w-full h-5 rounded-lg mb-2 overflow-hidden relative"
                style={{ backgroundColor: theme.bg }}
              >
                <div
                  className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                <div
                  className="absolute top-3.5 left-1 right-1 bottom-1 rounded-md"
                  style={{ backgroundColor: theme.card }}
                >
                  <div className="h-[2px] rounded-full mt-1.5 mx-1.5" style={{ backgroundColor: theme.textMuted, opacity: 0.5, width: '50%' }} />
                  <div className="h-[2px] rounded-full mt-0.5 mx-1.5" style={{ backgroundColor: theme.textMuted, opacity: 0.3, width: '70%' }} />
                </div>
              </div>
              <span className="text-[9px] font-black block text-theme-text uppercase tracking-wide leading-none truncate">{t.label}</span>
              <span className="text-[8px] text-theme-text-muted font-mono mt-0.5 block leading-none">{t.text}</span>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-theme-accent" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
