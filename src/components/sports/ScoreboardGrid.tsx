import React, { useState, useEffect } from 'react';
import { Trophy, Star, Clock, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { ScoreboardEvent } from '../../data/sportsMockData';

interface ScoreboardGridProps {
  sortedEvents: ScoreboardEvent[];
  leagueName: string;
  pinnedTeams: string[];
  onTogglePin: (teamName: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: ScoreboardEvent) => void;
}

export default function ScoreboardGrid({
  sortedEvents,
  leagueName,
  pinnedTeams,
  onTogglePin,
  onSelectEvent,
}: ScoreboardGridProps) {
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [sortedEvents]);

  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="flex items-center justify-between border-b border-theme-border/10 pb-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted font-mono">
          Live scoreboards: {leagueName} ({sortedEvents.length})
        </span>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="p-12 text-center bg-theme-input-bg/20 border border-dashed border-theme-border/30 rounded-3xl">
          <Trophy className="mx-auto text-theme-text-muted/30 mb-3" size={32} />
          <p className="text-sm font-semibold text-theme-text">No matches match your filters</p>
          <p className="text-xs text-theme-text-muted mt-1">Try changing the arena, status filter, or clearing search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEvents.slice(0, visibleCount).map((event) => {
            const competition = event.competitions[0];
            const homeCompetitor = competition?.competitors.find(c => c.homeAway === 'home');
            const awayCompetitor = competition?.competitors.find(c => c.homeAway === 'away');
            const isLive = event.status.type.state === 'in';
            const isPre = event.status.type.state === 'pre';
            const isPost = event.status.type.state === 'post';

            const homeTeamName = homeCompetitor?.team.displayName || 'Home Team';
            const awayTeamName = awayCompetitor?.team.displayName || 'Away Team';

            const hasPinned = pinnedTeams.includes(homeTeamName) || pinnedTeams.includes(awayTeamName);

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-theme-card hover:bg-theme-input-bg/30 border border-theme-border/45 hover:border-theme-accent/50 cursor-pointer transition-all duration-200 shadow-none hover:shadow-lg hover:shadow-theme-accent/5 relative"
              >
                {/* Header: Status / Clock & Pin icon */}
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[9px] font-bold font-mono uppercase tracking-wider animate-pulse border border-red-500/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Live {event.status.displayClock}
                      </span>
                    ) : isPost ? (
                      <span className="px-2 py-0.5 rounded-full bg-theme-input-bg text-theme-text-muted text-[9px] font-bold uppercase tracking-wider font-mono">
                        Final
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-theme-accent/10 text-theme-accent text-[9px] font-bold uppercase tracking-wider font-mono">
                        <Clock size={8} />
                        {event.status.type.detail}
                      </span>
                    )}
                    {competition?.venue && (
                      <span className="text-[9px] text-theme-text-muted truncate max-w-[140px] font-semibold flex items-center gap-0.5 font-mono">
                        <MapPin size={9} /> {competition.venue.fullName}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => onTogglePin(homeTeamName, e)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      hasPinned
                        ? 'bg-theme-accent/20 border-theme-accent text-theme-accent'
                        : 'border-theme-border/40 text-theme-text-muted hover:text-theme-text hover:border-theme-border/80 bg-theme-input-bg/30'
                    }`}
                    title="Pin this Matchup"
                  >
                    <Star size={11} className={hasPinned ? 'fill-theme-accent' : ''} />
                  </button>
                </div>

                {/* Competitors scoreboard row */}
                <div className="space-y-3.5">
                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {awayCompetitor?.team.logo ? (
                        <img
                          src={awayCompetitor.team.logo}
                          alt={awayTeamName}
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-lg bg-theme-input-bg/5 p-0.5 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-theme-accent/10 text-theme-accent font-black flex items-center justify-center text-xs shrink-0 font-mono">
                          {awayCompetitor?.team.abbreviation || 'A'}
                        </div>
                      )}
                      <span className={`text-xs font-bold truncate transition-all ${awayCompetitor?.winner ? 'text-theme-text font-black scale-[1.02]' : 'text-theme-text/80'}`}>
                        {awayTeamName}
                      </span>
                    </div>
                    <span className={`text-base font-black font-mono transition-all ${isPre ? 'text-theme-text-muted/30' : awayCompetitor?.winner ? 'text-theme-accent' : 'text-theme-text'}`}>
                      {isPre ? '—' : awayCompetitor?.score}
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {homeCompetitor?.team.logo ? (
                        <img
                          src={homeCompetitor.team.logo}
                          alt={homeTeamName}
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-lg bg-theme-input-bg/5 p-0.5 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-theme-accent/10 text-theme-accent font-black flex items-center justify-center text-xs shrink-0 font-mono">
                          {homeCompetitor?.team.abbreviation || 'H'}
                        </div>
                      )}
                      <span className={`text-xs font-bold truncate transition-all ${homeCompetitor?.winner ? 'text-theme-text font-black scale-[1.02]' : 'text-theme-text/80'}`}>
                        {homeTeamName}
                      </span>
                    </div>
                    <span className={`text-base font-black font-mono transition-all ${isPre ? 'text-theme-text-muted/30' : homeCompetitor?.winner ? 'text-theme-accent' : 'text-theme-text'}`}>
                      {isPre ? '—' : homeCompetitor?.score}
                    </span>
                  </div>
                </div>

                {/* Bottom detail action block */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-theme-border/15">
                  <span className="text-[9px] font-black uppercase font-mono text-theme-text-muted tracking-widest group-hover:text-theme-accent transition-colors">
                    Match Analytics
                  </span>
                  <ChevronRight size={14} className="text-theme-text-muted group-hover:text-theme-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {visibleCount < sortedEvents.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all"
          >
            Load More
            <span className="text-[10px] text-theme-text-muted font-mono">
              ({sortedEvents.length - visibleCount} left)
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
