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
        float: '0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.12)',
        drawer: '-10px 0 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
