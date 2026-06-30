import React from 'react';
import { motion } from 'motion/react';
import { UserSettings } from '../../types';
import { SEARCH_ENGINE_LIST } from '../../lib/constants';

interface NameStepProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  usernameError: string;
  onClearUsernameError: () => void;
}

export default function NameStep({ settings, onUpdateSettings, usernameError, onClearUsernameError }: NameStepProps) {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase flex items-center gap-2">
          Operator Identity
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Define your workspace name and the default search command engine.
        </p>
      </div>

      {/* Operator Name */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase font-black tracking-wider text-theme-text-muted font-mono">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={settings.username}
          onChange={(e) => {
            onUpdateSettings({ username: e.target.value });
            if (e.target.value.trim()) {
              onClearUsernameError();
            }
          }}
          placeholder="Enter your name..."
          className={`w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition-all font-semibold ${
            usernameError
              ? 'border-red-500 focus:border-red-500'
              : 'border-theme-border/65 focus:border-theme-accent'
          }`}
        />
        {usernameError && (
          <span className="text-[10px] text-red-500 font-bold block mt-1 animate-pulse">
            {usernameError}
          </span>
        )}
      </div>

      {/* Search Engine Select */}
      <div className="space-y-2">
        <label className="block text-[10px] uppercase font-black tracking-wider text-theme-text-muted font-mono">
          Default Search Engine Command
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SEARCH_ENGINE_LIST.map((se) => (
            <button
              key={se.value}
              type="button"
              onClick={() => onUpdateSettings({ searchEngine: se.value as any })}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                settings.searchEngine === se.value
                  ? 'bg-theme-accent/5 border-theme-accent text-theme-text'
                  : 'bg-theme-input-bg/40 border-theme-border/50 text-theme-text-muted hover:border-theme-border'
              }`}
            >
              <span className="text-xs font-black uppercase tracking-wider">{se.label}</span>
              <span className="text-[9px] text-theme-text-muted mt-1 leading-snug">{se.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
