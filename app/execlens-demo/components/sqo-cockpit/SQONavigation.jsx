import Link from 'next/link';

export default function SQONavigation({ client, runId, activeSection, sections, degradation }) {
  if (!sections || sections.length === 0) return null;

  const degradedSet = new Set((degradation?.degraded_sections) || []);
  const unavailableSet = new Set((degradation?.unavailable_sections) || []);

  return (
    <nav className="sqo-cockpit-nav">
      <div className="sqo-cockpit-nav__header">
        <span className="sqo-cockpit-nav__title">SQO Cockpit</span>
        <span className="sqo-cockpit-nav__client">{client} / {runId}</span>
      </div>
      <ul className="sqo-cockpit-nav__list">
        {sections.map(item => {
          const isDegraded = degradedSet.has(item.section);
          const isUnavailable = unavailableSet.has(item.section);
          const statusClass = isUnavailable ? 'sqo-cockpit-nav__item--unavailable'
            : isDegraded ? 'sqo-cockpit-nav__item--degraded'
            : '';
          const activeClass = item.active ? 'sqo-cockpit-nav__item--active' : '';

          return (
            <li key={item.section} className={`sqo-cockpit-nav__item ${statusClass} ${activeClass}`}>
              <Link href={item.path}>
                <span className="sqo-cockpit-nav__label">{item.label}</span>
                {isDegraded && <span className="sqo-cockpit-nav__status" title="Partial data available">⚠</span>}
                {isUnavailable && <span className="sqo-cockpit-nav__status" title="No data available">✕</span>}
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
