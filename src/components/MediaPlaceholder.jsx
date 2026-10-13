import React from 'react';
export default function MediaPlaceholder({ label, variant = '', className = '' }) {
  return <div className={`media-placeholder ${variant} ${className}`} role="img" aria-label={`${label} — original Convergence photography to be added`}>
    <div className="composition" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="composition-line"/></div>
    <span className="media-label">{label}<small>Original photography coming soon</small></span>
  </div>;
}
