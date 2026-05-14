'use client';

import React from 'react';

/**
 * ReportModuleShell
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 * PI.LENS.V2.NEXTGEN-REPORTS.RECONCILIATION-INTEGRATION.01
 *
 * Executive report module shell. Provides named slots for downstream
 * visual surface contracts plus reconciliation-aware sections.
 *
 * Downstream contracts that populate these slots:
 *   SLOT readiness-badge   → PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *   SLOT executive-narrative → PI.LENS.NEXTGEN-REPORTS.EXECUTIVE-NARRATIVE-RENDERING.01
 *   SLOT propagation-explainability → PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01
 *
 * Reconciliation-aware sections (populated from reportBinding):
 *   - Executive disclosure
 *   - Qualification posture
 *   - Reconciliation posture
 *   - Semantic debt
 *   - Structural backing matrix
 *   - Temporal narrative
 *   - Unresolved-domain disclosure
 *   - Trust posture
 *   - Propagation readiness
 *   - Evidence integrity
 */

const TRUST_COLORS = {
  AUTHORITY: '#64ffda',
  STRONG: '#4a9eff',
  PARTIAL: '#ffd700',
  HYDRATED: '#ff9e4a',
  NONE: '#ff6b6b',
};

function ExecutiveDisclosureSection({ disclosure }) {
  if (!disclosure) return null;
  if (!disclosure.disclosure_required && disclosure.available) return null;

  return (
    <div data-section="executive-disclosure" className="rms-section rms-disclosure">
      <div className="rms-section-header">EXECUTIVE DISCLOSURE</div>
      {!disclosure.available && (
        <div className="rms-disclosure-unavailable">
          Qualification substrate unavailable — report rendered without SQO posture data
        </div>
      )}
      {disclosure.disclosure_items && disclosure.disclosure_items.length > 0 && (
        <ul className="rms-disclosure-list">
          {disclosure.disclosure_items.map((item, i) => (
            <li key={i} className="rms-disclosure-item">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QualificationSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="qualification-posture" className="rms-section">
      <div className="rms-section-header">QUALIFICATION POSTURE</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">TRUST</span>
          <span className="rms-value" style={{ color: data.trust_color || TRUST_COLORS[data.trust_level] || '#ccd6f6' }}>
            {data.trust_label || data.trust_level}
          </span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">S-STATE</span>
          <span className="rms-value">{data.s_state}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">Q-CLASS</span>
          <span className="rms-value">{data.q_class}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">GROUNDING</span>
          <span className="rms-value">{data.grounding_pct}%</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">MATURITY</span>
          <span className="rms-value">{data.maturity_classification} ({data.maturity_score})</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">GRAVITY</span>
          <span className="rms-value">{data.gravity_classification} ({data.gravity_score})</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">STABILITY</span>
          <span className="rms-value">{data.stability_classification} ({data.stability_score})</span>
        </div>
        {data.progression_readiness !== undefined && (
          <div className="rms-kv">
            <span className="rms-key">PROGRESSION</span>
            <span className="rms-value">
              {data.progression_readiness ? 'READY' : 'NOT READY'}
              {data.progression_target ? ` → ${data.progression_target}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ReconciliationSection({ data }) {
  if (!data) return null;
  const ratioColor = data.reconciliation_pct >= 80 ? '#64ffda'
    : data.reconciliation_pct >= 50 ? '#ffd700' : '#ff6b6b';
  return (
    <div data-section="reconciliation-posture" className="rms-section">
      <div className="rms-section-header">RECONCILIATION POSTURE</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">DOMAINS</span>
          <span className="rms-value">{data.reconciled}/{data.total_domains} reconciled</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">RATIO</span>
          <span className="rms-value" style={{ color: ratioColor }}>{data.reconciliation_pct}%</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">CONFIDENCE</span>
          <span className="rms-value">{data.weighted_confidence}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">TREND</span>
          <span className="rms-value">{data.trend}</span>
        </div>
        {data.unresolved_count > 0 && (
          <div className="rms-kv">
            <span className="rms-key">UNRESOLVED</span>
            <span className="rms-value rms-warn">{data.unresolved_count}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SemanticDebtSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="semantic-debt" className="rms-section">
      <div className="rms-section-header">SEMANTIC DEBT</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">TOTAL</span>
          <span className="rms-value">{data.total_items} items</span>
        </div>
        {data.has_blocking_debt && (
          <div className="rms-kv">
            <span className="rms-key">BLOCKING</span>
            <span className="rms-value rms-alert">{data.blocking_count}</span>
          </div>
        )}
        <div className="rms-kv">
          <span className="rms-key">DEBT SCORE</span>
          <span className="rms-value">{data.weighted_debt_score}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">EXPOSURE</span>
          <span className="rms-value" style={{ color: data.exposure_color || '#ccd6f6' }}>
            {data.operational_exposure}
          </span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">QUAL IMPACT</span>
          <span className="rms-value">{data.qualification_impact}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">REDUCIBLE</span>
          <span className="rms-value">{data.reducible_count} / {data.irreducible_count} irreducible</span>
        </div>
      </div>
    </div>
  );
}

function StructuralBackingSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="structural-backing" className="rms-section">
      <div className="rms-section-header">STRUCTURAL BACKING MATRIX</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">DOMAINS</span>
          <span className="rms-value">{data.reconciled}/{data.total_domains}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">RECONCILED</span>
          <span className="rms-value">{data.reconciliation_pct}%</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">CONFIDENCE</span>
          <span className="rms-value">{data.weighted_confidence}</span>
        </div>
      </div>
      {data.unresolved_domains && data.unresolved_domains.length > 0 && (
        <div className="rms-unresolved-matrix">
          <div className="rms-sub-header">UNRESOLVED DOMAINS</div>
          {data.unresolved_domains.map((d, i) => (
            <div key={i} className="rms-unresolved-domain">{typeof d === 'string' ? d : d.domain || d.id}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function TemporalNarrativeSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="temporal-narrative" className="rms-section">
      <div className="rms-section-header">TEMPORAL RECONCILIATION NARRATIVE</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">TREND</span>
          <span className="rms-value" style={{ color: data.trend_color || '#ccd6f6' }}>{data.trend}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">ENRICHMENT</span>
          <span className="rms-value">{data.enrichment_grade} (+{data.enrichment_lift_pct}%)</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">DEBT REDUCTION</span>
          <span className="rms-value">{data.debt_reduction_pct}%</span>
        </div>
        {data.persistent_unresolved > 0 && (
          <div className="rms-kv">
            <span className="rms-key">PERSISTENT</span>
            <span className="rms-value rms-warn">{data.persistent_unresolved} unresolved</span>
          </div>
        )}
        {data.degradation_detected && (
          <div className="rms-kv">
            <span className="rms-key">DEGRADATION</span>
            <span className="rms-value rms-alert">DETECTED</span>
          </div>
        )}
      </div>
    </div>
  );
}

function UnresolvedDisclosureSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="unresolved-disclosure" className="rms-section rms-disclosure">
      <div className="rms-section-header">UNRESOLVED-DOMAIN DISCLOSURE</div>
      <div className="rms-disclosure-count">{data.unresolved_count} domain{data.unresolved_count !== 1 ? 's' : ''} unresolved</div>
      {data.unresolved_domains && data.unresolved_domains.length > 0 && (
        <ul className="rms-disclosure-list">
          {data.unresolved_domains.map((d, i) => (
            <li key={i} className="rms-disclosure-item">
              {typeof d === 'string' ? d : d.domain || d.id || JSON.stringify(d)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrustPostureSection({ data }) {
  if (!data) return null;
  const color = TRUST_COLORS[data.level] || '#ccd6f6';
  return (
    <div data-section="trust-posture" className="rms-section">
      <div className="rms-section-header">TRUST POSTURE</div>
      <div className="rms-trust-badge" style={{ borderColor: color }}>
        <span className="rms-trust-level" style={{ color }}>{data.label || data.level}</span>
        {data.tier_level !== undefined && (
          <span className="rms-trust-tier">TIER {data.tier_level}</span>
        )}
      </div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">S-STATE</span>
          <span className="rms-value">{data.s_state}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">Q-CLASS</span>
          <span className="rms-value">{data.q_class}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">GROUNDING</span>
          <span className="rms-value">{data.grounding_pct}%</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">MATURITY</span>
          <span className="rms-value">{data.maturity_classification}</span>
        </div>
      </div>
    </div>
  );
}

function PropagationSection({ data }) {
  if (!data) return null;
  return (
    <div data-section="propagation-readiness" className="rms-section">
      <div className="rms-section-header">PROPAGATION READINESS</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">READY</span>
          <span className="rms-value" style={{ color: data.ready ? '#64ffda' : '#ff6b6b' }}>
            {data.ready ? 'YES' : 'NO'}
          </span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">GATES</span>
          <span className="rms-value">{data.gates_met}/{data.gate_count} met</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">READINESS</span>
          <span className="rms-value" style={{ color: data.gate_color || '#ccd6f6' }}>{data.readiness_pct}%</span>
        </div>
      </div>
      {data.blocking_gates && data.blocking_gates.length > 0 && (
        <div className="rms-blocking-gates">
          <div className="rms-sub-header">BLOCKING GATES</div>
          {data.blocking_gates.map((g, i) => (
            <span key={i} className="rms-gate-chip rms-gate-blocked">{typeof g === 'string' ? g : g.gate || g.id}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceIntegritySection({ data }) {
  if (!data) return null;
  return (
    <div data-section="evidence-integrity" className="rms-section">
      <div className="rms-section-header">EVIDENCE INTEGRITY</div>
      <div className="rms-kv-grid">
        <div className="rms-kv">
          <span className="rms-key">TOTAL</span>
          <span className="rms-value">{data.total_items}</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">ACCEPTED</span>
          <span className="rms-value" style={{ color: '#64ffda' }}>{data.accepted}</span>
        </div>
        {data.rejected > 0 && (
          <div className="rms-kv">
            <span className="rms-key">REJECTED</span>
            <span className="rms-value rms-alert">{data.rejected}</span>
          </div>
        )}
        {data.quarantined > 0 && (
          <div className="rms-kv">
            <span className="rms-key">QUARANTINED</span>
            <span className="rms-value rms-warn">{data.quarantined}</span>
          </div>
        )}
        <div className="rms-kv">
          <span className="rms-key">COVERAGE</span>
          <span className="rms-value">{data.covered_domains} domains</span>
        </div>
        <div className="rms-kv">
          <span className="rms-key">INTEGRITY</span>
          <span className="rms-value" style={{ color: data.integrity_color || (data.all_valid ? '#64ffda' : '#ff6b6b') }}>
            {data.all_valid ? 'VALID' : 'ISSUES DETECTED'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReconciliationAwareSections({ reportBinding }) {
  if (!reportBinding || !reportBinding.available) return null;
  const s = reportBinding.sections;
  if (!s) return null;

  return (
    <div data-region="reconciliation-awareness" className="rms-reconciliation-region">
      <ExecutiveDisclosureSection disclosure={reportBinding.executiveDisclosure} />
      <TrustPostureSection data={s.trustPosture} />
      <QualificationSection data={s.qualification} />
      <ReconciliationSection data={s.reconciliation} />
      <SemanticDebtSection data={s.debt} />
      <StructuralBackingSection data={s.structuralBacking} />
      <TemporalNarrativeSection data={s.temporalNarrative} />
      <UnresolvedDisclosureSection data={s.unresolvedDisclosure} />
      <PropagationSection data={s.propagation} />
      <EvidenceIntegritySection data={s.evidenceIntegrity} />
    </div>
  );
}

export default function ReportModuleShell({ adaptedProps, reportBinding }) {
  const renderState = adaptedProps?.renderState;
  const surfaceMode = adaptedProps?.surfaceMode;
  const hasReconciliation = reportBinding && reportBinding.available;

  return (
    <div
      data-module="report-module-shell"
      data-render-state={renderState}
      data-surface-mode={surfaceMode}
      data-reconciliation-aware={hasReconciliation ? 'true' : 'false'}
    >
      <div
        data-slot="readiness-badge"
        data-status="PENDING_CONTRACT"
        data-contract="PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01"
      />

      <div
        data-slot="executive-narrative"
        data-status="PENDING_CONTRACT"
        data-contract="PI.LENS.NEXTGEN-REPORTS.EXECUTIVE-NARRATIVE-RENDERING.01"
      />

      {hasReconciliation && (
        <ReconciliationAwareSections reportBinding={reportBinding} />
      )}

      {!hasReconciliation && reportBinding && !reportBinding.available && (
        <ExecutiveDisclosureSection disclosure={reportBinding.executiveDisclosure} />
      )}

      <div
        data-slot="propagation-explainability"
        data-status="PENDING_CONTRACT"
        data-contract="PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01"
      />
    </div>
  );
}
