import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward, X } from 'lucide-react';
import { WidgetHeader } from './ui/WidgetHeader';
import { IconButton } from './ui/IconButton';

interface PomodoroWidgetProps {
  onRemove?: () => void;
}

export default function PomodoroWidget({ onRemove }: PomodoroWidgetProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [duration, setDuration] = useState(25); // minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const saved = localStorage.getItem('gaidrid_sessions_completed');
    return saved ? parseInt(saved, 10) : 3;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or resume AudioContext on user interaction to bypass browser policies
  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Audio Context is not supported.', e);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch((err) => console.warn('Failed to resume AudioContext:', err));
    }
  };

  // Sound generator using Web Audio API
  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain1.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.2);
      osc2.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio Context is not supported.', e);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChimeSound();
            
            if (!isBreak) {
              const nextSessions = sessionsCompleted + 1;
              setSessionsCompleted(nextSessions);
              localStorage.setItem('gaidrid_sessions_completed', String(nextSessions));
              setIsBreak(true);
              return 5 * 60; // 5 min break
            } else {
              setIsBreak(false);
              return duration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak, duration, sessionsCompleted]);

  const handleToggleTimer = () => {
    initAudioContext();
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    initAudioContext();
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : duration * 60);
  };

  const handleSkipTimer = () => {
    initAudioContext();
    setIsRunning(false);
    if (!isBreak) {
      setIsBreak(true);
      setTimeLeft(5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(duration * 60);
    }
  };

  const handleDurationChange = (minutes: number) => {
    initAudioContext();
    setDuration(minutes);
    if (!isBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      if (action === 'toggle') {
        handleToggleTimer();
      } else if (action === 'reset') {
        handleResetTimer();
      } else if (action === 'skip') {
        handleSkipTimer();
      } else if (action === 'focus-15') {
        handleDurationChange(15);
      } else if (action === 'focus-25') {
        handleDurationChange(25);
      } else if (action === 'focus-45') {
        handleDurationChange(45);
      }
    };
    window.addEventListener('gaidrid-pomodoro-action', handleAction);
    return () => {
      window.removeEventListener('gaidrid-pomodoro-action', handleAction);
    };
  }, [isRunning, isBreak, duration, sessionsCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalSeconds = isBreak ? 5 * 60 : duration * 60;
  const progressPercent = (timeLeft / totalSeconds) * 100;
  // Circumference = 2 * PI * r = 2 * PI * 44 = ~276.46
  const strokeDashoffset = 276.46 - (276.46 * progressPercent) / 100;

  return (
    <div id="widget-pomodoro" className="flex flex-col h-full justify-between p-5 select-none animate-fade-in">
      <WidgetHeader
        title={isBreak ? 'Break' : 'Pomodoro'}
        actions={
          <>
            <IconButton
              onClick={() => {
                initAudioContext();
                setSoundEnabled(!soundEnabled);
              }}
              variant="accent"
              icon={soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              label={soundEnabled ? 'Mute alert sound' : 'Unmute alert sound'}
              title={soundEnabled ? 'Mute Alert Sound' : 'Unmute Alert Sound'}
            />
            {onRemove && (
              <IconButton
                onClick={onRemove}
                variant="danger"
                icon={<X size={12} />}
                label="Remove Pomodoro widget"
                title="Remove Widget"
              />
            )}
          </>
        }
      />

      {/* Main Focus Clock Body */}
      <div className="flex-1 flex flex-col justify-center items-center py-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Perfect Thin Circular Progress Gauge */}
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-theme-input-bg/40 fill-transparent"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`fill-transparent transition-all duration-300 ${
                isBreak 
                  ? 'stroke-emerald-500/80 dark:stroke-emerald-400/85' 
                  : 'stroke-theme-accent'
              }`}
              strokeWidth="3"
              strokeDasharray="276.46"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Central Digital Readout */}
          <div className="text-center z-10 flex flex-col items-center" role="timer" aria-live="polite" aria-label={`Timer: ${formatTime(timeLeft)}, ${isRunning ? 'active' : 'paused'}`}>
            <span className="text-[28px] font-bold font-mono tracking-tighter text-theme-text leading-none select-text">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-theme-text-muted/65 mt-1 font-mono block">
              {isRunning ? 'active' : 'paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Control Tray */}
      <div className="space-y-3.5 shrink-0">
        <div className="flex items-center gap-2">
          {/* Reset Action */}
          <button
            onClick={handleResetTimer}
            aria-label="Reset timer"
            className="p-2.5 rounded-xl border border-theme-border/40 bg-theme-input-bg/15 hover:bg-theme-input-bg/45 text-theme-text-muted hover:text-theme-text cursor-pointer transition-all duration-200"
            title="Reset active interval"
          >
            <RotateCcw size={11} className="stroke-[2.5]" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={handleToggleTimer}
            aria-label={isRunning ? 'Pause timer' : isBreak ? 'Start break' : 'Start focus session'}
            className={`flex-1 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 font-mono ${
              isRunning
                ? 'bg-theme-input-bg border border-theme-border/80 text-theme-text hover:border-theme-accent/40 hover:text-theme-accent'
                : isBreak
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
                : 'bg-theme-accent text-theme-accent-text hover:bg-theme-accent-hover active:scale-[0.98]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={10} className="stroke-[3]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={10} className="stroke-[3]" />
                <span>{isBreak ? 'Start Break' : 'Start Focus'}</span>
              </>
            )}
          </button>

          {/* Skip Action */}
          <button
            onClick={handleSkipTimer}
            aria-label="Skip current session"
            className="p-2.5 rounded-xl border border-theme-border/40 bg-theme-input-bg/15 hover:bg-theme-input-bg/45 text-theme-text-muted hover:text-theme-text cursor-pointer transition-all duration-200"
            title="Skip current segment"
          >
            <SkipForward size={11} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic Interval Adjuster */}
        <div className="flex justify-between items-center pt-2.5 border-t border-theme-border/30 mt-2">
          <span className="text-[9px] text-theme-text-muted font-bold font-mono uppercase tracking-wider">
            Focus Session
          </span>
          <div className="flex gap-1">
            {[15, 25, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                disabled={isBreak}
                aria-label={`Set focus duration to ${mins} minutes`}
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md transition-all cursor-pointer font-mono tracking-wider flex items-center justify-center h-5 ${
                  duration === mins && !isBreak
                    ? 'bg-theme-accent text-theme-accent-text font-black scale-[1.02]'
                    : 'text-theme-text-muted hover:bg-theme-input-bg/50 disabled:opacity-30 disabled:pointer-events-none'
                }`}
              >
                {mins}M
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
