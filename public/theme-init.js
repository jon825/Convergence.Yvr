// Apply the saved choice before React mounts, avoiding a flash of the wrong theme.
(() => {
  let theme = 'dark';
  try {
    if (localStorage.getItem('convergence-theme') === 'light') theme = 'light';
  } catch { /* Keep the default when browser storage is unavailable. */ }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f1e9' : '#202830');
})();
