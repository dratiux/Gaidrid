import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, Search, X } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { useFinanceData } from '../hooks/useFinanceData';
import { WidgetHeader } from './ui/WidgetHeader';
import { WidgetSearchBar } from './ui/WidgetSearchBar';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

interface FinanceWidgetProps {
  onRemove?: () => void;
}

export default function FinanceWidget({ onRemove }: FinanceWidgetProps) {
  const { stocks, setStocks, averageChange, fetchAllPrices, loading, getDeterministicFallback } = useFinanceData();
  const [showAdd, setShowAdd] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    const sym = symbol.toUpperCase().trim();
    if (stocks.some((s) => s.symbol === sym)) {
      setSymbol('');
      setName('');
      setShowAdd(false);
      return;
    }

    const fallback = getDeterministicFallback(sym);
    const finalName = name.trim() || fallback.name;

    setStocks([...stocks, { symbol: sym, name: finalName, price: fallback.price, change: fallback.price * fallback.changePercent / 100, changePercent: fallback.changePercent }]);
    setSymbol('');
    setName('');
    setShowAdd(false);
  };

  const filteredStocks = stocks.filter(s => !searchQuery || s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="widget-finance" className="flex flex-col h-full justify-between p-5 select-none">
      <WidgetHeader
        title="Finance"
        leading={
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase tracking-widest shrink-0 ${
            averageChange >= 0
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
          </span>
        }
        actions={
          <>
            <IconButton
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery('');
              }}
              variant={showSearch ? 'active' : 'default'}
              icon={<Search size={12} />}
              label={showSearch ? 'Close search' : 'Search assets'}
              title="Search assets"
            />
            <IconButton
              onClick={() => setShowAdd(!showAdd)}
              variant="accent"
              icon={<Plus size={12} />}
              label="Add Asset to Track"
              title="Add Asset to Track"
            />
            {onRemove && (
              <IconButton
                onClick={onRemove}
                variant="danger"
                icon={<X size={12} />}
                label="Remove Widget"
                title="Remove Widget"
              />
            )}
          </>
        }
      />

      {showSearch && (
        <WidgetSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholder="Search stocks or crypto..."
          className="mb-3 shrink-0"
        />
      )}

      <div className="flex-1 overflow-y-auto max-h-[220px] pr-0.5 space-y-2 scrollbar-none">
        {filteredStocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-theme-text-muted py-10">
            <span>{searchQuery ? 'No matching assets.' : 'No tracked assets.'}</span>
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isUp = stock.changePercent >= 0;
            return (
              <div
                key={stock.symbol}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/20 transition-all duration-300"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-theme-text font-mono">
                      {stock.symbol}
                    </span>
                    <span className="text-[9px] text-theme-text-muted font-bold truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs font-semibold text-theme-text font-mono">
                    <span>${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-black flex items-center gap-0.5 shrink-0 ${
                      isUp
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}
                  >
                    {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>

                  <button
                    onClick={() => setStocks(stocks.filter((s) => s.symbol !== stock.symbol))}
                    className="p-1 text-theme-text-muted hover:text-red-500 rounded-md hover:bg-theme-input-bg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Remove asset"
                    aria-label={`Remove ${stock.symbol} from tracking`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <ModalOverlay onClose={() => setShowAdd(false)} label="Add Asset To Track">
            <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
                Add Asset To Track
              </h3>
              <ModalCloseButton onClick={() => setShowAdd(false)} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <div className="space-y-3.5">
                <TextInput
                  label="Asset Symbol"
                  placeholder="e.g. MSFT, ETH, AAPL"
                  value={symbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.target.value)}
                  className="uppercase font-mono"
                  required
                  autoFocus
                  aria-label="Asset symbol"
                />
                <TextInput
                  label="Asset Name (Optional)"
                  placeholder="e.g. Microsoft Corporation"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  aria-label="Asset name (optional)"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <PrimaryButton>Track Asset</PrimaryButton>
              </div>
            </form>
        </ModalOverlay>
      )}
    </div>
  );
}
