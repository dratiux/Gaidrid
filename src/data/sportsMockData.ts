// Shared interfaces for sports data
export interface Team {
  id: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  color?: string;
}

export interface Competitor {
  id: string;
  homeAway: 'home' | 'away';
  score: string;
  winner?: boolean;
  team: Team;
}

export interface Competition {
  id: string;
  date: string;
  venue?: {
    fullName: string;
    address?: {
      city: string;
      country?: string;
    };
  };
  competitors: Competitor[];
  notes?: { headline: string }[];
}

export interface EventStatus {
  clock?: number;
  displayClock?: string;
  period?: number;
  type: {
    state: 'pre' | 'in' | 'post';
    detail: string;
    shortDetail?: string;
  };
}

export interface ScoreboardEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: EventStatus;
  competitions: Competition[];
  season?: {
    type: number;
    slug?: string;
    displayName?: string;
  };
}

// League definitions
export const LEAGUES = [
  { id: 'all', name: 'Football', sport: 'soccer', label: 'All Football / World Cup ⚽' },
  { id: 'nba', name: 'Basketball', sport: 'basketball', label: 'NBA Basketball 🏀' },
  { id: 'mlb', name: 'Baseball', sport: 'baseball', label: 'MLB Baseball ⚾' },
  { id: 'nhl', name: 'Hockey', sport: 'hockey', label: 'NHL Hockey 🏒' },
  { id: 'nfl', name: 'NFL', sport: 'football', label: 'NFL Football 🏈' },
  { id: 'wnba', name: 'WNBA', sport: 'basketball', label: 'WNBA Basketball 🏀' },
];

