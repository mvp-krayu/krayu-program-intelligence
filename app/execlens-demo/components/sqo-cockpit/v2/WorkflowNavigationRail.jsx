import { useState } from 'react';

export default function WorkflowNavigationRail({
  client, runId, activeSection, navigationItems, clientRuns,
  role, roleLabel, onNavigate, onRoleChange,
}) {
  const [forensicExpanded, setForensicExpanded] = useState(false);
  const [runSwitcherOpen, setRunSwitcherOpen] = useState(false);

  if (!navigationItems) return null;

  const { tier1, tier2, tier3 } = navigationItems;
  const availableTier2 = tier2.filter(item => item.available);
  const availableTier3 = tier3.filter(item => item.available);
  const otherRuns = (clientRuns || []).filter(r => r.run !== runId);

  function handleNavClick(e, section) {
    e.preventDefault();
    if (onNavigate) onNavigate(section);
  }

  return (
    <nav className="sqo-v2-nav-rail">
      {/* Header: Client/Run Identity */}
      <div className="sqo-v2-nav-rail__header">
        <span className="sqo-v2-nav-rail__client">{client}</span>
        <button
          className="sqo-v2-nav-rail__run-toggle"
          onClick={() => setRunSwitcherOpen(!runSwitcherOpen)}
          type="button"
        >
          {runId}
        </button>
        {runSwitcherOpen && otherRuns.length > 0 && (
          <div className="sqo-v2-nav-rail__run-list">
            {otherRuns.map(r => (
              <a
                key={r.run}
                href={`/sqo/client/${r.client}/run/${r.run}/v2`}
                className="sqo-v2-nav-rail__run-item"
              >
                {r.run}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Role Indicator */}
      <div className="sqo-v2-nav-rail__role">
        <span className="sqo-v2-nav-rail__role-label">{roleLabel || role}</span>
        {onRoleChange && (
          <button className="sqo-v2-nav-rail__role-change" onClick={onRoleChange} type="button">
            Change
          </button>
        )}
      </div>

      {/* Tier 1: Operational Spine */}
      <div className="sqo-v2-nav-rail__tier sqo-v2-nav-rail__tier--1">
        <span className="sqo-v2-nav-rail__tier-label">Operational Spine</span>
        {tier1.map(item => (
          <a
            key={item.section}
            href={item.path}
            className={`sqo-v2-nav-rail__item sqo-v2-nav-rail__item--tier1 ${item.active ? 'sqo-v2-nav-rail__item--active' : ''}`}
            onClick={(e) => handleNavClick(e, item.section)}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Tier 2: Qualification Detail */}
      {availableTier2.length > 0 && (
        <div className="sqo-v2-nav-rail__tier sqo-v2-nav-rail__tier--2">
          <span className="sqo-v2-nav-rail__tier-label">Qualification Detail</span>
          {availableTier2.map(item => (
            <a
              key={item.section}
              href={item.path}
              className={`sqo-v2-nav-rail__item sqo-v2-nav-rail__item--tier2 ${item.active ? 'sqo-v2-nav-rail__item--active' : ''}`}
              onClick={(e) => handleNavClick(e, item.section)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Tier 3: Forensic Investigation */}
      {availableTier3.length > 0 && (
        <div className="sqo-v2-nav-rail__tier sqo-v2-nav-rail__tier--3">
          <button
            className={`sqo-v2-nav-rail__tier-toggle ${forensicExpanded ? 'sqo-v2-nav-rail__tier-toggle--expanded' : ''}`}
            onClick={() => setForensicExpanded(!forensicExpanded)}
            type="button"
          >
            Forensic Investigation {forensicExpanded ? '▾' : '▸'}
          </button>
          {forensicExpanded && availableTier3.map(item => (
            <a
              key={item.section}
              href={item.path}
              className={`sqo-v2-nav-rail__item sqo-v2-nav-rail__item--tier3 ${item.active ? 'sqo-v2-nav-rail__item--active' : ''}`}
              onClick={(e) => handleNavClick(e, item.section)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Governance Footer */}
      <div className="sqo-v2-nav-rail__governance">
        SQO Cockpit V2 — Governed Qualification Operating System
      </div>
    </nav>
  );
}
