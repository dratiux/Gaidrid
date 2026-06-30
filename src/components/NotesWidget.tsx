import React, { useState } from 'react';
import { NoteItem } from '../types';
import { Plus, Trash2, Edit, FileText, Search, ArrowLeft, Calendar, X } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { WidgetHeader } from './ui/WidgetHeader';
import { WidgetSearchBar } from './ui/WidgetSearchBar';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

interface NotesWidgetProps {
  notes: NoteItem[];
  onAddNote: (title: string, content: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onRemove?: () => void;
}

export default function NotesWidget({ notes, onAddNote, onUpdateNote, onDeleteNote, onRemove }: NotesWidgetProps) {
  // Navigation states: 'list' | 'detail' | 'add' | 'edit'
  const [view, setView] = useState<'list' | 'detail' | 'add' | 'edit'>('list');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Form values
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  const activeNote = notes.find((n) => n.id === selectedNoteId);

  React.useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      if (action === 'create') {
        setTitleInput('');
        setContentInput('');
        setView('add');
      } else if (action === 'view-list') {
        setView('list');
      }
    };
    window.addEventListener('gaidrid-notes-action', handleAction);
    return () => {
      window.removeEventListener('gaidrid-notes-action', handleAction);
    };
  }, [notes]);

  const handleStartAdd = () => {
    setTitleInput('');
    setContentInput('');
    setView('add');
  };

  const handleStartEdit = () => {
    if (!activeNote) return;
    setTitleInput(activeNote.title);
    setContentInput(activeNote.content);
    setView('edit');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !contentInput.trim()) return;
    onAddNote(titleInput.trim(), contentInput.trim());
    setView('list');
    
    // Auto-select the newly added note
    setTimeout(() => {
      if (notes.length > 0) {
        setSelectedNoteId(notes[notes.length - 1].id);
      }
    }, 80);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoteId || !titleInput.trim() || !contentInput.trim()) return;
    onUpdateNote(selectedNoteId, titleInput.trim(), contentInput.trim());
    setView('detail');
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDeleteNote(id);
    
    const remaining = notes.filter((n) => n.id !== id);
    if (remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
      setView('list');
    } else {
      setSelectedNoteId(null);
      setView('list');
    }
  };

  // Filter notes by search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  // Helper to format date
  const formatNoteDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return '';
    }
  };

  return (
    <div id="widget-notes" className="flex flex-col h-full justify-between p-5 select-none animate-fade-in">
      <WidgetHeader
        title={view === 'detail' || view === 'edit' ? 'Note Details' : 'Notes'}
        leading={(view === 'detail' || view === 'edit') ? (
          <button onClick={() => setView('list')} aria-label="Back to notes list" className="p-1 rounded-md text-theme-text-muted hover:text-theme-text hover:bg-theme-input-bg transition-colors cursor-pointer" title="Back">
            <ArrowLeft size={12} className="stroke-[2.5]" />
          </button>
        ) : undefined}
        actions={<>
          {(view === 'list' || view === 'add') && (
            <>
              <IconButton onClick={() => setShowSearch(s => !s)} variant={showSearch ? 'active' : 'default'} icon={<Search size={12} />} label="Search notes" title="Search" />
              <IconButton onClick={handleStartAdd} icon={<Plus size={12} />} label="Compose new note" title="Compose New Note" />
            </>
          )}
          {onRemove && <IconButton onClick={onRemove} variant="danger" icon={<X size={12} />} label="Remove Notes widget" title="Remove Widget" />}
        </>}
      />

      {/* View router blocks */}
      {(view === 'list' || view === 'add') ? (
        <div className="flex-1 flex flex-col justify-start min-h-0 space-y-3">
          {/* Notes Search bar - toggleable */}
          {showSearch && (
            <WidgetSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholder="Search note titles or content..." />
          )}

          {/* List Area */}
          <div className="flex-1 overflow-y-auto max-h-[190px] pr-0.5 space-y-2 scrollbar-none">
            {filteredNotes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
                <FileText size={20} className="text-theme-text-muted/50 mb-1.5" />
                <span className="text-[9px] font-bold text-theme-text-muted font-mono tracking-wider uppercase">
                  No Notes Found
                </span>
                <span className="text-[8px] text-theme-text-muted/65 block mt-0.5">
                  {searchQuery ? 'Try a different keyword' : 'Create notes to get started'}
                </span>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = selectedNoteId === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setView('detail');
                    }}
                    className={`group/item p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'bg-theme-accent/5 border-theme-accent/30'
                        : 'bg-theme-input-bg/15 border-theme-border/20 hover:border-theme-accent/20 hover:bg-theme-input-bg/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-theme-text line-clamp-1 group-hover/item:text-theme-accent transition-colors leading-normal tracking-tight">
                        {note.title}
                      </span>
                      <span className="text-[7.5px] font-mono text-theme-text-muted/60 shrink-0 mt-0.5">
                        {formatNoteDate(note.updatedAt).split(',')[0]}
                      </span>
                    </div>

                    <p className="text-[9px] text-theme-text-muted/80 line-clamp-2 mt-1 leading-relaxed font-sans font-light">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-theme-border/5">
                      <span className="text-[7.5px] text-theme-text-muted/50 font-mono flex items-center gap-1">
                        <Calendar size={8} />
                        {formatNoteDate(note.updatedAt)}
                      </span>
                    </div>

                    {/* Absolute Bottom Right Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(note.id, e)}
                      aria-label={`Delete note "${note.title}"`}
                      className="absolute bottom-2 right-2 text-theme-text-muted/65 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-theme-input-bg/60 cursor-pointer z-10"
                      title="Delete note"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (view === 'detail' || view === 'edit') && activeNote ? (
        /* Reading and Reading Details Panel */
        <div className="flex-1 flex flex-col justify-between min-h-0">
          <div className="flex-1 flex flex-col min-h-0 justify-start">
            {/* Toolbar row */}
            <div className="flex items-center justify-between border-b border-theme-border/15 pb-1.5 mb-2 shrink-0">
              <span className="text-[8px] text-theme-text-muted font-mono uppercase tracking-wider flex items-center gap-1">
                <Calendar size={8} /> Updated {formatNoteDate(activeNote.updatedAt)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartEdit}
                  aria-label="Edit note"
                  className="p-1 rounded-md text-theme-text-muted hover:text-theme-accent hover:bg-theme-input-bg cursor-pointer transition-colors"
                  title="Modify Note"
                >
                  <Edit size={11} className="stroke-[2]" />
                </button>
                <button
                  onClick={() => handleDelete(activeNote.id)}
                  aria-label="Delete note"
                  className="p-1 rounded-md text-theme-text-muted hover:text-red-500 hover:bg-theme-input-bg cursor-pointer transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {/* Note text view area */}
            <div className="flex-1 overflow-y-auto max-h-[170px] pr-0.5 space-y-1 scrollbar-none">
              <h4 className="text-xs font-black text-theme-text tracking-tight font-sans block leading-snug">
                {activeNote.title}
              </h4>
              <p className="text-[11px] text-theme-text-muted/95 whitespace-pre-wrap leading-relaxed font-sans font-light bg-theme-input-bg/20 p-3 rounded-2xl border border-theme-border/20 mt-1.5">
                {activeNote.content}
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('list')}
            aria-label="Back to notes list"
            className="w-full mt-2.5 text-[9px] font-black uppercase py-1.5 rounded-lg border border-theme-border/70 hover:border-theme-accent/40 text-theme-text-muted hover:text-theme-text transition-all cursor-pointer text-center font-mono tracking-wider"
          >
            ← Back to Notes
          </button>
        </div>
      ) : null}

      {/* Modal overlay for compose & edit forms */}
      {(view === 'add' || view === 'edit') && (
        <ModalOverlay onClose={() => setView(view === 'edit' ? 'detail' : 'list')} label={view === 'add' ? 'Compose New Note' : 'Edit Note'}>
          <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
              {view === 'add' ? 'Compose New Note' : 'Edit Note'}
            </h3>
            <ModalCloseButton onClick={() => setView(view === 'edit' ? 'detail' : 'list')} />
          </div>
          
          <form onSubmit={view === 'add' ? handleSaveAdd : handleSaveEdit} className="space-y-4 flex flex-col">
            <div className="space-y-3 flex-1 flex flex-col">
              <TextInput label="Note Title" placeholder="Enter title..." value={titleInput} onChange={(e) => setTitleInput(e.target.value)} aria-label="Note title" required autoFocus />
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                  Content
                </label>
                <textarea
                  placeholder="Write your note content here..."
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  aria-label="Note content"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 resize-none min-h-[140px] max-h-[220px] transition-all font-light leading-relaxed"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <PrimaryButton>Save Note</PrimaryButton>
            </div>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
}
