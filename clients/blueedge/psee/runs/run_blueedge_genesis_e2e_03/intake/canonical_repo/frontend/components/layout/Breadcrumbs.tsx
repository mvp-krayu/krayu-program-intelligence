// Extracted from dashboard.html — Breadcrumbs
// Line 5627 | 15 lines

import React, { Fragment } from 'react';
import { PAGE_BREADCRUMBS } from '@/constants';

export default function Breadcrumbs({ page, onNavigate }: any) {
  const crumbs = PAGE_BREADCRUMBS[page] || ['Home'];
  return (
    <nav className="breadcrumb-nav">
      <button className="breadcrumb-link" onClick={() => onNavigate('overview')}>🏠 Home</button>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          <span className="breadcrumb-sep">›</span>
          {i < crumbs.length - 1 ? <span className="breadcrumb-current" style={{opacity:0.6}}>{c}</span> :
           <span className="breadcrumb-current">{c}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
