export const THEME_MAP: Record<string, {
  bg: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  inputBg: string;
  isDark: boolean;
}> = {
  'gaidrid-light': {
    bg: '#EEEEEE',
    card: '#FFFFFF',
    border: 'rgba(34, 40, 49, 0.12)',
    text: '#222831',
    textMuted: '#555555',
    accent: '#222831',
    accentHover: '#31363F',
    accentText: '#EEEEEE',
    inputBg: '#F5F5F5',
    isDark: false
  },
  'gaidrid-dark': {
    bg: '#222831',
    card: '#31363F',
    border: 'rgba(238, 238, 238, 0.12)',
    text: '#EEEEEE',
    textMuted: '#B0B0B0',
    accent: '#EEEEEE',
    accentHover: '#FFFFFF',
    accentText: '#222831',
    inputBg: '#222831',
    isDark: true
  },
  'tokyo-night': {
    bg: '#1a1b26',
    card: '#24283b',
    border: 'rgba(169, 177, 214, 0.15)',
    text: '#c0caf5',
    textMuted: '#9aa5ce',
    accent: '#7aa2f7',
    accentHover: '#89ddff',
    accentText: '#1a1b26',
    inputBg: '#16161e',
    isDark: true
  },
  'catppuccin-mocha': {
    bg: '#1e1e2e',
    card: '#181825',
    border: 'rgba(205, 214, 244, 0.15)',
    text: '#cdd6f4',
    textMuted: '#a6adc8',
    accent: '#cba6f7',
    accentHover: '#f5c2e7',
    accentText: '#11111b',
    inputBg: '#11111b',
    isDark: true
  },
  'dracula': {
    bg: '#282a36',
    card: '#21222c',
    border: 'rgba(248, 248, 242, 0.15)',
    text: '#f8f8f2',
    textMuted: '#6272a4',
    accent: '#bd93f9',
    accentHover: '#ff79c6',
    accentText: '#282a36',
    inputBg: '#191a21',
    isDark: true
  },
  'rose-pine': {
    bg: '#191724',
    card: '#1f1d2e',
    border: 'rgba(224, 222, 244, 0.15)',
    text: '#e0def4',
    textMuted: '#908caa',
    accent: '#ebbcba',
    accentHover: '#f6c177',
    accentText: '#191724',
    inputBg: '#12101a',
    isDark: true
  },
  'nord': {
    bg: '#2e3440',
    card: '#3b4252',
    border: 'rgba(216, 222, 233, 0.15)',
    text: '#eceff4',
    textMuted: '#d8dee9',
    accent: '#88c0d0',
    accentHover: '#8fbcbb',
    accentText: '#2e3440',
    inputBg: '#242933',
    isDark: true
  },
  'ayu-mirage': {
    bg: '#1f2430',
    card: '#232834',
    border: 'rgba(204, 202, 194, 0.15)',
    text: '#cccac2',
    textMuted: '#707a8c',
    accent: '#f29718',
    accentHover: '#ffb454',
    accentText: '#1f2430',
    inputBg: '#191e2a',
    isDark: true
  },
  'everforest': {
    bg: '#2d353b',
    card: '#343f44',
    border: 'rgba(211, 198, 170, 0.15)',
    text: '#d3c6aa',
    textMuted: '#859289',
    accent: '#a7c080',
    accentHover: '#83c092',
    accentText: '#2d353b',
    inputBg: '#232a2e',
    isDark: true
  },
  'github-dimmed': {
    bg: '#22272e',
    card: '#2d333b',
    border: 'rgba(173, 186, 199, 0.15)',
    text: '#adbac7',
    textMuted: '#768390',
    accent: '#539bf5',
    accentHover: '#316dca',
    accentText: '#22272e',
    inputBg: '#1c2128',
    isDark: true
  },
  'synthwave-84': {
    bg: '#2b213a',
    card: '#241b2f',
    border: 'rgba(240, 230, 246, 0.15)',
    text: '#f0e6f6',
    textMuted: '#b3a0c9',
    accent: '#f92aad',
    accentHover: '#fe4450',
    accentText: '#ffffff',
    inputBg: '#1d1527',
    isDark: true
  },
  'one-dark-pro': {
    bg: '#282c34',
    card: '#21252b',
    border: 'rgba(171, 178, 191, 0.15)',
    text: '#abb2bf',
    textMuted: '#5c6370',
    accent: '#61afef',
    accentHover: '#abb2bf',
    accentText: '#282c34',
    inputBg: '#1e1f29',
    isDark: true
  }
};

// Map legacy names for fallback safety
THEME_MAP['light'] = THEME_MAP['gaidrid-light'];
THEME_MAP['dark'] = THEME_MAP['gaidrid-dark'];
THEME_MAP['slate'] = THEME_MAP['gaidrid-dark'];
