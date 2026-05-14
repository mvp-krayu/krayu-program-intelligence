import { useState } from 'react';
import Link from 'next/link';

export default function SQONavigation({ client, runId, activeSection, sections, clientRuns, degradation, onNavigate }) {
  if (!sections || sections.length === 0) return null;

  const [switcherOpen, setSwitcherOpen] = useState(false);

  const degradedSet = new Set((degradation?.degraded_sections) || []);
  const unavailableSet = new Set((degradation?.unavailable_sections) || []);

  const otherRuns = (clientRuns || []).filter(
    cr => !(cr.client === client && cr.run === runId)
  );

  return (
    <nav className="sqo-cockpit-nav">
      <div className="sqo-cockpit-nav__header">
        <span className="sqo-cockpit-nav__title">SQO Cockpit</span>
        <div className="sqo-cockpit-nav__identity">
          <span className="sqo-cockpit-nav__client-label">CLIENT</span>
          <span className="sqo-cockpit-nav__client-value">{client}</span>
          <span className="sqo-cockpit-nav__client-label">RUN</span>
          <span className="sqo-cockpit-nav__run-value">{runId}</span>
        </div>
        {otherRuns.length > 0 && (
          <div className="sqo-cockpit-nav__switcher">
            <button
              className="sqo-cockpit-nav__switcher-toggle"
              onClick={() => setSwitcherOpen(!switcherOpen)}
              type="button"
            >
              Switch client/run {switcherOpen ? '▴' : '▾'}
            </button>
            {switcherOpen && (
              <div className="sqo-cockpit-nav__switcher-list">
                {otherRuns.map(cr => (
                  <Link
                    key={`${cr.client}/${cr.run}`}
                    href={`/sqo/client/${cr.client}/run/${cr.run}`}
                    className="sqo-cockpit-nav__switcher-item"
                  >
                    <span className="sqo-cockpit-nav__switcher-client">{cr.client}</span>
                    <span className="sqo-cockpit-nav__switcher-run">{cr.run}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <ul className="sqo-cockpit-nav__list">
        {sections.map(item => {
          const isDegraded = degradedSet.has(item.section);
          const isUnavailable = unavailableSet.has(item.section);
          const statusClass = isUnavailable ? 'sqo-cockpit-nav__item--unavailable'
            : isDegraded ? 'sqo-cockpit-nav__item--degraded'
            : '';
          const isActive = activeSection ? item.section === activeSection : item.active;
          const activeClass = isActive ? 'sqo-cockpit-nav__item--active' : '';

          if (onNavigate) {
            return (
              <li key={item.section} className={`sqo-cockpit-nav__item ${statusClass} ${activeClass}`}>
                <a
                  href={item.path}
                  onClick={(e) => { e.preventDefault(); onNavigate(item.section); }}
                >
                  <span className="sqo-cockpit-nav__label">{item.label}</span>
                  {isDegraded && <span className="sqo-cockpit-nav__status" title="Partial data available">{'⚠'}</span>}
                  {isUnavailable && <span className="sqo-cockpit-nav__status" title="No data available">{'✕'}</span>}
                </a>
              </li>
            );
          }

          return (
            <li key={item.section} className={`sqo-cockpit-nav__item ${statusClass} ${activeClass}`}>
              <Link href={item.path}>
                <span className="sqo-cockpit-nav__label">{item.label}</span>
                {isDegraded && <span className="sqo-cockpit-nav__status" title="Partial data available">{'⚠'}</span>}
                {isUnavailable && <span className="sqo-cockpit-nav__status" title="No data available">{'✕'}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="sqo-cockpit-nav__governance">
        Read-only artifact consumption · No AI interpretation · Deterministic display
      </div>
    </nav>
  );
}
