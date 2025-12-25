import { useState } from 'react';

export function ImageWithFallback({ src, alt, className, fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }) {
  const [error, setError] = useState(false);

  return (
    <img 
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
