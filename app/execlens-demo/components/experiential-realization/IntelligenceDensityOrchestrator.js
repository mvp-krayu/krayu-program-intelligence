'use strict';

/**
 * IntelligenceDensityOrchestrator.js
 * PI.LENS.EXPERIENTIAL-REALIZATION.EXECUTIVE-SURFACE.01
 *
 * Orchestrates experiential density layout for the executive intelligence surface.
 * Wraps density layout decisions with governance-critical overrides:
 *
 *   - Qualifiers ALWAYS visible regardless of density class
 *   - Q-04 absence notice ALWAYS visible regardless of density class
 *   - Blocked notices ALWAYS visible when renderState = BLOCKED
 *   - Diagnostic notices ALWAYS visible when renderState = DIAGNOSTIC_ONLY
 *   - Evidence references ALWAYS preserved regardless of density class
 *
 * Density manages information hierarchy — never information removal.
 * Governance-critical elements are immune to density management.
 *
 * Pure function. No React. No AI. No external APIs.
 */

// Base section visibility by density class (non-governance-critical sections)
const EXPERIENTIAL_DENSITY_MAP = {
  EXECUTIVE_BALANCED: {
    density_class: 'EXECUTIVE_BALANCED',
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: false,
    show_propagation_posture: true,
    show_evidence_posture: false,
    max_visible_chains: 2,
    max_visible_evidence_links: 0,
    collapsed_by_default: true,
    density_token: 'density-executive-balanced',
    presentation_compatible: true,
  },
  EXECUTIVE_DENSE: {
    density_class: 'EXECUTIVE_DENSE',
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    show_propagation_posture: true,
    show_evidence_posture: true,
    max_visible_chains: 3,
    max_visible_evidence_links: 3,
    collapsed_by_default: false,
    density_token: 'density-executive-dense',
    presentation_compatible: true,
  },
  INVESTIGATION_DENSE: {
    density_class: 'INVESTIGATION_DENSE',
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    show_propagation_posture: true,
    show_evidence_posture: true,
    max_visible_chains: 3,
    max_visible_evidence_links: 3,
    collapsed_by_default: false,
    density_token: 'density-investigation-dense',
    presentation_compatible: false,
  },
};

/**
 * resolveExperientialDensityLayout(densityClass, renderState, adaptedProps)
 *
 * Resolves the full experiential density layout with governance overrides applied.
 * Governance-critical elements are always visible — they cannot be suppressed by density.
 *
 * Parameters:
 *   densityClass  — 'EXECUTIVE_BALANCED' | 'EXECUTIVE_DENSE' | 'INVESTIGATION_DENSE'
 *   renderState   — 'EXECUTIVE_READY' | 'EXECUTIVE_READY_WITH_QUALIFIER' | 'DIAGNOSTIC_ONLY' | 'BLOCKED'
 *   adaptedProps  — { qualifier_class, executive_summary, why_primary_statement, structural_summary, ... }
 */
function resolveExperientialDensityLayout(densityClass, renderState, adaptedProps) {
  const baseEntry = EXPERIENTIAL_DENSITY_MAP[densityClass];
  if (!baseEntry) {
    const fallback = EXPERIENTIAL_DENSITY_MAP['EXECUTIVE_DENSE'];
    return {
      ...applyGovernanceOverrides(fallback, renderState, adaptedProps),
      error: `IDO-01: unknown densityClass — ${String(densityClass)}; defaulting to EXECUTIVE_DENSE`,
    };
  }
  return {
    ...applyGovernanceOverrides(baseEntry, renderState, adaptedProps),
    error: null,
  };
}

function applyGovernanceOverrides(baseEntry, renderState, adaptedProps) {
  const props = adaptedProps || {};

  const is_blocked = renderState === 'BLOCKED';
  const is_diagnostic = renderState === 'DIAGNOSTIC_ONLY';
  const has_qualifier = !!(props.qualifier_class && props.qualifier_class !== 'Q-00');
  const is_q04 = props.qualifier_class === 'Q-04';

  return {
    // Base density layout — blocked state collapses content sections
    density_class: baseEntry.density_class,
    show_executive_summary: !is_blocked && baseEntry.show_executive_summary && !!(props.executive_summary),
    show_why_statement: !is_blocked && baseEntry.show_why_statement && !!(props.why_primary_statement),
    show_structural_findings: !is_blocked && baseEntry.show_structural_findings && !!(props.structural_summary),
    show_propagation_posture: !is_blocked && baseEntry.show_propagation_posture,
    show_evidence_posture: !is_blocked && baseEntry.show_evidence_posture,
    max_visible_chains: baseEntry.max_visible_chains,
    max_visible_evidence_links: baseEntry.max_visible_evidence_links,
    collapsed_by_default: baseEntry.collapsed_by_default,
    density_token: baseEntry.density_token,
    presentation_compatible: baseEntry.presentation_compatible,

    // Governance-critical overrides — immune to density management
    qualifier_notice_visible: has_qualifier && !is_q04,
    q04_absence_notice_visible: is_q04,
    blocked_notice_visible: is_blocked,
    diagnostic_notice_visible: is_diagnostic,
    evidence_references_preserved: true,
  };
}

module.exports = { resolveExperientialDensityLayout, EXPERIENTIAL_DENSITY_MAP };
