import React from 'react';

function ThemeIcon({ moon = false }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {moon ? <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/> : <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></>}
  </svg>;
}

export default function ThemeToggle({ theme, onChange }) {
  const dark = theme === 'dark';
  return <button type="button" className="theme-switch" role="switch" aria-label="Dark mode" aria-checked={dark} title={`Switch to ${dark ? 'light' : 'dark'} mode`} onClick={() => onChange(dark ? 'light' : 'dark')}>
    <span className="theme-switch-track" aria-hidden="true">
      <span className="theme-switch-sun"><ThemeIcon/></span>
      <span className="theme-switch-moon"><ThemeIcon moon/></span>
      <span className="theme-switch-thumb"><ThemeIcon moon={dark}/></span>
    </span>
  </button>;
}
