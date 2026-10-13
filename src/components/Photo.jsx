import React from 'react';

export default function Photo({ image, alt, variant = '', priority = false, className = '' }) {
  return (
    <div className={`photo ${variant} ${className}`}>
      <img
        src={`/images/${image}-960.webp`}
        srcSet={[480, 960, 1440].map(width => `/images/${image}-${width}.webp ${width}w`).join(', ')}
        sizes={variant === 'story-photo' ? '(max-width: 800px) 88vw, 42vw' : '(max-width: 800px) 88vw, 45vw'}
        width="960"
        height={image === 'food-and-drink' ? '1407' : '1440'}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </div>
  );
}
