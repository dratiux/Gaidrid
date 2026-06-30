import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, ShieldAlert, ToggleLeft, Settings, Trash, Check, Plus, AlertTriangle, Calendar, BookOpen, Key, Sparkles, Activity } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTodo: (text: string) => void;
  onAddNote: (title: string, content: string) => void;
  onAddEvent: (title: string) => void;
  onToggleSidebar: () => void;
  onNavigate: (tab: 'home' | 'settings') => void;
  onResetWorkspace: () => void;
  initialStep?: 'list' | 'add-todo' | 'add-note' | 'add-event';
}

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onAddTodo,
  onAddNote,
  onAddEvent,
  onToggleSidebar,
  onNavigate,
  onResetWorkspace,
  initialStep = 'list'
}: CommandPaletteProps) {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actionStep, setActionStep] = useState<'list' | 'add-todo' | 'add-note' | 'add-event'>(initialStep);
  
  // Custom inputs for sub-actions
  const [todoInput, setTodoInput] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [eventTitle, setEventTitle] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items declaration
  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Go to Main Workspace',
      subtitle: 'View active widgets and clocks',
      icon: Compass,
      action: () => { onNavigate('home'); onClose(); },
      shortcut: 'G H'
    },
    {
      id: 'nav-widgets',
      category: 'Navigation',
      title: 'Configure Widget Modules',
      subtitle: 'Arrange layouts and visibility in Settings',
      icon: Settings,
      action: () => { onNavigate('settings'); onClose(); },
      shortcut: 'G W'
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      title: 'Focus Pomodoro Timer',
      subtitle: 'Deep work tracker on Dashboard',
      icon: Compass,
      action: () => { onNavigate('home'); onClose(); },
      shortcut: 'G A'
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      title: 'Open System Settings',
      subtitle: 'Preferences and data backups',
      icon: Settings,
      action: () => { onNavigate('settings'); onClose(); },
      shortcut: 'G S'
    },
    {
      id: 'nav-shortcuts',
      category: 'Navigation',
      title: 'Open Commands & Shortcuts',
      subtitle: 'List keyboard actions & preferences',
      icon: Key,
      action: () => { onNavigate('settings'); onClose(); },
      shortcut: 'G K'
    },
    {
      id: 'create-todo',
      category: 'Actions',
      title: 'Create Todo Task...',
      subtitle: 'Add a new priority checklist item',
      icon: Plus,
      action: () => setActionStep('add-todo'),
      shortcut: 'T'
    },
    {
      id: 'create-note',
      category: 'Actions',
      title: 'Write Notepad Note...',
      subtitle: 'Compose a quick idea clipping',
      icon: BookOpen,
      action: () => setActionStep('add-note'),
      shortcut: 'N'
    },
    {
      id: 'create-event',
      category: 'Actions',
      title: 'Schedule Meeting Event...',
      subtitle: 'Book a briefing into calendar',
      icon: Calendar,
      action: () => setActionStep('add-event'),
      shortcut: 'C'
    },
    {
      id: 'toggle-sidebar',
      category: 'System',
      title: 'Toggle Sidebar Expand',
      subtitle: 'Expand or collapse side rail',
      icon: ToggleLeft,
      action: () => { onToggleSidebar(); onClose(); },
      shortcut: 'S'
    },
    {
      id: 'reset-desktop',
      category: 'System',
      title: 'Reset Workspace to Defaults',
      subtitle: 'Restore factory seeds & layout',
      icon: Trash,
      action: () => {
        if (confirm('Are you sure you want to reset all data?')) {
          onResetWorkspace();
          onClose();
        }
      },
      shortcut: 'R'
    },
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(filter.toLowerCase()) ||
    cmd.category.toLowerCase().includes(filter.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(filter.toLowerCase())
  );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      // Reset steps to initialStep
      setActionStep(initialStep);
      setFilter('');
      setSelectedIndex(0);
    }
  }, [isOpen, initialStep]);

  // Handle outside click click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (actionStep === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, actionStep, selectedIndex, filteredCommands, onClose]);

  // Action Sub-submits
  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    onAddTodo(todoInput.trim());
    setTodoInput('');
    onClose();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    onAddNote(noteTitle.trim(), noteContent.trim());
    setNoteTitle('');
    setNoteContent('');
    onClose();
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    onAddEvent(eventTitle.trim());
    setEventTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="command-palette-overlay" className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      
      <div
        ref={modalRef}
        id="command-palette-card"
        className="w-full max-w-xl bg-theme-card border border-theme-border rounded-3xl overflow-hidden flex flex-col max-h-[480px] animate-scale-up"
      >
        {actionStep === 'list' ? (
          <>
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-theme-border">
              <Search size={18} className="text-theme-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or keyword to search..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-none focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-accent/30 text-xs text-theme-text placeholder-theme-text-muted font-medium"
              />
            </div>

            {/* Commands List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-theme-text-muted flex flex-col items-center justify-center gap-2">
                  <AlertTriangle size={18} />
                  <span>No matching commands or actions found.</span>
                </div>
              ) : (
                filteredCommands.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const isSelected = selectedIndex === i;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => cmd.action()}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-theme-accent text-theme-accent-text'
                          : 'text-theme-text hover:bg-theme-input-bg'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-theme-accent-hover text-theme-accent-text' : 'bg-theme-input-bg text-theme-text-muted'
                        }`}>
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <span className={`block text-xs font-semibold ${isSelected ? 'text-theme-accent-text' : 'text-theme-text'}`}>{cmd.title}</span>
                          <span className={`block text-[10px] font-mono truncate mt-0.5 ${isSelected ? 'text-theme-accent-text opacity-85' : 'text-theme-text-muted'}`}>{cmd.subtitle}</span>
                        </div>
                      </div>

                      {cmd.shortcut && (
                        <kbd className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-theme-border/20 ${
                          isSelected ? 'bg-theme-accent-hover/40 text-theme-accent-text' : 'bg-theme-input-bg text-theme-text-muted'
                        }`}>
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2 bg-theme-input-bg border-t border-theme-border flex items-center justify-between text-[10px] font-mono text-theme-text-muted select-none">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Esc to close</span>
            </div>
          </>
        ) : (
          /* Interactive forms inside command palette */
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-2">
              <span className="text-xs font-semibold text-theme-text uppercase font-mono flex items-center gap-1.5">
                <Sparkles size={13} className="text-theme-accent animate-pulse" />
                {actionStep === 'add-todo' && 'Add Todo via Command Bar'}
                {actionStep === 'add-note' && 'Write Notepad Note via Command Bar'}
                {actionStep === 'add-event' && 'Schedule Event via Command Bar'}
              </span>
              <button
                onClick={() => setActionStep('list')}
                className="text-[10px] font-mono font-bold text-theme-text-muted hover:text-theme-accent cursor-pointer"
              >
                ← Back
              </button>
            </div>

            {actionStep === 'add-todo' && (
              <form onSubmit={handleTodoSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-theme-input-bg border border-theme-border focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 text-theme-text"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-theme-accent text-theme-accent-text rounded-lg text-xs font-semibold hover:bg-theme-accent-hover cursor-pointer text-center"
                >
                  Create Task
                </button>
              </form>
            )}

            {actionStep === 'add-note' && (
              <form onSubmit={handleNoteSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-theme-input-bg border border-theme-border focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 text-theme-text"
                  autoFocus
                  required
                />
                <textarea
                  placeholder="Write note contents..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-theme-input-bg border border-theme-border focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 text-theme-text resize-none h-24"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-theme-accent text-theme-accent-text rounded-lg text-xs font-semibold hover:bg-theme-accent-hover cursor-pointer text-center"
                >
                  Create Note
                </button>
              </form>
            )}

            {actionStep === 'add-event' && (
              <form onSubmit={handleEventSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Briefing name / Event Title..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-theme-input-bg border border-theme-border focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 text-theme-text"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-theme-accent text-theme-accent-text rounded-lg text-xs font-semibold hover:bg-theme-accent-hover cursor-pointer text-center"
                >
                  Schedule Event
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
