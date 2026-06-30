import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  LEAGUES, MOCK_EVENTS, ScoreboardEvent,
} from '../data/sportsMockData';
import ScoreboardSidebar from './sports/ScoreboardSidebar';
import ScoreboardGrid from './sports/ScoreboardGrid';
import MatchDetailModal from './sports/MatchDetailModal';

export default function SportsPage() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [events, setEvents] = useState<ScoreboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ScoreboardEvent | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [filterState, setFilterState] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

  const [pinnedTeams, setPinnedTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gaidrid_pinned_teams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentLeagueInfo = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];

  useEffect(() => {
    fetchScores(true);
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
    try {
      const activeLeague = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];
      const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${activeLeague.sport}/${activeLeague.id}/scoreboard`);
      if (!res.ok) throw new Error('API failure');
      const data = await res.json();

      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        setEvents(MOCK_EVENTS[selectedLeague] || MOCK_EVENTS['all'] || []);
      }
    } catch (err) {
      console.warn('ESPN API fetch failed, falling back to local simulation data.', err);
      setEvents(MOCK_EVENTS[selectedLeague] || MOCK_EVENTS['all'] || []);
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

  const filteredEvents = events.filter(evt => {
    if (filterState === 'live' && evt.status.type.state !== 'in') return false;
    if (filterState === 'upcoming' && evt.status.type.state !== 'pre') return false;
    if (filterState === 'completed' && evt.status.type.state !== 'post') return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const homeTeam = evt.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || '';
    const awayTeam = evt.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || '';
    return homeTeam.toLowerCase().includes(query) || awayTeam.toLowerCase().includes(query) || evt.name.toLowerCase().includes(query);
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const aHome = a.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || '';
    const aAway = a.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || '';
    const bHome = b.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || '';
    const bAway = b.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || '';

    const aPinned = pinnedTeams.includes(aHome) || pinnedTeams.includes(aAway);
    const bPinned = pinnedTeams.includes(bHome) || pinnedTeams.includes(bAway);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    const aLive = a.status.type.state === 'in';
    const bLive = b.status.type.state === 'in';
    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;

    return 0;
  });

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Upper Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border/20 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">
            Sports
          </h2>
          <p className="text-xs text-theme-text-muted mt-0.5 font-sans uppercase tracking-wider">
            Realtime scores, team stats, play-by-plays, and roster feeds
          </p>
        </div>
      </div>

      {/* Main Grid containing league filters and scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <ScoreboardSidebar
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterState={filterState}
          onFilterChange={setFilterState}
          loading={loading}
          onRefresh={() => fetchScores(true)}
        />
        <ScoreboardGrid
          sortedEvents={sortedEvents}
          leagueName={currentLeagueInfo.name}
          pinnedTeams={pinnedTeams}
          onTogglePin={handleTogglePin}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      {/* DETAIL OVERLAY / MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div key={selectedEvent.id}>
            <MatchDetailModal
              event={selectedEvent}
              leagueSport={currentLeagueInfo.sport}
              activeDetailTab={activeDetailTab}
              onTabChange={setActiveDetailTab}
              onClose={() => setSelectedEvent(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
