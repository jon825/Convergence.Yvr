import React from 'react';

export default function ThemeToggle({ theme, onChange }) {
  return <div className="theme-toggle" role="group" aria-label="Colour theme">
    {['light', 'dark'].map(choice => <button type="button" key={choice} aria-pressed={theme === choice} onClick={() => onChange(choice)}>{choice === 'light' ? 'Light' : 'Dark'}</button>)}
  </div>;
}
