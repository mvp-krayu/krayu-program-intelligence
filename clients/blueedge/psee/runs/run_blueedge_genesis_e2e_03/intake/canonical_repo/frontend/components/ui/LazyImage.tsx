// ── LazyImage — Intersection Observer lazy loading with blur-up ──
import React, { useState, useRef, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

const LazyImage = memo(function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  threshold = 0.1,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-wrapper ${className}`}
      style={{
        width, height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Placeholder shimmer */}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: placeholder
              ? `url(${placeholder}) center/cover`
              : 'linear-gradient(90deg, var(--bg-card) 0%, var(--bg-card-hover) 50%, var(--bg-card) 100%)',
            backgroundSize: placeholder ? undefined : '200% 100%',
            animation: placeholder ? undefined : 'shimmer 1.5s infinite',
            filter: placeholder ? 'blur(10px)' : undefined,
            transform: placeholder ? 'scale(1.1)' : undefined,
          }}
        />
      )}
      {/* Actual image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
});

export default LazyImage;
