import React from 'react';
import { X, History, BarChart2, Users, Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { ScoreboardEvent, getStats, getLineups, getH2H, getTimelinePreview } from '../../data/sportsMockData';

interface MatchDetailModalProps {
  event: ScoreboardEvent;
  leagueSport: string;
  activeDetailTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview', icon: History },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
  { id: 'lineups', label: 'Lineups', icon: Users },
  { id: 'h2h', label: 'H2H', icon: Swords },
] as const;

export default function MatchDetailModal({
  event,
  leagueSport,
  activeDetailTab,
  onTabChange,
  onClose,
}: MatchDetailModalProps) {
  const competition = event.competitions[0];
  const awayCompetitor = competition?.competitors.find(c => c.homeAway === 'away');
  const homeCompetitor = competition?.competitors.find(c => c.homeAway === 'home');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[250] p-4 select-none"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-theme-card border border-theme-border rounded-3xl p-6 space-y-4 h-[560px] flex flex-col justify-between select-none shadow-2xl relative"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-theme-border/30 pb-3 shrink-0">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
            Match Details
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border transition-all cursor-pointer flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2 scrollbar-thin">
          {/* Scoreboard block */}
          <div className="bg-theme-input-bg/35 border border-theme-border/20 rounded-2xl p-4 flex items-center justify-between shrink-0">
            {/* Away team */}
            <div className="flex flex-col items-center gap-1.5 w-24">
              {awayCompetitor?.team.logo ? (
                <img
                  src={awayCompetitor.team.logo}
                  alt="away-logo"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-theme-accent/15 text-theme-accent font-black flex items-center justify-center text-sm font-mono">
                  {awayCompetitor?.team.abbreviation}
                </div>
              )}
              <span className="text-[11px] font-black text-theme-text truncate text-center w-full">
                {awayCompetitor?.team.displayName}
              </span>
            </div>

            {/* SCORE & CLOCK */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black font-mono text-theme-text">
                  {event.status.type.state === 'pre' ? '—' : awayCompetitor?.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted font-mono">
                  VS
                </span>
                <span className="text-2xl font-black font-mono text-theme-text">
                  {event.status.type.state === 'pre' ? '—' : homeCompetitor?.score}
                </span>
              </div>
              <span className="text-[8.5px] font-mono uppercase bg-theme-accent/10 px-2 py-0.5 rounded-full text-theme-accent font-bold tracking-wider mt-1.5">
                {event.status.type.detail}
              </span>
            </div>

            {/* Home team */}
            <div className="flex flex-col items-center gap-1.5 w-24">
              {homeCompetitor?.team.logo ? (
                <img
                  src={homeCompetitor.team.logo}
                  alt="home-logo"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-theme-accent/15 text-theme-accent font-black flex items-center justify-center text-sm font-mono">
                  {homeCompetitor?.team.abbreviation}
                </div>
              )}
              <span className="text-[11px] font-black text-theme-text truncate text-center w-full">
                {homeCompetitor?.team.displayName}
              </span>
            </div>
          </div>

          {/* TAB CONTROLS */}
          <div className="flex border-b border-theme-border/20 shrink-0">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 py-2 text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === tab.id
                    ? 'border-theme-accent text-theme-accent font-black'
                    : 'border-transparent text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <tab.icon size={10} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB VIEWS */}
          <div className="space-y-3 shrink-0">
            {activeDetailTab === 'overview' && <OverviewTab event={event} sport={leagueSport} />}
            {activeDetailTab === 'stats' && <StatsTab event={event} sport={leagueSport} />}
            {activeDetailTab === 'lineups' && <LineupsTab event={event} sport={leagueSport} />}
            {activeDetailTab === 'h2h' && <H2HTab event={event} />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OverviewTab({ event, sport }: { event: ScoreboardEvent; sport: string }) {
  const timelineData = getTimelinePreview(event, sport);
  if (timelineData.isPre) {
    return (
      <div className="space-y-3 bg-theme-input-bg/25 border border-theme-border/20 rounded-xl p-3.5">
        <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
          Timeline
        </span>
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="font-semibold text-theme-text">Odds</span>
          <span className="font-bold text-theme-accent bg-theme-accent/5 px-2 py-0.5 rounded-md">{timelineData.odds}</span>
        </div>
        <div className="space-y-1.5 pt-1">
          <span className="text-[8px] font-black uppercase font-mono text-theme-text-muted block">
            Win Probability
          </span>
          <div className="h-2 rounded-full bg-theme-border/20 overflow-hidden flex">
            <div className="h-full bg-theme-accent" style={{ width: `${timelineData.homeWinProb}%` }} />
            <div className="h-full bg-theme-border" style={{ width: `${timelineData.awayWinProb}%` }} />
          </div>
          <div className="flex items-center justify-between text-[9px] text-theme-text-muted font-bold font-mono">
            <span>Home {timelineData.homeWinProb}%</span>
            <span>Away {timelineData.awayWinProb}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 bg-theme-input-bg/25 border border-theme-border/20 rounded-xl p-3">
      <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
        Timeline
      </span>
      <div className="space-y-2">
        {timelineData.timeline?.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-2 bg-theme-card/50 rounded-lg border border-theme-border/10 text-[10px]">
            <span className="font-mono font-black text-theme-accent bg-theme-accent/10 px-1.5 py-0.5 rounded text-[8px] uppercase shrink-0">
              {item.minute}
            </span>
            <p className="text-theme-text leading-snug font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ event, sport }: { event: ScoreboardEvent; sport: string }) {
  const stats = getStats(event, sport);
  return (
    <div className="space-y-2.5 bg-theme-input-bg/25 border border-theme-border/20 rounded-xl p-3">
      <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
        Match Statistics
      </span>
      <div className="space-y-3 pt-1">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-theme-text-muted font-mono">{stat.home}</span>
              <span className="text-theme-text text-[9px] uppercase tracking-wider">{stat.label}</span>
              <span className="text-theme-text-muted font-mono">{stat.away}</span>
            </div>
            <div className="h-1.5 rounded-full bg-theme-border/25 overflow-hidden flex">
              <div className="h-full bg-theme-accent" style={{ width: `${stat.homePct}%` }} />
              <div className="h-full bg-theme-border" style={{ width: `${stat.awayPct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineupsTab({ event, sport }: { event: ScoreboardEvent; sport: string }) {
  const { homeLineup, awayLineup } = getLineups(event, sport);
  const homeTeamName = event.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || 'Home';
  const awayTeamName = event.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || 'Away';

  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div className="bg-theme-input-bg/20 border border-theme-border/25 rounded-xl p-2.5 space-y-2">
        <span className="text-[8px] font-black uppercase font-mono text-theme-text-muted block truncate">
          {awayTeamName} Starters
        </span>
        <div className="space-y-1.5">
          {awayLineup.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-theme-border/10 pb-1 text-[9px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-[8px] text-theme-accent font-bold">#{p.number}</span>
                <span className="font-semibold text-theme-text truncate">{p.name}</span>
              </div>
              <span className="text-[7.5px] font-mono bg-theme-input-bg px-1 rounded text-theme-text-muted uppercase scale-90">{p.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-theme-input-bg/20 border border-theme-border/25 rounded-xl p-2.5 space-y-2">
        <span className="text-[8px] font-black uppercase font-mono text-theme-text-muted block truncate">
          {homeTeamName} Starters
        </span>
        <div className="space-y-1.5">
          {homeLineup.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-theme-border/10 pb-1 text-[9px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-[8px] text-theme-accent font-bold">#{p.number}</span>
                <span className="font-semibold text-theme-text truncate">{p.name}</span>
              </div>
              <span className="text-[7.5px] font-mono bg-theme-input-bg px-1 rounded text-theme-text-muted uppercase scale-90">{p.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function H2HTab({ event }: { event: ScoreboardEvent }) {
  const h2h = getH2H(event);
  return (
    <div className="space-y-2.5 bg-theme-input-bg/25 border border-theme-border/20 rounded-xl p-3">
      <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
        Head to Head History
      </span>
      <div className="space-y-2">
        {h2h.map((match, idx) => (
          <div key={idx} className="p-2 bg-theme-card/50 rounded-lg border border-theme-border/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-theme-text-muted">{match.date}</span>
              <span className="font-bold text-theme-text truncate text-[9px] max-w-[130px]">
                {match.home} vs {match.away}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono font-black text-theme-accent text-[10px]">{match.score}</span>
              <span className="text-[7px] text-theme-text-muted font-semibold truncate max-w-[80px]">
                Winner: {match.winner}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
