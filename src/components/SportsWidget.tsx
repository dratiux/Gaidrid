import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, Clock, MapPin, X, Activity, Calendar, BarChart2, Users, Swords } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { WidgetHeader } from './ui/WidgetHeader';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import {
  LEAGUES, MOCK_EVENTS, ScoreboardEvent,
  getEventStageAndDate, getDetailedStats, getLineups, getH2H, getTimeline
} from '../data/sportsMockData';

interface SportsWidgetProps {
  onRemove: () => void;
  onNavigate?: (page: string) => void;
}

export default function SportsWidget({ onRemove, onNavigate }: SportsWidgetProps) {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [events, setEvents] = useState<ScoreboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScoreboardEvent | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  
  // Track pinned/favorite teams to place them at the very top of lists
  const [pinnedTeams, setPinnedTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gaidrid_pinned_teams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentLeagueInfo = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    fetchScores(true); // show spinner on manual league switch
    
    // Auto-update scoreboard every 15 seconds silently
    const interval = setInterval(() => {
      fetchScores(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedEvent) {
      setActiveDetailTab('overview');
    }
  }, [selectedEvent]);

  const fetchScores = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(false);
    try {
      const activeLeague = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];
      const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${activeLeague.sport}/${activeLeague.id}/scoreboard`);
      if (!res.ok) throw new Error('API failure');
      const data = await res.json();
      
      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        // Fallback to high quality mock matches for that league if none currently scheduled on ESPN API
        setEvents(MOCK_EVENTS[selectedLeague] || []);
      }
    } catch (err) {
      console.warn('ESPN API fetch failed, falling back to local simulation data.', err);
      setEvents(MOCK_EVENTS[selectedLeague] || []);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const handleTogglePin = (teamName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (pinnedTeams.includes(teamName)) {
      updated = pinnedTeams.filter(t => t !== teamName);
    } else {
      updated = [...pinnedTeams, teamName];
    }
    setPinnedTeams(updated);
    localStorage.setItem('gaidrid_pinned_teams', JSON.stringify(updated));
  };

  const sortedEvents = [...events].sort((a, b) => {
    const aHome = a.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || '';
    const aAway = a.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || '';
    const bHome = b.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || '';
    const bAway = b.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || '';

    const aPinned = pinnedTeams.includes(aHome) || pinnedTeams.includes(aAway);
    const bPinned = pinnedTeams.includes(bHome) || pinnedTeams.includes(bAway);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    // Next prioritize LIVE matches over finished or pre-match
    const aLive = a.status.type.state === 'in';
    const bLive = b.status.type.state === 'in';
    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;

    return 0;
  });

  return (
    <div id="widget-sports" className="flex flex-col h-full justify-between p-5 select-none animate-fade-in relative">
      {/* HEADER CONTROLS */}
      <WidgetHeader
        title="Sports"
        leading={loading && <Activity size={10} className="text-theme-accent animate-pulse" />}
        actions={
          <IconButton
            onClick={onRemove}
            variant="danger"
            icon={<X size={12} />}
            label="Remove Sports widget"
            title="Remove Widget"
          />
        }
        className="shrink-0"
      />

      {/* MATCHES LIST & LEAGUE SWITCHER BOX */}
      <div className="flex-1 min-h-0 flex flex-col pt-3 gap-2">
        {/* League selector tabs */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 scrollbar-none">
          {LEAGUES.map((league) => {
            const isSel = league.id === selectedLeague;
            return (
              <button
                key={league.id}
                onClick={() => {
                  setSelectedLeague(league.id);
                  setSelectedEvent(null);
                }}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap font-mono ${
                  isSel
                    ? 'bg-theme-accent text-theme-accent-text font-black scale-95'
                    : 'bg-theme-input-bg/40 text-theme-text-muted border border-theme-border/30 hover:border-theme-border'
                }`}
                aria-label={`${league.name} league${isSel ? ' (selected)' : ''}`}
                aria-pressed={isSel}
              >
                {league.name}
              </button>
            );
          })}
        </div>

        {/* Scrollable scoreboard events */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin space-y-2" role="list" aria-label="List of matches">
          {loading && sortedEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <RefreshCw size={16} className="text-theme-accent animate-spin mb-2" />
              <span className="text-[10px] text-theme-text-muted font-bold tracking-wider font-mono uppercase">
                Syncing live matches...
              </span>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
              <span className="text-[10px] text-theme-text-muted font-bold font-mono uppercase">
                No active events found
              </span>
              <span className="text-[9px] text-theme-text-muted mt-1 leading-relaxed">
                Check other leagues or search another keyword.
              </span>
            </div>
          ) : (() => {
            const limitedEvents = sortedEvents.slice(0, visibleCount);
            // Group limitedEvents by stage and date string
            const groupedEvents: { [key: string]: { stage: string; dateStr: string; items: ScoreboardEvent[] } } = {};
            
            limitedEvents.forEach(evt => {
              const { stage, dateStr } = getEventStageAndDate(evt, selectedLeague);
              const key = `${stage}:::${dateStr}`;
              if (!groupedEvents[key]) {
                groupedEvents[key] = { stage, dateStr, items: [] };
              }
              groupedEvents[key].items.push(evt);
            });

            return Object.keys(groupedEvents).map((groupKey) => {
              const group = groupedEvents[groupKey];
              return (
                <div key={groupKey} className="space-y-2">
                  {/* Categorized Header */}
                  <div className="text-[10px] text-theme-text-muted/80 font-semibold lowercase font-sans mb-1 mt-3 px-1 flex items-center gap-1.5">
                    <span>{group.stage}</span>
                    <span className="text-[8px] opacity-60">•</span>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-medium opacity-90">{group.dateStr}</span>
                  </div>

                  {group.items.map((evt) => {
                    const comp = evt.competitions[0];
                    if (!comp) return null;

                    const home = comp.competitors.find(c => c.homeAway === 'home');
                    const away = comp.competitors.find(c => c.homeAway === 'away');
                    if (!home || !away) return null;

                    const isLive = evt.status.type.state === 'in';
                    const isPost = evt.status.type.state === 'post';
                    const isPre = evt.status.type.state === 'pre';

                    const isHomePinned = pinnedTeams.includes(home.team.displayName);
                    const isAwayPinned = pinnedTeams.includes(away.team.displayName);
                    const isAnyPinned = isHomePinned || isAwayPinned;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        role="listitem"
                        aria-label={`${away.team.displayName} vs ${home.team.displayName}, ${isLive ? `Live ${evt.status.displayClock || ''}` : isPost ? 'Full time' : evt.status.type.detail}`}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEvent(evt); } }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group/match ${
                          selectedEvent?.id === evt.id
                            ? 'border-theme-accent bg-theme-accent/5'
                            : isLive
                            ? 'border-theme-border/80 bg-theme-input-bg/10 hover:border-theme-accent/40'
                            : 'border-theme-border/40 bg-theme-input-bg/5 hover:border-theme-border/80'
                        }`}
                      >
                        {/* Status Indicator Bar */}
                        <div className="flex items-center justify-between text-[9px] font-mono leading-none font-bold">
                          <div className="flex items-center gap-1.5">
                            {isLive && (
                              <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                            <span className={`uppercase font-black tracking-wide ${
                              isLive ? 'text-red-500 font-black' : isPost ? 'text-theme-text-muted' : 'text-theme-accent'
                            }`}>
                              {isLive ? (evt.status.displayClock || 'LIVE') : isPost ? 'FULL TIME' : 'UPCOMING'}
                            </span>
                            {!isLive && (
                              <span className="text-[8px] text-theme-text-muted font-normal">
                                {evt.status.type.detail}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {isAnyPinned && <Star size={10} className="text-yellow-500 fill-yellow-500 shrink-0" />}
                            <span className="text-[8px] text-theme-text-muted max-w-[120px] truncate">
                              {comp.venue?.fullName || 'Stadium Arena'}
                            </span>
                          </div>
                        </div>

                        {/* Competitors Score Area */}
                        <div className="grid grid-cols-12 items-center gap-1">
                          {/* Away Team */}
                          <div className="col-span-5 flex items-center gap-2 min-w-0">
                            <button
                              onClick={(e) => handleTogglePin(away.team.displayName, e)}
                              className="opacity-0 group-hover/match:opacity-100 hover:scale-110 transition-all p-0.5 rounded cursor-pointer shrink-0 text-theme-text-muted hover:text-yellow-500"
                              title="Pin this team"
                              aria-label={isAwayPinned ? `Unpin ${away.team.displayName}` : `Pin ${away.team.displayName}`}
                            >
                              <Star size={10} className={isAwayPinned ? "text-yellow-500 fill-yellow-500" : ""} />
                            </button>
                            <img
                              src={away.team.logo || 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png'}
                              alt={away.team.displayName}
                              className="w-5 h-5 object-contain shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png';
                              }}
                            />
                            <span className={`text-[11px] font-black truncate text-theme-text ${
                              isPost && home.winner ? 'opacity-55 font-normal' : ''
                            }`}>
                              {away.team.displayName}
                            </span>
                          </div>

                          {/* Scores/VS Middle */}
                          <div className="col-span-2 flex items-center justify-center font-mono text-center font-black">
                            {isPre ? (
                              <span className="text-[9px] text-theme-text-muted font-normal tracking-tight">VS</span>
                            ) : (
                              <span className="text-[12px] flex items-center gap-1">
                                <span className={`${isPost && away.winner ? 'text-theme-accent' : ''}`}>{away.score}</span>
                                <span className="text-theme-text-muted font-normal text-[9px]">-</span>
                                <span className={`${isPost && home.winner ? 'text-theme-accent' : ''}`}>{home.score}</span>
                              </span>
                            )}
                          </div>

                          {/* Home Team */}
                          <div className="col-span-5 flex items-center justify-end gap-2 min-w-0 text-right">
                            <span className={`text-[11px] font-black truncate text-theme-text ${
                              isPost && away.winner ? 'opacity-55 font-normal' : ''
                            }`}>
                              {home.team.displayName}
                            </span>
                            <img
                              src={home.team.logo || 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png'}
                              alt={home.team.displayName}
                              className="w-5 h-5 object-contain shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png';
                              }}
                            />
                            <button
                              onClick={(e) => handleTogglePin(home.team.displayName, e)}
                              className="opacity-0 group-hover/match:opacity-100 hover:scale-110 transition-all p-0.5 rounded cursor-pointer shrink-0 text-theme-text-muted hover:text-yellow-500"
                              title="Pin this team"
                              aria-label={isHomePinned ? `Unpin ${home.team.displayName}` : `Pin ${home.team.displayName}`}
                            >
                              <Star size={10} className={isHomePinned ? "text-yellow-500 fill-yellow-500" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
          {visibleCount < sortedEvents.length && (
            <button
              onClick={() => onNavigate?.('sports')}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all shrink-0"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* DETAIL DRAWER / POPUP FOR CHOSEN MATCH */}
      {selectedEvent && (
        <ModalOverlay onClose={() => setSelectedEvent(null)} label={`Match details: ${selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || 'Away'} vs ${selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || 'Home'}`}>
            {/* DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-theme-border/30 pb-3 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
              Match Details
            </h3>
            <ModalCloseButton onClick={() => setSelectedEvent(null)} />
          </div>

          {/* TEAM HEADERS SIDE BY SIDE */}
          <div className="flex items-center justify-around text-center py-2 shrink-0 border-b border-theme-border/10 bg-theme-input-bg/15 rounded-xl mt-2">
            {/* Away Team */}
            <div className="flex flex-col items-center gap-1 max-w-[42%]">
              <img
                src={selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.logo || ''}
                alt="Away logo"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black leading-tight text-theme-text truncate w-full">
                {selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName}
              </span>
              {!selectedEvent.status.type.state.includes('pre') && (
                <span className="text-base font-black font-mono text-theme-text">
                  {selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.score}
                </span>
              )}
            </div>

            <div className="text-[9px] font-mono text-theme-text-muted font-bold px-2">
              VS
            </div>

            {/* Home Team */}
            <div className="flex flex-col items-center gap-1 max-w-[42%]">
              <img
                src={selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.logo || ''}
                alt="Home logo"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black leading-tight text-theme-text truncate w-full">
                {selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName}
              </span>
              {!selectedEvent.status.type.state.includes('pre') && (
                <span className="text-base font-black font-mono text-theme-text">
                  {selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.score}
                </span>
              )}
            </div>
          </div>

          {/* DETAIL TABS BAR */}
          <div className="flex border-b border-theme-border/20 my-2.5 overflow-x-auto scrollbar-none shrink-0 gap-1" role="tablist" aria-label="Match detail tabs">
            {[
              { id: 'overview', label: 'Overview', icon: Clock },
              { id: 'stats', label: 'Stats', icon: BarChart2 },
              { id: 'lineups', label: 'Lineups', icon: Users },
              { id: 'h2h', label: 'H2H', icon: Swords }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-mono ${
                    activeDetailTab === tab.id
                      ? 'border-theme-accent text-theme-text'
                      : 'border-transparent text-theme-text-muted hover:text-theme-text'
                  }`}
                  aria-label={`${tab.label} tab`}
                  aria-selected={activeDetailTab === tab.id}
                  role="tab"
                >
                  <TabIcon size={10} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT (SCROLLABLE) */}
          <div className="flex-1 py-1 overflow-y-auto scrollbar-none space-y-3 min-h-0 text-[10px]" role="tabpanel" aria-label={`${activeDetailTab} tab content`}>
            {activeDetailTab === 'overview' && (() => {
              const timelineData = getTimeline(selectedEvent, currentLeagueInfo.sport);
              return (
                <div className="space-y-3">
                  {/* General Info Card */}
                  <div className="bg-theme-input-bg/40 border border-theme-border/20 rounded-xl p-2.5 space-y-2 text-theme-text-muted">
                    <div className="flex items-center gap-2">
                      <Clock size={11} className="text-theme-accent shrink-0" />
                      <span className="font-mono text-[9px] font-bold">
                        {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {selectedEvent.competitions[0]?.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin size={11} className="text-theme-accent shrink-0" />
                        <span className="font-semibold leading-tight">
                          {selectedEvent.competitions[0].venue.fullName}
                          {selectedEvent.competitions[0].venue.address?.city && `, ${selectedEvent.competitions[0].venue.address.city}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar size={11} className="text-theme-accent shrink-0" />
                      <span className="font-semibold">
                        {currentLeagueInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Timeline / Pre-Match Preview */}
                  {timelineData.isPre ? (
                    <div className="bg-theme-input-bg/30 border border-theme-border/20 rounded-xl p-3 space-y-3">
                      <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
                        Pre-Match Simulation
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-theme-text-muted">
                        <div>
                          <span className="opacity-60 block text-[8px] uppercase font-mono">Referee</span>
                          <span className="font-bold text-theme-text">{timelineData.referee}</span>
                        </div>
                        <div>
                          <span className="opacity-60 block text-[8px] uppercase font-mono">Weather</span>
                          <span className="font-bold text-theme-text">{timelineData.weather}</span>
                        </div>
                      </div>

                      {/* Win Probability Bar */}
                      <div className="space-y-1.5 pt-1">
                        <span className="opacity-60 text-[8px] uppercase font-mono block">Win Probability</span>
                        <div className="flex items-center justify-between text-[8px] font-mono text-theme-text-muted">
                          <span>AWY {timelineData.prob?.away}%</span>
                          <span>DRAW {timelineData.prob?.draw}%</span>
                          <span>HOM {timelineData.prob?.home}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full overflow-hidden flex bg-theme-border/10 border border-theme-border/20">
                          <div style={{ width: `${timelineData.prob?.away}%` }} className="h-full bg-theme-text-muted/60" />
                          <div style={{ width: `${timelineData.prob?.draw}%` }} className="h-full bg-theme-input-bg/80" />
                          <div style={{ width: `${timelineData.prob?.home}%` }} className="h-full bg-theme-accent" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-theme-input-bg/30 border border-theme-border/20 rounded-xl p-3 space-y-2.5">
                      <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
                        Timeline
                      </span>
                      <div className="relative border-l border-theme-border/50 pl-3.5 ml-1.5 space-y-3 py-1">
                        {timelineData.timeline?.map((item, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-[19.5px] top-0.5 flex h-2 w-2 rounded-full bg-theme-accent ring-4 ring-theme-card" />
                            <div className="flex items-start gap-1.5">
                              <span className="font-mono font-bold text-theme-accent shrink-0">{item.minute}</span>
                              <span className="text-theme-text font-medium leading-relaxed">{item.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeDetailTab === 'stats' && (() => {
              const stats = getDetailedStats(selectedEvent, currentLeagueInfo.sport);
              return (
                <div className="space-y-3 bg-theme-input-bg/25 border border-theme-border/20 rounded-xl p-3">
                  <span className="text-[9px] font-black uppercase font-mono text-theme-accent block">
                    Match Statistics
                  </span>
                  <div className="space-y-3">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-theme-text font-bold">
                          <span>{stat.away}</span>
                          <span className="text-theme-text-muted font-normal text-[8px] uppercase tracking-wider">{stat.label}</span>
                          <span>{stat.home}</span>
                        </div>
                        <div className="h-1.5 w-full bg-theme-border/10 rounded-full flex overflow-hidden border border-theme-border/5">
                          <div style={{ width: `${stat.awayPct}%` }} className="h-full bg-theme-text-muted/60" />
                          <div style={{ width: `${stat.homePct}%` }} className="h-full bg-theme-accent animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {activeDetailTab === 'lineups' && (() => {
              const { homeLineup, awayLineup } = getLineups(selectedEvent, currentLeagueInfo.sport);
              const homeTeamName = selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || 'Home';
              const awayTeamName = selectedEvent.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || 'Away';
              return (
                <div className="grid grid-cols-2 gap-3">
                  {/* Away Lineup */}
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

                  {/* Home Lineup */}
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
            })()}

            {activeDetailTab === 'h2h' && (() => {
              const h2h = getH2H(selectedEvent);
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
            })()}
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}
