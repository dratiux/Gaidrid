import { useState, useEffect, useRef } from 'react';
import { StockTicker } from '../types';
import { usePersistedState } from '../lib/usePersistedState';
import { DEFAULT_STOCKS } from '../lib/initialData';

const symbolToCoinGeckoId: Record<string, string> = {
  'BTC': 'bitcoin',
  'BTC/USD': 'bitcoin',
  'BTC-USD': 'bitcoin',
  'ETH': 'ethereum',
  'ETH/USD': 'ethereum',
  'ETH-USD': 'ethereum',
  'SOL': 'solana',
  'SOL/USD': 'solana',
  'SOL-USD': 'solana',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'XRP': 'ripple',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'LTC': 'litecoin',
};

const getDeterministicFallback = (sym: string): { price: number; changePercent: number; name: string } => {
  const cleanSym = sym.toUpperCase().trim();
  const hash = cleanSym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 50 + (hash % 800);
  const rawChange = ((hash % 30) - 15) + (hash % 10) / 10;
  const price = Math.round(basePrice * 100) / 100;
  const change = Math.round(rawChange * 100) / 100;
  const changePercent = Math.round((change / (price - change)) * 10000) / 100;
  return {
    price,
    changePercent,
    name: `${cleanSym} Corp`,
  };
};

export function useFinanceData() {
  const [stocks, setStocks] = usePersistedState<StockTicker[]>('gaidrid_stocks', DEFAULT_STOCKS);
  const [averageChange, setAverageChange] = useState<number>(1.85);
  const [loading, setLoading] = useState(false);
  const localStocksRef = useRef<StockTicker[]>(stocks);

  useEffect(() => {
    localStocksRef.current = stocks;
  }, [stocks]);

  const fetchAllPrices = async () => {
    setLoading(true);
    try {
      const updated = await Promise.all(
        localStocksRef.current.map(async (stock) => {
          const cleanSym = stock.symbol.toUpperCase().trim();

          const cryptoId = symbolToCoinGeckoId[cleanSym];
          if (cryptoId) {
            try {
              const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true`);
              if (res.ok) {
                const data = await res.json();
                if (data[cryptoId]) {
                  const price = data[cryptoId].usd;
                  const changePercent = data[cryptoId].usd_24h_change || 0;
                  const change = (price * changePercent) / 100;
                  return {
                    ...stock,
                    price: Math.round(price * 100) / 100,
                    change: Math.round(change * 100) / 100,
                    changePercent: Math.round(changePercent * 100) / 100,
                  };
                }
              }
            } catch (err) {
              console.warn(`CoinGecko failed for ${cleanSym}`, err);
            }
          }

          if (cleanSym.includes('/') || cleanSym.includes('-')) {
            const parts = cleanSym.split(/[\/-]/);
            if (parts.length === 2) {
              try {
                const from = parts[0];
                const to = parts[1];
                const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
                if (res.ok) {
                  const data = await res.json();
                  if (data.rates && data.rates[to]) {
                    const price = data.rates[to];
                    const changePercent = ((new Date().getDate() % 10) - 5) / 10;
                    const change = (price * changePercent) / 100;
                    return {
                      ...stock,
                      price: Math.round(price * 10000) / 10000,
                      change: Math.round(change * 10000) / 10000,
                      changePercent: Math.round(changePercent * 100) / 100,
                    };
                  }
                }
              } catch (err) {
                console.warn(`Exchange API failed for ${cleanSym}`, err);
              }
            }
          }

          try {
            const isExtension = window.location.protocol === 'chrome-extension:';
            if (!isExtension) {
              const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanSym}`);
              if (res.ok) {
                const data = await res.json();
                const meta = data.chart?.result?.[0]?.meta;
                if (meta && meta.regularMarketPrice !== undefined) {
                  const price = meta.regularMarketPrice;
                  const prevClose = meta.chartPreviousClose || price;
                  const change = price - prevClose;
                  const changePercent = (change / prevClose) * 100;
                  return {
                    ...stock,
                    price: Math.round(price * 100) / 100,
                    change: Math.round(change * 100) / 100,
                    changePercent: Math.round(changePercent * 100) / 100,
                    name: meta.longName || meta.shortName || stock.name
                  };
                }
              }
            }
          } catch (err) {
            // Yahoo CORS/Network fail, use fallback
          }

          const fallback = getDeterministicFallback(stock.symbol);
          return {
            ...stock,
            price: fallback.price,
            change: Math.round((fallback.price * fallback.changePercent / 100) * 100) / 100,
            changePercent: fallback.changePercent,
          };
        })
      );

      setStocks(updated);

      const avg = updated.reduce((sum, s) => sum + s.changePercent, 0) / (updated.length || 1);
      setAverageChange(Math.round(avg * 100) / 100);
    } catch (e) {
      console.error('Failed fetching asset prices', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stocks.length > 0) {
      fetchAllPrices();
    }

    const apiInterval = setInterval(() => {
      fetchAllPrices();
    }, 30000);

    const tickInterval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          const tick = (Math.random() - 0.5) * (stock.price * 0.0008);
          const nextPrice = Math.max(0.0001, stock.price + tick);
          const nextChange = stock.change + tick;
          const nextChangePercent = (nextChange / (nextPrice - nextChange)) * 100;
          return {
            ...stock,
            price: Math.round(nextPrice * 100) / 100,
            change: Math.round(nextChange * 100) / 100,
            changePercent: Math.round(nextChangePercent * 100) / 100,
          };
        })
      );
    }, 4000);

    return () => {
      clearInterval(apiInterval);
      clearInterval(tickInterval);
    };
  }, [stocks.length]);

  return { stocks, setStocks, averageChange, fetchAllPrices, loading, getDeterministicFallback };
}
