// ScrollToTop — floating button that appears on scroll
// Session 26: mobile UX polish

import React from 'react';
import { useScrollPosition, useReducedMotion } from '@/hooks';

export default function ScrollToTop() {
  const { scrolled } = useScrollPosition(400);
  const reducedMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  if (!scrolled) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
