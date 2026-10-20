import React, { useRef, useState, useEffect } from 'react';
import ModalControls from './ModalControls';
const pages = [
  ['food-introduction', 'Food menu introduction'], ['appetizers', 'Appetizers'],
  ['pasta', 'Pasta'], ['entrees', 'Entrées'], ['desserts', 'Desserts'],
  ['drinks-introduction', 'Drink menu introduction'], ['cocktails', 'Cocktails'], ['classics', 'Classic cocktails'],
];
export default function Menu() {
  const dialog = useRef(null);
  const touch = useRef(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const move = delta => setIndex(current => (current + delta + pages.length) % pages.length);
  useEffect(() => {
    if (!open) { dialog.current.close(); return; }
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <section id="menu" className="section menu-section" aria-labelledby="menu-heading">
    <p className="eyebrow">03 / Menu</p><h2 id="menu-heading">A meeting of<br/><em>flavours.</em></h2>
    <p className="lead">Explore our current food and drink menus.</p>
    <button className="outline-button" onClick={() => { setIndex(0); setOpen(true); }} aria-haspopup="dialog">VIEW THE MENU</button>
    <dialog ref={dialog} className="menu-dialog" aria-labelledby="menu-dialog-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
      onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}
      onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      <div className="menu-viewer"><h3 className="menu-viewer-title" id="menu-dialog-title">{pages[index][1].toUpperCase()} <span className="menu-count" aria-live="polite">{index + 1} / {pages.length}</span></h3>
        <div className="modal-image-stage menu-image-stage">
        <ModalControls onClose={() => setOpen(false)} onPrevious={() => move(-1)} onNext={() => move(1)} previousLabel="Previous menu page" nextLabel="Next menu page"/>
        <img className="menu-page" src={`/menus/${pages[index][0]}.webp`} alt={pages[index][1]} width="1545" height="2000"
          onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={event => { if (!touch.current) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); touch.current = null; }}/>
        </div>
      </div>
    </dialog>
  </section>;
}
