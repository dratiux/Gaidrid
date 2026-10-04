module.exports = {
  darkMode: 'class',
  content: ['./newtab.html', './offline-game.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Accent-driven: --accent-rgb lives in css/tokens.css (html[data-accent=...])
        'google-blue': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'google-red': '#ea4335',
        'google-yellow': '#fbbc05',
        'google-green': '#34a853',
      },
      boxShadow: {
        soft: '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 15px 0 rgba(0, 0, 0, 0.03)',
        float: '0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.12)',
        pill: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        drawer: '-10px 0 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
