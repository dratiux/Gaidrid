// Pre-paint theme + accent restore: parser-blocking, runs before first paint.
// Reads the localStorage mirror written by app.js on every save,
// so the persisted theme applies with zero flash (MV3-safe: external file).
(function () {
  // Night window: true when now is inside [start, end) (wraps past midnight).
  // Mirrors nightNow() in app.js (separate file, no imports).
  function nightNow(s, e) {
    if (!s || !e) return false;
    var cur = new Date().getHours() * 60 + new Date().getMinutes();
    function t(x) { var p = String(x).split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); }
    var a = t(s), b = t(e);
    return a <= b ? (cur >= a && cur < b) : (cur >= a || cur < b);
  }
  try {
    var raw = localStorage.getItem('gaidrid-prefs-v1');
    var p = raw ? JSON.parse(raw) : null;
    if (p && typeof p === 'object' && p.accent) {
      document.documentElement.setAttribute('data-accent', String(p.accent));
    }
    if (!p) {
      // First run: follow the system preference instead of the hardcoded markup default.
      if (window.matchMedia) document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
      return;
    }
    if (p && typeof p.dark === 'boolean' && !p.themeMode) p.themeMode = p.dark ? 'dark' : 'light';
    var dark;
    if (p && p.themeMode) {
      var mode = p.themeMode;
      dark = mode === 'dark' ? true : mode === 'light' ? false : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (mode === 'auto' && p.autoNight && nightNow(p.autoNightStart, p.autoNightEnd)) dark = true;
    } else if (p && typeof p.dark === 'boolean') {
      dark = !!p.dark;
    } else {
      dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    document.documentElement.classList.toggle('dark', !!dark);
  } catch (e) { /* static default theme stands */ }
})();
