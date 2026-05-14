'use strict';

/**
 * NarrativeDensityController.js
 * PI.LENS.NEXTGEN-REPORTS.EXECUTIVE-NARRATIVE-RENDERING.01
 *
 * Resolves narrative density layout for a given density class and narrative props.
 * Density is managed through hierarchy, not through information removal (NORM-DENSITY-01).
 *
 * Evidence references are always preserved — density only affects display priority.
 *
 * Pure function. No React. No AI. No external APIs.
 */

const { mapNarrativeDensity } = require('./NarrativeSemanticMapper');

/**
 * resolveDensityLayout(densityClass, narrativeProps)
 *
 * Resolves which narrative sections are visible at a given density class.
 * evidence_references_preserved is always true (NORM-DENSITY-01 principle).
 *
 * Parameters:
 *   densityClass    — 'EXECUTIVE_DENSE' | 'EXECUTIVE_BALANCED' | 'INVESTIGATION_DENSE'
 *   narrativeProps  — output from NarrativeAdapter (executive_summary, why_primary_statement, structural_summary)
 *
 * Returns:
 * {
 *   density_class: string,
 *   show_executive_summary: boolean,
 *   show_why_statement: boolean,
 *   show_structural_findings: boolean,
 *   max_primary_findings: number,
 *   why_default_expanded: boolean,
 *   evidence_references_preserved: true,   — always true; density never removes evidence
 *   has_executive_summary: boolean,
 *   has_why_statement: boolean,
 *   has_structural_findings: boolean,
 *   error: null | string,
 * }
 */
function resolveDensityLayout(densityClass, narrativeProps) {
  const density = mapNarrativeDensity(densityClass);

  const has_executive_summary = !!(narrativeProps && narrativeProps.executive_summary);
  const has_why_statement = !!(narrativeProps && narrativeProps.why_primary_statement);
  const has_structural_findings = !!(narrativeProps && narrativeProps.structural_summary);

  return {
    density_class: density.density_class,
    show_executive_summary: density.show_executive_summary && has_executive_summary,
    show_why_statement: density.show_why_statement && has_why_statement,
    show_structural_findings: density.show_structural_findings && has_structural_findings,
    max_primary_findings: density.max_primary_findings,
    why_default_expanded: density.why_default_expanded,
    evidence_references_preserved: true,
    has_executive_summary,
    has_why_statement,
    has_structural_findings,
    error: density.error || null,
  };
}

module.exports = { resolveDensityLayout };
