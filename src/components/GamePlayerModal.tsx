import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, MousePointer } from 'lucide-react';
import { ModalCloseButton } from './ui/ModalCloseButton';

interface Game {
  id: string;
  title: string;
  game_url: string;
  thumbnail: string;
  genre: string;
  short_description: string;
}

interface GamePlayerModalProps {
  game: Game;
  onClose: () => void;
}

export default function GamePlayerModal({ game, onClose }: GamePlayerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);

  useEffect(() => {
    const handleLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === playAreaRef.current);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  const requestPlayMode = () => {
    playAreaRef.current?.requestPointerLock();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[500] p-4 md:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Play ${game.title}`}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-theme-card border border-theme-border rounded-3xl overflow-hidden flex flex-col h-[85vh] max-h-[720px] shadow-2xl relative"
      >
        {/* Header — same style as widget modals */}
        <div className="flex items-center justify-between border-b border-theme-border/30 px-6 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-lg bg-theme-accent text-theme-accent-text text-[9px] font-bold uppercase tracking-wider shrink-0">
              {game.genre}
            </span>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted truncate">
              {game.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-4">
            <button
              onClick={requestPlayMode}
              type="button"
              title="Lock cursor for play mode"
              aria-label={isPointerLocked ? 'Play Mode Active' : 'Lock Mouse'}
              className={`h-8 w-8 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                isPointerLocked
                  ? 'bg-theme-input-bg border-theme-accent text-theme-accent'
                  : 'bg-theme-input-bg border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border'
              }`}
            >
              <MousePointer size={14} className={isPointerLocked ? 'animate-pulse' : ''} />
            </button>
            <button
              onClick={toggleFullscreen}
              type="button"
              title="Toggle Fullscreen"
              aria-label="Toggle Fullscreen"
              className="h-8 w-8 rounded-xl flex items-center justify-center cursor-pointer transition-all border bg-theme-input-bg border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <ModalCloseButton onClick={onClose} />
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={playAreaRef}
          onClick={requestPlayMode}
          className="flex-1 bg-theme-bg flex items-center justify-center relative overflow-hidden select-none cursor-crosshair focus:outline-none"
          tabIndex={0}
        >
          <iframe
            src={game.game_url}
            title={game.title}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock"
            allow="autoplay; fullscreen; pointer-lock"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
