// Pre-paint theme restore: parser-blocking, runs before first paint.
// Reads the localStorage mirror written by app.js on every save,
// so the persisted theme applies with zero flash (MV3-safe: external file).
(function () {
  try {
    const raw = localStorage.getItem('gaidrid-prefs-v1');
    if (!raw) {
      // First run: follow the system preference instead of the hardcoded markup default.
      if (window.matchMedia) document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
      return;
    }
    const p = JSON.parse(raw);
    if (p && typeof p.dark === 'boolean' && !p.themeMode) p.themeMode = p.dark ? 'dark' : 'light';
    if (p && p.themeMode) {
      const mode = p.themeMode;
      const dark = mode === 'dark' ? true : mode === 'light' ? false : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', !!dark);
    } else if (p && typeof p.dark === 'boolean') {
      document.documentElement.classList.toggle('dark', p.dark);
    } else if (window.matchMedia) {
      document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  } catch (e) { /* static default theme stands */ }
})();
