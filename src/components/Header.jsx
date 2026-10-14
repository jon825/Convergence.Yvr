import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '../data/content';
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const header = useRef(null);
  useEffect(() => {
    function escape(event) { if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); } }
    function outside(event) { if (!header.current?.contains(event.target)) setOpen(false); }
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header className="site-header" ref={header}><a className="wordmark" href="#home" aria-label="Convergence home"><img src="/images/convergence-logo.png" width="450" height="142" alt="Convergence"/><span>CUISINE & MIXOLOGY</span></a>
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="m6 6 12 12M6 18 18 6"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
    </svg></button>
    <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>
  </header>;
}
