import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Plus, Trash2, Clock, CalendarDays, MapPin, X, Search } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { WidgetHeader } from './ui/WidgetHeader';
import { WidgetSearchBar } from './ui/WidgetSearchBar';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onAddEvent: (title: string, date: string, startTime: string, endTime: string, description?: string) => void;
  onDeleteEvent: (id: string) => void;
  onRemove?: () => void;
}

export default function CalendarWidget({ events, onAddEvent, onDeleteEvent, onRemove }: CalendarWidgetProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      if (action === 'show-add') {
        setShowAddForm(true);
      } else if (action === 'view-list') {
        setShowAddForm(false);
      }
    };
    window.addEventListener('gaidrid-calendar-action', handleAction);
    return () => {
      window.removeEventListener('gaidrid-calendar-action', handleAction);
    };
  }, []);
  
  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !startTime || !endTime) return;
    onAddEvent(
      title.trim(),
      date,
      startTime,
      endTime,
      description.trim() || undefined
    );
    
    // Reset form
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const filteredEvents = sortedEvents.filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())));

  // Helper to format date into readable text, e.g. "Jun 24, 2026"
  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

        if (dateStr === todayStr) {
          return 'Today';
        }
        if (dateStr === tomorrowStr) {
          return 'Tomorrow';
        }
        
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const year = parts[0];

        return `${months[monthIndex]} ${day}, ${year}`;
      }
    } catch (e) {}
    return dateStr;
  };

  return (
    <div id="widget-calendar" className="flex flex-col h-full justify-between p-5 select-none animate-fade-in">
      {/* Header */}
      <WidgetHeader
        title="Calendar"
        actions={
          <>
            <IconButton
              onClick={() => {
                setShowSearch(s => !s);
                if (showSearch) setSearchQuery('');
              }}
              variant={showSearch ? 'active' : 'default'}
              icon={<Search size={12} />}
              label={showSearch ? 'Close search' : 'Search events'}
              title="Search events"
            />
            <IconButton
              onClick={() => setShowAddForm(true)}
              variant="default"
              icon={<Plus size={12} />}
              label="Add New Event"
              title="Add New Event"
            />
            {onRemove && (
              <IconButton
                onClick={onRemove}
                variant="danger"
                icon={<X size={12} />}
                label="Remove Calendar Widget"
                title="Remove Widget"
              />
            )}
          </>
        }
      />

        <div className="flex-1 flex flex-col justify-start min-h-0">
          {showSearch && (
            <WidgetSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholder="Search events..." />
          )}
          {/* Scrollable Timeline Area */}
          <div className="flex-1 overflow-y-auto max-h-[225px] pr-0.5 space-y-3.5 scrollbar-none">
            {filteredEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-70">
                <CalendarDays size={20} className="text-theme-text-muted/50 mb-1.5" />
                <span className="text-[9px] font-bold text-theme-text-muted font-mono tracking-wider uppercase">
                  {searchQuery ? 'No Matching Events' : 'No Scheduled Events'}
                </span>
                <span className="text-[8px] text-theme-text-muted/65 block mt-0.5">
                  {searchQuery ? 'Try a different search term' : "Click 'Add Event' to build your schedule"}
                </span>
              </div>
            ) : (
              filteredEvents.map((ev, index) => {
                // Show date divider if first item or if date changed from previous item
                const showDivider = index === 0 || filteredEvents[index - 1].date !== ev.date;
                
                return (
                  <div key={ev.id} className="space-y-1.5">
                    {showDivider && (
                      <div className="flex items-center gap-2 pt-1 pb-0.5">
                        <span className="text-[8.5px] font-mono font-black text-theme-accent uppercase tracking-wider">
                          {formatDateLabel(ev.date)}
                        </span>
                        <div className="flex-1 h-[1px] bg-theme-border/15" />
                      </div>
                    )}
                    
                    <div className="group/item relative flex gap-3 p-3 rounded-xl border border-theme-border/20 bg-theme-input-bg/15 hover:bg-theme-input-bg/30 hover:border-theme-accent/20 transition-all duration-200">
                      {/* Accent highlight strip */}
                      <div className="w-1 rounded-full bg-theme-accent shrink-0 opacity-80 group-hover/item:opacity-100" />
                      
                      {/* Event Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[11px] font-bold text-theme-text line-clamp-1 leading-tight tracking-tight">
                            {ev.title}
                          </span>
                        </div>

                        {ev.description && (
                          <div className="flex items-center gap-1 text-[8.5px] text-theme-text-muted/75 mt-0.5 font-light">
                            <MapPin size={8} className="text-theme-text-muted/40 shrink-0" />
                            <span className="truncate">{ev.description}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[8px] text-theme-text-muted/50 font-mono font-bold mt-1.5">
                          <Clock size={8} className="opacity-70 text-theme-accent" />
                          <span>{ev.startTime} - {ev.endTime}</span>
                        </div>
                      </div>

                      {/* Absolute Bottom Right Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteEvent(ev.id);
                        }}
                        className="absolute bottom-2 right-2 text-theme-text-muted/65 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-theme-input-bg/60 cursor-pointer z-10"
                        title="Delete event"
                        aria-label={`Delete event: ${ev.title}`}
                      >
                        <Trash2 size={9} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      {/* Centered Modal Overlay for Scheduled Event Form */}
      {showAddForm && (
        <ModalOverlay onClose={() => setShowAddForm(false)} label="Add Scheduled Event">
            <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
                Add Scheduled Event
              </h3>
              <ModalCloseButton onClick={() => setShowAddForm(false)} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <div className="space-y-3 flex-1 flex flex-col">
                <TextInput
                  label="Event Title"
                  placeholder="e.g. Design Sync, Lunch with Sarah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                  aria-label="Event Title"
                />

                <div className="grid grid-cols-2 gap-3.5">
                  <TextInput
                    label="Event Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    aria-label="Event Date"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      label="Start Time"
                      type="time"
                      placeholder="10:00"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      aria-label="Event Start Time"
                    />
                    <TextInput
                      label="End Time"
                      type="time"
                      placeholder="11:00"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      aria-label="Event End Time"
                    />
                  </div>
                </div>

                <TextInput
                  label="Location or Link"
                  placeholder="e.g. Meeting Room 4, Zoom link"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="Event Location or Link"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <PrimaryButton type="submit">
                  Add Event
                </PrimaryButton>
              </div>
            </form>
        </ModalOverlay>
      )}
    </div>
  );
}
