import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f1e9' : '#202830');
  }, [theme]);
  useEffect(() => {
    // A browser Back/Forward cache restore is also a fresh visit.
    const resetOnReturn = event => { if (event.persisted) setTheme('dark'); };
    window.addEventListener('pageshow', resetOnReturn);
    return () => window.removeEventListener('pageshow', resetOnReturn);
  }, []);
  return [theme, setTheme];
}
