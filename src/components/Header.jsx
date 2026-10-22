import React, { useEffect, useRef, useState } from 'react';
import { navigation, contact } from '../data/content';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';

export default function Header({ theme, onThemeChange }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);

  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (viewport.matches) setOpen(false); };
    viewport.addEventListener('change', closeOnDesktop);
    return () => viewport.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) { dialog.current.close(); return; }
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Convergence home"><BrandLogo/></a>
    <div className="desktop-header-actions">
      <nav className="navigation" aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <ThemeToggle theme={theme} onChange={onThemeChange}/>
    </div>
    <button type="button" className="menu-toggle" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-navigation" aria-labelledby="mobile-navigation-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const controls = [...event.currentTarget.querySelectorAll('a[href], button:not([disabled])')];
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      <div className="mobile-menu-content">
        <h2 id="mobile-navigation-title" className="sr-only">Explore Convergence</h2>
        <div className="mobile-menu-top">
          <a className="wordmark" href="#home" aria-label="Convergence home" onClick={() => setOpen(false)}><BrandLogo/></a>
          <button type="button" className="mobile-menu-close" autoFocus aria-label="Close navigation menu" onClick={() => setOpen(false)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>
          </button>
        </div>
        <nav className="mobile-menu-links" aria-label="Mobile navigation">{navigation.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
        <div className="mobile-menu-bottom">
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Convergence on Instagram (opens in a new tab)"><svg className="mobile-instagram-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></a>
          <ThemeToggle theme={theme} onChange={onThemeChange}/>
        </div>
      </div>
    </dialog>
  </header>;
}
