(function () {
  function sync() {
    document.documentElement.classList.toggle('gaidrid-dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  sync();
  if (window.top === window) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
  }
})();
