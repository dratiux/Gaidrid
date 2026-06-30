import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { UserSettings } from '../types';
import WelcomeStep from './onboarding/WelcomeStep';
import NameStep from './onboarding/NameStep';
import WidgetsStep from './onboarding/WidgetsStep';
import ThemeStep from './onboarding/ThemeStep';
import ShortcutsStep from './onboarding/ShortcutsStep';

interface OnboardingProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onComplete: () => void;
}

export default function Onboarding({ settings, onUpdateSettings, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;
  const [usernameError, setUsernameError] = useState<string>('');

  const handleNext = () => {
    if (step === 2) {
      if (!settings.username || !settings.username.trim()) {
        setUsernameError('Name is required. Please enter your name.');
        return;
      } else {
        setUsernameError('');
      }
    }
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xl flex items-center justify-center z-[200] p-4 select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-lg bg-theme-card border border-theme-border rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]"
      >
        {/* Step Indicator dots top-right */}
        <div className="absolute top-8 right-8 flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i + 1 ? 'w-6 bg-theme-accent' : 'w-1.5 bg-theme-border/60'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Content step-by-step with AnimatePresence */}
        <div className="flex-1 flex flex-col justify-center mt-4">
          <AnimatePresence mode="wait">
            {step === 1 && <WelcomeStep />}
            {step === 2 && (
              <NameStep
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                usernameError={usernameError}
                onClearUsernameError={() => setUsernameError('')}
              />
            )}
            {step === 3 && (
              <WidgetsStep
                settings={settings}
                onUpdateSettings={onUpdateSettings}
              />
            )}
            {step === 4 && (
              <ThemeStep
                settings={settings}
                onUpdateSettings={onUpdateSettings}
              />
            )}
            {step === 5 && <ShortcutsStep />}
          </AnimatePresence>
        </div>

        {/* Navigation Action Buttons footer */}
        <div className="flex items-center justify-between border-t border-theme-border/30 pt-6 mt-6 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className={`h-10 px-4 rounded-xl text-xs font-bold border border-theme-border/60 text-theme-text-muted flex items-center gap-1.5 transition-all cursor-pointer hover:text-theme-text hover:border-theme-border ${
              step === 1 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft size={13} /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="h-10 px-5 rounded-xl text-xs font-black uppercase tracking-wider bg-theme-accent hover:opacity-90 text-theme-accent-text flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-theme-accent/10 active:scale-98"
          >
            {step === totalSteps ? 'Launch Workspace' : 'Continue'} <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
