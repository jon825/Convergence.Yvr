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
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>
  </header>;
}
