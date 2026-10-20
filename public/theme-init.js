// Start every page load in dark mode before React mounts.
document.documentElement.dataset.theme = 'dark';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#202830');
