import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { galleryPhotos } from '../data/gallery';
import ModalControls from './ModalControls';

export default function Gallery() {
  const rail = useRef(null);
  const dialog = useRef(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState(0);
  const pendingScroll = useRef(null);
  // Rotate existing photos after a full card leaves the viewport. No duplicate slides.
  useLayoutEffect(() => {
    if (pendingScroll.current !== null) {
      rail.current.scrollLeft = pendingScroll.current;
      pendingScroll.current = null;
    }
  }, [offset]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(rail.current);
    return () => { preference.removeEventListener('change', update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (dragging || hovered || focused || reducedMotion || !visible || selected !== null) return;
    let frame;
    let last;
    let position = rail.current.scrollLeft;
    const tick = now => {
      const node = rail.current;
      if (last !== undefined && !document.hidden) {
        const max = node.scrollWidth - node.clientWidth;
        if (max > 0) {
          position += Math.min(now - last, 50) * 0.025;
          const first = node.firstElementChild;
          const second = first?.nextElementSibling;
          const step = second ? second.offsetLeft - first.offsetLeft : 0;
          if (step > 0 && position >= step) {
            const count = Math.min(Math.floor(position / step), galleryPhotos.length - 1);
            pendingScroll.current = position - count * step;
            setOffset(current => (current + count) % galleryPhotos.length);
            return;
          }
          node.scrollLeft = position;
        }
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragging, hovered, focused, reducedMotion, visible, selected, offset]);

  useEffect(() => {
    if (selected !== null && !dialog.current.open) dialog.current.showModal();
    if (selected === null && dialog.current.open) dialog.current.close();
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  const move = amount => {
    rail.current.scrollBy({ left: amount * rail.current.clientWidth * 0.75, behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  const showAdjacent = amount => setSelected(current => (current + amount + galleryPhotos.length) % galleryPhotos.length);
  const active = selected === null ? null : galleryPhotos[selected];

  return <>
    <div ref={rail} className={`gallery-rail${dragging ? ' is-dragging' : ''}`} role="region" aria-label="Selected creations" tabIndex="0"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        suppressClick.current = false;
        drag.current = { id: event.pointerId, x: event.clientX, scroll: rail.current.scrollLeft, moved: false };
      }}
      onPointerMove={event => {
        const gesture = drag.current;
        if (!gesture || gesture.id !== event.pointerId) return;
        const distance = event.clientX - gesture.x;
        if (!gesture.moved && Math.abs(distance) > 6) {
          gesture.moved = true;
          suppressClick.current = true;
          setDragging(true);
          rail.current.setPointerCapture(event.pointerId);
        }
        if (gesture.moved) {
          event.preventDefault();
          const node = rail.current;
          const first = node.firstElementChild;
          const second = first?.nextElementSibling;
          const step = second ? second.offsetLeft - first.offsetLeft : 0;
          let position = gesture.scroll - distance;
          if (step > 0) {
            const count = Math.floor(position / step);
            if (count !== 0) {
              position -= count * step;
              // Keep the original pointer anchor aligned with the reordered strip.
              gesture.scroll -= count * step;
              if (count % galleryPhotos.length !== 0) {
                pendingScroll.current = position;
                setOffset(current => ((current + count) % galleryPhotos.length + galleryPhotos.length) % galleryPhotos.length);
                return;
              }
            }
          }
          node.scrollLeft = position;
        }
      }}
      onPointerUp={() => { drag.current = null; setDragging(false); }}
      onPointerCancel={() => { drag.current = null; setDragging(false); suppressClick.current = false; }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onClickCapture={event => {
        if (suppressClick.current && event.detail > 0) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onKeyDown={event => { if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      {galleryPhotos.map((_, slot) => {
        const index = (slot + offset) % galleryPhotos.length;
        const photo = galleryPhotos[index];
        return <button className="gallery-photo" type="button" key={photo.image} onClick={() => setSelected(index)} aria-label={`Enlarge photo ${index + 1}: ${photo.alt}`} aria-haspopup="dialog">
        <img draggable="false" src={`/images/${photo.image}-480.webp`} srcSet={`/images/${photo.image}-480.webp 480w, /images/${photo.image}-960.webp 960w, /images/${photo.image}-1440.webp 1440w`} sizes="(max-width: 600px) 78vw, (max-width: 800px) 340px, 22.5vw" width="480" height="720" alt={photo.alt} loading="lazy" decoding="async"/>
      </button>; })}
    </div>
    <dialog ref={dialog} className="gallery-dialog" aria-labelledby="photo-title" aria-describedby="photo-caption"
      onCancel={() => setSelected(null)} onClose={() => setSelected(null)}
      onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showAdjacent(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      <div className="lightbox-content">
        <h3 id="photo-title" className="sr-only">Gallery photograph</h3>
        <div className="modal-image-stage gallery-image-stage">
          <ModalControls onClose={() => setSelected(null)} onPrevious={() => showAdjacent(-1)} onNext={() => showAdjacent(1)} previousLabel="Previous photograph" nextLabel="Next photograph"/>
          {active && <img className="lightbox-image" src={`/images/${active.image}-1440.webp`} alt={active.alt}/>}
        </div>
        <div className="photo-caption-area"><p id="photo-caption">{active?.alt}</p></div>
      </div>
    </dialog>
  </>;
}
