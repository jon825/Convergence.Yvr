import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f1e9' : '#202830');
    try { localStorage.setItem('convergence-theme', theme); } catch { /* Theme still works without storage. */ }
  }, [theme]);
  return [theme, setTheme];
}
