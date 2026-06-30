import { motion } from 'motion/react';

const NAV_SHORTCUTS = [
  { keys: ['G', 'H'], label: 'Go to Home' },
  { keys: ['G', 'W'], label: 'Go to Widgets' },
  { keys: ['G', 'N'], label: 'Go to News' },
  { keys: ['G', 'P'], label: 'Go to Sports' },
  { keys: ['G', 'G'], label: 'Go to Games' },
  { keys: ['G', 'S'], label: 'Go to Settings' },
];

const ACTION_SHORTCUTS = [
  { keys: ['R'], label: 'Reset workspace' },
];

export default function ShortcutsStep() {
  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase">
          Chords & Navigation
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Gaidrid is designed to keep you highly efficient using keyboard-only shortcuts.
        </p>
      </div>

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        {/* Navigation */}
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-theme-text-muted mb-1.5 block">Navigation</span>
          <div className="space-y-1">
            {NAV_SHORTCUTS.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-theme-input-bg/30 border border-theme-border/30">
                <span className="text-[10px] font-semibold text-theme-text">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-mono font-black text-[8px] bg-theme-input-bg px-1.5 py-0.5 rounded border border-theme-border/60 text-theme-text">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-theme-text-muted mb-1.5 block">Actions</span>
          <div className="space-y-1">
            {ACTION_SHORTCUTS.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-theme-input-bg/30 border border-theme-border/30">
                <span className="text-[10px] font-semibold text-theme-text">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-mono font-black text-[8px] bg-theme-input-bg px-1.5 py-0.5 rounded border border-theme-border/60 text-theme-text">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