// Rich, high-quality backup data for periods when matches are not live or API is unreachable
export const MOCK_EVENTS: { [key: string]: ScoreboardEvent[] } = {
  'all': [
    {
      id: 'mock-wc-1',
      date: new Date().toISOString(),
      name: 'Argentina at Brazil',
      shortName: 'ARG @ BRA',
      status: {
        displayClock: "82'",
        period: 2,
        type: { state: 'in', detail: '82\' (Live - World Cup Qualifier)' }
      },
      competitions: [{
        id: 'comp-wc-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Maracanã', address: { city: 'Rio de Janeiro' } },
        competitors: [
          {
            id: 'home-bra',
            homeAway: 'home',
            score: '2',
            team: { id: 'bra', displayName: 'Brazil', abbreviation: 'BRA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/203.png' }
          },
          {
            id: 'away-arg',
            homeAway: 'away',
            score: '3',
            team: { id: 'arg', displayName: 'Argentina', abbreviation: 'ARG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/202.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-wc-2',
      date: new Date(Date.now() + 86400000 * 1.5).toISOString(),
      name: 'Germany at France',
      shortName: 'GER @ FRA',
      status: {
        type: { state: 'pre', detail: 'Tomorrow 21:00 (World Cup Group Stage)' }
      },
      competitions: [{
        id: 'comp-wc-2',
        date: new Date(Date.now() + 86400000 * 1.5).toISOString(),
        venue: { fullName: 'Stade de France', address: { city: 'Paris' } },
        competitors: [
          {
            id: 'home-fra',
            homeAway: 'home',
            score: '0',
            team: { id: 'fra', displayName: 'France', abbreviation: 'FRA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png' }
          },
          {
            id: 'away-ger',
            homeAway: 'away',
            score: '0',
            team: { id: 'ger', displayName: 'Germany', abbreviation: 'GER', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/164.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-wc-3',
      date: new Date(Date.now() - 172800000).toISOString(),
      name: 'Real Madrid at Barcelona',
      shortName: 'RMA @ BAR',
      status: {
        type: { state: 'post', detail: 'FT' }
      },
      competitions: [{
        id: 'comp-wc-3',
        date: new Date(Date.now() - 172800000).toISOString(),
        venue: { fullName: 'Spotify Camp Nou', address: { city: 'Barcelona' } },
        competitors: [
          {
            id: 'home-bar',
            homeAway: 'home',
            score: '3',
            winner: true,
            team: { id: 'bar', displayName: 'Barcelona', abbreviation: 'BAR', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png' }
          },
          {
            id: 'away-rma',
            homeAway: 'away',
            score: '2',
            team: { id: 'rma', displayName: 'Real Madrid', abbreviation: 'RMA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-wc-4',
      date: new Date(Date.now() + 7200000).toISOString(),
      name: 'France at England',
      shortName: 'FRA @ ENG',
      status: {
        type: { state: 'pre', detail: 'Today, 8:00 PM' }
      },
      competitions: [{
        id: 'comp-wc-4',
        date: new Date(Date.now() + 7200000).toISOString(),
        venue: { fullName: 'Wembley Stadium', address: { city: 'London' } },
        competitors: [
          {
            id: 'home-eng',
            homeAway: 'home',
            score: '0',
            team: { id: 'eng', displayName: 'England', abbreviation: 'ENG', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/348.png' }
          },
          {
            id: 'away-fra',
            homeAway: 'away',
            score: '0',
            team: { id: 'fra', displayName: 'France', abbreviation: 'FRA', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-wc-5',
      date: new Date(Date.now() - 86400000).toISOString(),
      name: 'Spain at Germany',
      shortName: 'ESP @ GER',
      status: {
        type: { state: 'post', detail: 'Final' }
      },
      competitions: [{
        id: 'comp-wc-5',
        date: new Date(Date.now() - 86400000).toISOString(),
        venue: { fullName: 'Allianz Arena', address: { city: 'Munich' } },
        competitors: [
          {
            id: 'home-ger',
            homeAway: 'home',
            score: '1',
            winner: false,
            team: { id: 'ger', displayName: 'Germany', abbreviation: 'GER', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/350.png' }
          },
          {
            id: 'away-esp',
            homeAway: 'away',
            score: '2',
            winner: true,
            team: { id: 'esp', displayName: 'Spain', abbreviation: 'ESP', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/351.png' }
          }
        ]
      }]
    }
  ],
  'nba': [
    {
      id: 'mock-nba-1',
      date: new Date().toISOString(),
      name: 'Boston Celtics at Los Angeles Lakers',
      shortName: 'BOS @ LAL',
      status: {
        displayClock: '8:45',
        period: 4,
        type: { state: 'in', detail: 'Q4 8:45' }
      },
      competitions: [{
        id: 'comp-nba-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Crypto.com Arena', address: { city: 'Los Angeles' } },
        competitors: [
          {
            id: 'home-lal',
            homeAway: 'home',
            score: '104',
            team: { id: 'lal', displayName: 'LA Lakers', abbreviation: 'LAL', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png' }
          },
          {
            id: 'away-bos',
            homeAway: 'away',
            score: '109',
            team: { id: 'bos', displayName: 'Boston Celtics', abbreviation: 'BOS', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-nba-2',
      date: new Date(Date.now() + 18000000).toISOString(),
      name: 'Golden State Warriors at Chicago Bulls',
      shortName: 'GSW @ CHI',
      status: {
        type: { state: 'pre', detail: 'Tonight 22:30' }
      },
      competitions: [{
        id: 'comp-nba-2',
        date: new Date().toISOString(),
        venue: { fullName: 'United Center', address: { city: 'Chicago' } },
        competitors: [
          {
            id: 'home-chi',
            homeAway: 'home',
            score: '0',
            team: { id: 'chi', displayName: 'Chicago Bulls', abbreviation: 'CHI', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png' }
          },
          {
            id: 'away-gsw',
            homeAway: 'away',
            score: '0',
            team: { id: 'gsw', displayName: 'Golden State Warriors', abbreviation: 'GSW', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-nba-3',
      date: new Date().toISOString(),
      name: 'Los Angeles Lakers at Boston Celtics',
      shortName: 'LAL @ BOS',
      status: {
        displayClock: "5:24",
        period: 3,
        type: { state: 'in', detail: '3rd Period - 5:24' }
      },
      competitions: [{
        id: 'comp-nba-3',
        date: new Date().toISOString(),
        venue: { fullName: 'TD Garden', address: { city: 'Boston' } },
        competitors: [
          {
            id: 'home-bos',
            homeAway: 'home',
            score: '88',
            team: { id: 'bos', displayName: 'Celtics', abbreviation: 'BOS', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png' }
          },
          {
            id: 'away-lal',
            homeAway: 'away',
            score: '84',
            team: { id: 'lal', displayName: 'Lakers', abbreviation: 'LAL', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-nba-4',
      date: new Date(Date.now() + 10800000).toISOString(),
      name: 'Golden State Warriors at Miami Heat',
      shortName: 'GSW @ MIA',
      status: {
        type: { state: 'pre', detail: 'Tonight, 9:00 PM' }
      },
      competitions: [{
        id: 'comp-nba-4',
        date: new Date(Date.now() + 10800000).toISOString(),
        venue: { fullName: 'Kaseya Center', address: { city: 'Miami' } },
        competitors: [
          {
            id: 'home-mia',
            homeAway: 'home',
            score: '0',
            team: { id: 'mia', displayName: 'Heat', abbreviation: 'MIA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png' }
          },
          {
            id: 'away-gsw',
            homeAway: 'away',
            score: '0',
            team: { id: 'gsw', displayName: 'Warriors', abbreviation: 'GSW', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png' }
          }
        ]
      }]
    }
  ],
  'mlb': [
    {
      id: 'mock-mlb-1',
      date: new Date().toISOString(),
      name: 'New York Yankees at Boston Red Sox',
      shortName: 'NYY @ BOS',
      status: {
        displayClock: 'Bot 7',
        period: 7,
        type: { state: 'in', detail: 'Bottom of the 7th' }
      },
      competitions: [{
        id: 'comp-mlb-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Fenway Park', address: { city: 'Boston' } },
        competitors: [
          {
            id: 'home-bos-redsox',
            homeAway: 'home',
            score: '4',
            team: { id: 'bos-mlb', displayName: 'Red Sox', abbreviation: 'BOS', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png' }
          },
          {
            id: 'away-nyy-yankees',
            homeAway: 'away',
            score: '5',
            team: { id: 'nyy-mlb', displayName: 'Yankees', abbreviation: 'NYY', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-mlb-2',
      date: new Date(Date.now() + 86400000).toISOString(),
      name: 'Los Angeles Dodgers at San Francisco Giants',
      shortName: 'LAD @ SF',
      status: {
        type: { state: 'pre', detail: 'Tomorrow 19:15' }
      },
      competitions: [{
        id: 'comp-mlb-2',
        date: new Date().toISOString(),
        venue: { fullName: 'Oracle Park', address: { city: 'San Francisco' } },
        competitors: [
          {
            id: 'home-sf',
            homeAway: 'home',
            score: '0',
            team: { id: 'sf-mlb', displayName: 'Giants', abbreviation: 'SF', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sf.png' }
          },
          {
            id: 'away-lad',
            homeAway: 'away',
            score: '0',
            team: { id: 'lad-mlb', displayName: 'Dodgers', abbreviation: 'LAD', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png' }
          }
        ]
      }]
    }
  ],
  'nhl': [
    {
      id: 'mock-nhl-1',
      date: new Date().toISOString(),
      name: 'Toronto Maple Leafs at Montreal Canadiens',
      shortName: 'TOR @ MTL',
      status: {
        displayClock: '14:20',
        period: 2,
        type: { state: 'in', detail: '2nd Period 14:20' }
      },
      competitions: [{
        id: 'comp-nhl-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Bell Centre', address: { city: 'Montreal' } },
        competitors: [
          {
            id: 'home-mtl',
            homeAway: 'home',
            score: '1',
            team: { id: 'mtl-nhl', displayName: 'Canadiens', abbreviation: 'MTL', logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/mtl.png' }
          },
          {
            id: 'away-tor',
            homeAway: 'away',
            score: '3',
            team: { id: 'tor-nhl', displayName: 'Maple Leafs', abbreviation: 'TOR', logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/tor.png' }
          }
        ]
      }]
    }
  ],
  'nfl': [
    {
      id: 'mock-nfl-1',
      date: new Date().toISOString(),
      name: 'Kansas City Chiefs at San Francisco 49ers',
      shortName: 'KC @ SF',
      status: {
        displayClock: '2:15',
        period: 3,
        type: { state: 'in', detail: 'Q3 2:15' }
      },
      competitions: [{
        id: 'comp-nfl-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Levi\'s Stadium', address: { city: 'Santa Clara' } },
        competitors: [
          {
            id: 'home-sf-49ers',
            homeAway: 'home',
            score: '17',
            team: { id: 'sf-nfl', displayName: '49ers', abbreviation: 'SF', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png' }
          },
          {
            id: 'away-kc-chiefs',
            homeAway: 'away',
            score: '21',
            team: { id: 'kc-nfl', displayName: 'Chiefs', abbreviation: 'KC', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png' }
          }
        ]
      }]
    },
    {
      id: 'mock-nfl-2',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      name: 'Dallas Cowboys at New York Giants',
      shortName: 'DAL @ NYG',
      status: {
        type: { state: 'pre', detail: 'Sunday 16:25' }
      },
      competitions: [{
        id: 'comp-nfl-2',
        date: new Date().toISOString(),
        venue: { fullName: 'MetLife Stadium', address: { city: 'East Rutherford' } },
        competitors: [
          {
            id: 'home-nyg',
            homeAway: 'home',
            score: '0',
            team: { id: 'nyg-nfl', displayName: 'Giants', abbreviation: 'NYG', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png' }
          },
          {
            id: 'away-dal',
            homeAway: 'away',
            score: '0',
            team: { id: 'dal-nfl', displayName: 'Cowboys', abbreviation: 'DAL', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png' }
          }
        ]
      }]
    }
  ],
  'wnba': [
    {
      id: 'mock-wnba-1',
      date: new Date().toISOString(),
      name: 'Indiana Fever at New York Liberty',
      shortName: 'IND @ NYL',
      status: {
        displayClock: '4:10',
        period: 2,
        type: { state: 'in', detail: 'Q2 4:10' }
      },
      competitions: [{
        id: 'comp-wnba-1',
        date: new Date().toISOString(),
        venue: { fullName: 'Barclays Center', address: { city: 'Brooklyn' } },
        competitors: [
          {
            id: 'home-nyl',
            homeAway: 'home',
            score: '42',
            team: { id: 'nyl-wnba', displayName: 'Liberty', abbreviation: 'NYL', logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/nyl.png' }
          },
          {
            id: 'away-ind',
            homeAway: 'away',
            score: '38',
            team: { id: 'ind-wnba', displayName: 'Fever', abbreviation: 'IND', logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/ind.png' }
          }
        ]
      }]
    }
  ]
};

// Player name pools for lineup generation
export const soccerPlayers = [
  'M. Salah', 'L. Messi', 'E. Haaland', 'K. De Bruyne', 'V. Junior', 'K. Mbappe', 'R. Lewandowski', 'J. Bellingham',
  'H. Kane', 'B. Saka', 'M. Odegaard', 'R. Dias', 'Virgil', 'Alisson', 'Courtois', 'Ter Stegen', 'Pedri', 'Gavi',
  'Rodri', 'L. Martinez', 'Griezmann', 'F. de Jong', 'Musiala', 'Wirtz', 'Kimmich', 'Sane', 'Davies', 'Upamecano'
];

export const basketballPlayers = [
  'L. James', 'A. Davis', 'S. Curry', 'J. Tatum', 'J. Brown', 'L. Doncic', 'K. Irving', 'N. Jokic', 'J. Embiid',
  'G. Antetokounmpo', 'D. Booker', 'K. Durant', 'A. Edwards', 'S. Gilgeous-Alexander', 'T. Haliburton', 'J. Brunson',
  'A. Sengun', 'P. George', 'K. Leonard', 'J. Harden', 'D. Mitchell', 'B. Adebayo', 'J. Butler', 'P. Banchero'
];

export const genericPlayers = [
  'J. Smith', 'M. Johnson', 'T. Williams', 'D. Jones', 'C. Brown', 'J. Davis', 'A. Miller', 'G. Wilson',
  'K. Thomas', 'R. Anderson', 'M. Taylor', 'S. Thomas', 'L. Jackson', 'E. White', 'B. Harris', 'J. Martin'
];

// Generate lineups for a match
export const getLineups = (event: ScoreboardEvent, sport: string) => {
  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomVal = (list: string[], idx: number) => list[(seed + idx) % list.length];

  const pool = sport === 'soccer' ? soccerPlayers : sport === 'basketball' ? basketballPlayers : genericPlayers;

  const homeLineup = [];
  const awayLineup = [];
  const count = sport === 'basketball' ? 5 : 6;

  for (let i = 0; i < count; i++) {
    const num1 = ((seed * (i + 1)) % 98) + 1;
    const num2 = ((seed * (i + 5)) % 98) + 1;

    homeLineup.push({
      number: num1,
      name: randomVal(pool, i * 2),
      role: sport === 'soccer' ? (i === 0 ? 'GK' : i < 3 ? 'DEF' : i < 5 ? 'MID' : 'FWD') : (i === 0 ? 'G' : i < 3 ? 'F' : 'C')
    });

    awayLineup.push({
      number: num2,
      name: randomVal(pool, i * 2 + 1),
      role: sport === 'soccer' ? (i === 0 ? 'GK' : i < 3 ? 'DEF' : i < 5 ? 'MID' : 'FWD') : (i === 0 ? 'G' : i < 3 ? 'F' : 'C')
    });
  }

  return { homeLineup, awayLineup };
};

// Generate head-to-head history for a match
export const getH2H = (event: ScoreboardEvent) => {
  const home = event.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.displayName || 'Home';
  const away = event.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.displayName || 'Away';

  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rScore = (offset: number) => ((seed + offset) % 4).toString();

  const dates = [
    'Oct 12, 2025',
    'Apr 24, 2025',
    'Nov 08, 2024'
  ];

  return [
    { date: dates[0], home, away, score: `${rScore(1)} - ${rScore(2)}`, winner: parseInt(rScore(1)) > parseInt(rScore(2)) ? home : away },
    { date: dates[1], home, away, score: `${rScore(3)} - ${rScore(4)}`, winner: parseInt(rScore(3)) > parseInt(rScore(4)) ? home : away },
    { date: dates[2], home, away, score: `${rScore(5)} - ${rScore(6)}`, winner: parseInt(rScore(5)) > parseInt(rScore(6)) ? home : away },
  ];
};

// Generate match statistics (used by SportsPage)
export const getStats = (event: ScoreboardEvent, sport: string) => {
  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (max: number, min = 0) => min + (seed % (max - min + 1));

  if (sport === 'basketball' || event.id.includes('nba')) {
    const homeReb = random(45, 35);
    const awayReb = random(42, 32);
    const homeAst = random(28, 20);
    const awayAst = random(24, 18);
    const homeFg = random(52, 41);
    const awayFg = random(48, 40);

    return [
      { label: 'Field Goal %', home: `${homeFg}%`, away: `${awayFg}%`, homePct: homeFg, awayPct: awayFg },
      { label: 'Total Rebounds', home: homeReb.toString(), away: awayReb.toString(), homePct: (homeReb / (homeReb + awayReb)) * 100, awayPct: (awayReb / (homeReb + awayReb)) * 100 },
      { label: 'Assists', home: homeAst.toString(), away: awayAst.toString(), homePct: (homeAst / (homeAst + awayAst)) * 100, awayPct: (awayAst / (homeAst + awayAst)) * 100 },
      { label: 'Blocks', home: random(8, 2).toString(), away: random(7, 1).toString(), homePct: 50, awayPct: 50 },
      { label: 'Turnovers', home: random(16, 8).toString(), away: random(18, 9).toString(), homePct: 45, awayPct: 55 },
    ];
  } else if (sport === 'soccer' || event.id.includes('wc')) {
    const homePos = random(62, 45);
    const awayPos = 100 - homePos;
    const homeShots = random(16, 6);
    const awayShots = random(14, 5);
    const homeFouls = random(14, 6);
    const awayFouls = random(16, 7);

    return [
      { label: 'Possession %', home: `${homePos}%`, away: `${awayPos}%`, homePct: homePos, awayPct: awayPos },
      { label: 'Shots on Goal', home: homeShots.toString(), away: awayShots.toString(), homePct: (homeShots / (homeShots + awayShots)) * 100, awayPct: (awayShots / (homeShots + awayShots)) * 100 },
      { label: 'Fouls', home: homeFouls.toString(), away: awayFouls.toString(), homePct: (homeFouls / (homeFouls + awayFouls)) * 100, awayPct: (awayFouls / (homeFouls + awayFouls)) * 100 },
      { label: 'Yellow Cards', home: random(3, 0).toString(), away: random(4, 0).toString(), homePct: 50, awayPct: 50 },
      { label: 'Corner Kicks', home: random(8, 2).toString(), away: random(7, 2).toString(), homePct: 55, awayPct: 45 },
    ];
  } else {
    return [
      { label: 'Offensive Pct', home: '52%', away: '48%', homePct: 52, awayPct: 48 },
      { label: 'Saves', home: '4', away: '3', homePct: 57, awayPct: 43 },
      { label: 'Fouls / Penalties', home: '5', away: '6', homePct: 45, awayPct: 55 },
    ];
  }
};

// Generate detailed match statistics (used by SportsWidget)
export const getDetailedStats = (event: ScoreboardEvent, sport: string) => {
  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (max: number, offset = 0) => Math.floor(((seed * 9301 + 49297) % 233280) / 233280 * max) + offset;
  const randomFloat = (max: number, offset = 0) => parseFloat((((seed * 9301 + 49297) % 233280) / 233280 * max + offset).toFixed(1));

  if (sport === 'soccer') {
    const homePoss = random(20, 40);
    const awayPoss = 100 - homePoss;
    const homeShots = random(10, 8);
    const awayShots = random(10, 6);
    const homeSOT = Math.round(homeShots * (0.3 + randomFloat(0.3)));
    const awaySOT = Math.round(awayShots * (0.3 + randomFloat(0.3)));

    return [
      { label: 'Possession %', home: `${homePoss}%`, away: `${awayPoss}%`, homePct: homePoss, awayPct: awayPoss },
      { label: 'Total Shots', home: homeShots.toString(), away: awayShots.toString(), homePct: (homeShots / (homeShots + awayShots)) * 100, awayPct: (awayShots / (homeShots + awayShots)) * 100 },
      { label: 'Shots on Target', home: homeSOT.toString(), away: awaySOT.toString(), homePct: (homeSOT / (homeSOT + awaySOT || 1)) * 100, awayPct: (awaySOT / (homeSOT + awaySOT || 1)) * 100 },
      { label: 'Fouls Committed', home: random(8, 6).toString(), away: random(8, 7).toString(), homePct: 45, awayPct: 55 },
      { label: 'Yellow Cards', home: random(3, 0).toString(), away: random(3, 0).toString(), homePct: 50, awayPct: 50 },
      { label: 'Corner Kicks', home: random(6, 2).toString(), away: random(6, 2).toString(), homePct: 40, awayPct: 60 },
      { label: 'Offsides', home: random(4, 0).toString(), away: random(4, 0).toString(), homePct: 30, awayPct: 70 },
    ];
  } else if (sport === 'basketball') {
    const homeFG = randomFloat(12, 40);
    const awayFG = randomFloat(12, 38);
    const homeReb = random(15, 35);
    const awayReb = random(15, 33);
    const homeAst = random(12, 15);
    const awayAst = random(12, 13);

    return [
      { label: 'Field Goal %', home: `${homeFG}%`, away: `${awayFG}%`, homePct: (homeFG / (homeFG + awayFG)) * 100, awayPct: (awayFG / (homeFG + awayFG)) * 100 },
      { label: 'Total Rebounds', home: homeReb.toString(), away: awayReb.toString(), homePct: (homeReb / (homeReb + awayReb)) * 100, awayPct: (awayReb / (homeReb + awayReb)) * 100 },
      { label: 'Assists', home: homeAst.toString(), away: awayAst.toString(), homePct: (homeAst / (homeAst + awayAst)) * 100, awayPct: (awayAst / (homeAst + awayAst)) * 100 },
      { label: 'Turnovers', home: random(6, 8).toString(), away: random(6, 9).toString(), homePct: 50, awayPct: 50 },
      { label: 'Blocks', home: random(5, 2).toString(), away: random(5, 2).toString(), homePct: 45, awayPct: 55 },
      { label: 'Steals', home: random(6, 4).toString(), away: random(6, 4).toString(), homePct: 60, awayPct: 40 },
    ];
  } else if (sport === 'baseball') {
    const homeR = event.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.score || '0';
    const awayR = event.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.score || '0';
    const homeH = random(6, 5);
    const awayH = random(6, 4);
    const homeE = random(2, 0);
    const awayE = random(2, 0);

    return [
      { label: 'Runs', home: homeR, away: awayR, homePct: (parseInt(homeR) / (parseInt(homeR) + parseInt(awayR) || 1)) * 100, awayPct: (parseInt(awayR) / (parseInt(homeR) + parseInt(awayR) || 1)) * 100 },
      { label: 'Hits', home: homeH.toString(), away: awayH.toString(), homePct: (homeH / (homeH + awayH)) * 100, awayPct: (awayH / (homeH + awayH)) * 100 },
      { label: 'Errors', home: homeE.toString(), away: awayE.toString(), homePct: 50, awayPct: 50 },
      { label: 'Home Runs', home: random(3, 0).toString(), away: random(3, 0).toString(), homePct: 40, awayPct: 60 },
      { label: 'Strikeouts', home: random(5, 6).toString(), away: random(5, 7).toString(), homePct: 45, awayPct: 55 },
    ];
  } else if (sport === 'football') {
    const homeYds = random(150, 250);
    const awayYds = random(150, 230);
    const homePass = random(100, 180);
    const awayPass = random(100, 160);
    const homeRush = Math.max(20, homeYds - homePass);
    const awayRush = Math.max(20, awayYds - awayPass);

    return [
      { label: 'Total Yards', home: homeYds.toString(), away: awayYds.toString(), homePct: (homeYds / (homeYds + awayYds)) * 100, awayPct: (awayYds / (homeYds + awayYds)) * 100 },
      { label: 'Passing Yards', home: homePass.toString(), away: awayPass.toString(), homePct: (homePass / (homePass + awayPass)) * 100, awayPct: (awayPass / (homePass + awayPass)) * 100 },
      { label: 'Rushing Yards', home: homeRush.toString(), away: awayRush.toString(), homePct: (homeRush / (homeRush + awayRush)) * 100, awayPct: (awayRush / (homeRush + awayRush)) * 100 },
      { label: 'Turnovers', home: random(3, 0).toString(), away: random(3, 0).toString(), homePct: 50, awayPct: 50 },
      { label: 'First Downs', home: random(10, 12).toString(), away: random(10, 10).toString(), homePct: 52, awayPct: 48 },
    ];
  } else {
    const homeShots = random(15, 20);
    const awayShots = random(15, 18);
    const homeHits = random(10, 15);
    const awayHits = random(10, 16);

    return [
      { label: 'Shots on Goal', home: homeShots.toString(), away: awayShots.toString(), homePct: (homeShots / (homeShots + awayShots)) * 100, awayPct: (awayShots / (homeShots + awayShots)) * 100 },
      { label: 'Hits', home: homeHits.toString(), away: awayHits.toString(), homePct: (homeHits / (homeHits + awayHits)) * 100, awayPct: (awayHits / (homeHits + awayHits)) * 100 },
      { label: 'Faceoff Win %', home: `${random(20, 40)}%`, away: `${100 - random(20, 40)}%`, homePct: 50, awayPct: 50 },
      { label: 'Penalty Minutes', home: random(6, 2).toString(), away: random(6, 2).toString(), homePct: 40, awayPct: 60 },
    ];
  }
};

// Generate timeline data for SportsWidget (with referee/weather for pre-match)
export const getTimeline = (event: ScoreboardEvent, sport: string) => {
  const isPre = event.status.type.state === 'pre';
  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (isPre) {
    const winProbHome = 35 + (seed % 30);
    const winProbAway = 100 - winProbHome - (seed % 10);
    const draw = 100 - winProbHome - winProbAway;
    return {
      isPre: true,
      referee: ['Michael Oliver', 'Anthony Taylor', 'Szymon Marciniak', 'Danny Makkelie'][seed % 4],
      weather: ['Clear Sky, 22°C', 'Partly Cloudy, 19°C', 'Light Rain, 15°C', 'Pleasant, 24°C'][seed % 4],
      prob: { home: winProbHome, away: winProbAway, draw }
    };
  }

  const homeAbbr = event.competitions[0]?.competitors.find(c => c.homeAway === 'home')?.team.abbreviation || 'HOM';
  const awayAbbr = event.competitions[0]?.competitors.find(c => c.homeAway === 'away')?.team.abbreviation || 'AWY';

  if (sport === 'soccer') {
    return {
      isPre: false,
      timeline: [
        { minute: "12'", text: "Match kickoff under clear skies." },
        { minute: "41'", text: `Goal! Beautiful curving finish inside the box by ${seed % 2 === 0 ? homeAbbr : awayAbbr}.` },
        { minute: "72'", text: "Yellow card issued for a tactical foul in the midfield." }
      ]
    };
  } else if (sport === 'basketball') {
    return {
      isPre: false,
      timeline: [
        { minute: "Q1", text: "Game starts with fast-paced transition offense." },
        { minute: "Q2", text: `Spectacular alley-oop dunk completed by ${seed % 2 === 0 ? homeAbbr : awayAbbr}.` },
        { minute: "Q4", text: "High intensity defensive stops defining the clutch minutes." }
      ]
    };
  } else {
    return {
      isPre: false,
      timeline: [
        { minute: "1st", text: "Physical contest starting with quick end-to-end plays." },
        { minute: "2nd", text: `Incredible save keeps the match locked.` },
        { minute: "3rd", text: "Power play advantage creates offensive pressure." }
      ]
    };
  }
};

// Generate timeline data for SportsPage (with odds for pre-match)
export const getTimelinePreview = (event: ScoreboardEvent, sport: string) => {
  const isPre = event.status.type.state === 'pre';
  const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (isPre) {
    const winProbHome = 35 + (seed % 30);
    return {
      isPre: true,
      homeWinProb: winProbHome,
      awayWinProb: 100 - winProbHome,
      odds: `${(1.5 + (seed % 10) / 10).toFixed(2)} / ${(2.0 + (seed % 20) / 10).toFixed(2)}`
    };
  }

  if (sport === 'basketball' || event.id.includes('nba')) {
    return {
      isPre: false,
      timeline: [
        { minute: "Q1", text: "Stunning three pointer sets early tempo." },
        { minute: "Q2", text: "Defensive interception followed by high velocity fast break." },
        { minute: "Q3", text: "Sublime alley-oop slam fires up the home crowd." },
        { minute: "Q4", text: "High intensity defensive stops defining the clutch minutes." }
      ]
    };
  } else {
    return {
      isPre: false,
      timeline: [
        { minute: "1st", text: "Physical contest starting with quick end-to-end plays." },
        { minute: "2nd", text: `Incredible save keeps the match locked.` },
        { minute: "3rd", text: "Power play advantage creates offensive pressure." }
      ]
    };
  }
};

// Determine event stage and date for grouping (used by SportsWidget)
export const getEventStageAndDate = (event: ScoreboardEvent, selectedLeague: string) => {
  let stageName = '';

  if (event.competitions?.[0]?.notes?.[0]?.headline) {
    stageName = event.competitions[0].notes[0].headline;
  } else if (event.season?.displayName) {
    stageName = event.season.displayName;
  } else if (event.season?.slug) {
    stageName = event.season.slug.replace(/-/g, ' ');
  } else {
    const leagueInfo = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];
    if (leagueInfo.id === 'all') {
      if (event.id.includes('wc') || event.name.toLowerCase().includes('world cup') || event.status?.type?.detail?.toLowerCase().includes('world cup')) {
        stageName = 'World Cup Group Stage';
      } else {
        stageName = 'International match';
      }
    } else {
      stageName = `${leagueInfo.name} Match`;
    }
  }

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return {
    stage: stageName.toLowerCase().replace(/\s+/g, '-'),
    dateStr
  };
};
