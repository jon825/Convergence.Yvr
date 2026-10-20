import React from 'react';

export default function ModalControls({ onClose, onPrevious, onNext, previousLabel, nextLabel }) {
  return <>
    <button type="button" className="modal-overlay-button modal-close" aria-label="Close viewer" autoFocus onClick={onClose}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>
    </button>
    <button type="button" className="modal-overlay-button modal-previous" aria-label={previousLabel} onClick={onPrevious}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>
    </button>
    <button type="button" className="modal-overlay-button modal-next" aria-label={nextLabel} onClick={onNext}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>
    </button>
  </>;
}
