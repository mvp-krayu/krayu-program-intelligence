// Extracted from dashboard.html — OnboardingTour
// Line 5793 | 35 lines

import React, { useState } from 'react';
import { useI18n } from '@/hooks';
import { TOUR_STEPS } from '@/constants';

export default function OnboardingTour({ open, onClose }: any) {
  const [step, setStep] = useState(0);
  const { t } = useI18n();

  if (!open) return null;
  const s = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  const cardStyle = s.position === 'center'
    ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
    : { top: s.top || 100, ...(s.left ? { left: s.left } : {}), ...(s.right ? { right: s.right } : {}) };

  return (
    <>
      <div className="tour-overlay" />
      <div className="tour-card" style={cardStyle}>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
        <div className="tour-steps">
          {TOUR_STEPS.map((_, i) => <div key={i} className={`tour-step-dot ${i === step ? 'active' : ''}`} />)}
        </div>
        <div className="tour-footer">
          <button className="tour-skip" onClick={onClose}>{isLast ? '' : 'Skip tour'}</button>
          <div style={{display:'flex',gap:6}}>
            {!isFirst && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
            <button className="btn btn-cyan" onClick={() => isLast ? onClose() : setStep(step + 1)}>
              {isLast ? '✓ Get Started' : `Next (${step + 1}/${TOUR_STEPS.length})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
