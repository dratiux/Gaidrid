import React, { useState } from 'react';
import { TodoItem } from '../types';
import { Check, Plus, Trash2, Calendar, X, Search } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import CustomSelect from './CustomSelect';
import { WidgetHeader } from './ui/WidgetHeader';
import { WidgetSearchBar } from './ui/WidgetSearchBar';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

interface TodoWidgetProps {
  todos: TodoItem[];
  onAddTodo: (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string, category?: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onRemove?: () => void;
}

export default function TodoWidget({ todos, onAddTodo, onToggleTodo, onDeleteTodo, onRemove }: TodoWidgetProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newText, setNewText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Productivity');
  const [dueDate, setDueDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      if (action === 'show-add') {
        setShowAddForm(true);
      } else if (action === 'clear-completed') {
        const completed = todos.filter(t => t.completed);
        completed.forEach(todo => onDeleteTodo(todo.id));
      } else if (action === 'filter-all') {
        setFilter('all');
      } else if (action === 'filter-active') {
        setFilter('active');
      } else if (action === 'filter-completed') {
        setFilter('completed');
      }
    };
    window.addEventListener('gaidrid-todo-action', handleAction);
    return () => {
      window.removeEventListener('gaidrid-todo-action', handleAction);
    };
  }, [todos, onDeleteTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddTodo(newText.trim(), priority, dueDate || undefined, category.trim() || 'General');
    setNewText('');
    setDueDate('');
    setPriority('medium');
    setCategory('Productivity');
    setShowAddForm(false);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true;
    const matchesSearch = !searchQuery || todo.text.toLowerCase().includes(searchQuery.toLowerCase()) || (todo.category && todo.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'low':
      default:
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    }
  };

  return (
    <div id="widget-todo" className="flex flex-col h-full justify-between p-5">
      {/* Header */}
      <WidgetHeader
        title="Task Board"
        actions={
          <>
            <IconButton
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery('');
              }}
              variant={showSearch ? 'active' : 'default'}
              icon={<Search size={12} />}
              label={showSearch ? 'Close search' : 'Search tasks'}
              title="Search tasks"
            />
            <IconButton
              onClick={() => setShowAddForm(!showAddForm)}
              variant="default"
              icon={<Plus size={12} />}
              label={showAddForm ? 'Close add task form' : 'Add new task'}
              title="Add New Task"
            />
            {onRemove && (
              <IconButton
                onClick={onRemove}
                variant="danger"
                icon={<X size={12} />}
                label="Remove Task Board widget"
                title="Remove Widget"
              />
            )}
          </>
        }
      />

      {/* Search Input */}
      {showSearch && (
        <WidgetSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholder="Search tasks..."
          className="mb-3 shrink-0"
        />
      )}

      {/* List area always shown */}
      <div className="flex-1 overflow-y-auto max-h-[200px] pr-1 space-y-2 scrollbar-thin premium-scroll-mask" role="list" aria-label="Task list">
        {filteredTodos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-theme-text-muted py-10">
            <span className="font-medium tracking-wide">All completed or clear.</span>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              role="listitem"
              className={`group/item flex items-start justify-between p-2.5 rounded-xl transition-all duration-200 border relative ${
                todo.completed
                  ? 'bg-theme-input-bg/10 border-theme-border/20 opacity-55'
                  : 'bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/40 text-theme-text'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-6">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  aria-label={todo.completed ? `Mark "${todo.text}" as incomplete` : `Mark "${todo.text}" as complete`}
                  className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    todo.completed
                      ? 'bg-theme-accent border-theme-accent text-theme-accent-text'
                      : 'border-theme-border/80 hover:border-theme-accent/60'
                  }`}
                >
                  {todo.completed && <Check size={11} className="stroke-[3.5]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs block font-medium leading-normal break-words ${
                      todo.completed
                        ? 'line-through text-theme-text-muted'
                        : 'text-theme-text'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    {todo.category && (
                      <span className="text-[8px] font-mono bg-theme-input-bg text-theme-text-muted px-1.5 py-0.5 rounded-md border border-theme-border/20 uppercase tracking-wider">
                        {todo.category}
                      </span>
                    )}
                    {todo.dueDate && (
                      <span className="text-[8px] font-mono flex items-center gap-0.5 text-theme-text-muted bg-theme-input-bg/45 px-1.5 py-0.5 rounded-md border border-theme-border/10">
                        <Calendar size={8} />
                        {todo.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Absolute Bottom Right Delete Button */}
              <button
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                aria-label={`Delete task "${todo.text}"`}
                className="absolute bottom-2 right-2 text-theme-text-muted/65 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-theme-input-bg/60 cursor-pointer z-10"
                title="Delete task"
              >
                <Trash2 size={9} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom Filter Bar */}
      <div className="flex items-center justify-between border-t border-theme-border/30 pt-2.5 mt-2">
        <span className="text-[9px] text-theme-text-muted font-bold font-mono uppercase tracking-wider">
          {todos.filter((t) => !t.completed).length} items remaining
        </span>
        <div className="flex gap-1">
          {(['all', 'active', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              aria-label={`Show ${t} tasks`}
              aria-pressed={filter === t}
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md transition-all cursor-pointer font-mono tracking-wider flex items-center justify-center h-5 ${
                filter === t
                  ? 'bg-theme-accent text-theme-accent-text font-black scale-[1.02]'
                  : 'text-theme-text-muted hover:bg-theme-input-bg/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Modal dialog for adding tasks */}
      {showAddForm && (
        <ModalOverlay onClose={() => setShowAddForm(false)} label="Create new task">
            <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
                Create New Task
              </h3>
              <ModalCloseButton onClick={() => setShowAddForm(false)} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <div className="space-y-3 flex-1 flex flex-col">
                <TextInput
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                  autoFocus
                />

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                      Priority
                    </label>
                    <CustomSelect
                      value={priority}
                      onChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}
                      options={[
                        { value: "low", label: "Low Priority" },
                        { value: "medium", label: "Medium Priority" },
                        { value: "high", label: "High Priority" }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-medium h-[34px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Productivity, Personal, Dev, Design..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <PrimaryButton>Save Task</PrimaryButton>
              </div>
            </form>
        </ModalOverlay>
      )}
    </div>
  );
}
