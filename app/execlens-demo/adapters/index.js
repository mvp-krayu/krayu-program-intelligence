'use strict';

/**
 * adapters/index.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * LENS Rendering Adapter Pipeline — main entry point.
 *
 * Trust boundary enforcement:
 *   1. Validation layer runs first (validation/index.js)
 *   2. If BLOCKED → BlockedStateAdapter only; no other adapters run
 *   3. If DIAGNOSTIC_ONLY → DiagnosticStateAdapter + limited panel adapters
 *   4. If EXECUTIVE_READY / EXECUTIVE_READY_WITH_QUALIFIER → full adapter chain
 *
 * All adapters are pure functions. No mutations. No AI calls. No external APIs.
 *
 * Usage:
 *   const { adaptReport } = require('./adapters');
 *   const result = adaptReport(reportObject, 'EXECUTIVE');
 *   // result.renderState: 'BLOCKED' | 'DIAGNOSTIC_ONLY' | 'EXECUTIVE_READY' | ...
 */

const { validateReportObjectPipeline } = require('../validation/index');
const { makeAdapterError } = require('./AdapterErrorTaxonomy');
const { resolveSurfaceMode, resolveDensityClass } = require('./SurfaceModeResolver');
const { adaptReadinessBadge } = require('./ReadinessBadgeAdapter');
const { adaptQualifierChip } = require('./QualifierChipAdapter');
const { adaptNarrative } = require('./NarrativeAdapter');
const { adaptEvidencePanel } = require('./EvidencePanelAdapter');
const { adaptTracePanel } = require('./TracePanelAdapter');
const { adaptExplainabilityBundle } = require('./ExplainabilityBundleAdapter');
const { adaptTopologySummary } = require('./TopologySummaryAdapter');
const { adaptBlockedState } = require('./BlockedStateAdapter');
const { adaptDiagnosticState } = require('./DiagnosticStateAdapter');
const { adaptAuditLineage } = require('./AuditLineageAdapter');

/**
 * adaptReport(reportObject, audienceTier, phase)
 *
 * Full adapter pipeline. Runs validation first, then routes to the appropriate
 * adapter chain. Deterministic: same input always produces same output.
 *
 * Parameters:
 *   reportObject  — incoming report_object (not mutated)
 *   audienceTier  — 'EXECUTIVE' | 'ADVISORY' | 'AUDIT' (default: 'EXECUTIVE')
 *   phase         — integer (default: 2)
 *
 * Returns:
 * {
 *   renderState: string,
 *   audienceTier: string,
 *   surfaceMode: string,
 *   densityClass: string,
 *   panelDefaults: object,
 *   readinessBadge: ReadinessBadgeDisplay | null,
 *   qualifierChip: QualifierChipDisplay | null,
 *   narrative: NarrativeDisplay | null,
 *   evidencePanel: EvidencePanelDisplay | null,
 *   tracePanel: TracePanelDisplay | null,
 *   explainabilityBundle: ExplainabilityBundleDisplay | null,
 *   topologySummary: TopologySummaryDisplay | null,
 *   auditLineage: AuditLineageDisplay | null,
 *   blockedState: BlockedStateDisplay | null,
 *   diagnosticState: DiagnosticStateDisplay | null,
 *   validationResult: ValidationResult,
 *   adapterErrors: AdapterError[],
 *   warnings: ValidationError[],
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptReport(reportObject, audienceTier, phase) {
  const tier = audienceTier || 'EXECUTIVE';
  const currentPhase = phase || 2;
  const adapterErrors = [];

  // STAGE 1: Validate (trust boundary — validation must precede adaptation)
  const validationResult = validateReportObjectPipeline(reportObject);

  // STAGE 2: Resolve surface mode and density class
  const governance_verdict = reportObject && reportObject.governance_verdict;
  const readiness_state = reportObject && reportObject.readiness_state;
  const { surfaceMode, error: surfaceModeError } = resolveSurfaceMode(readiness_state, governance_verdict);
  if (surfaceModeError) adapterErrors.push(surfaceModeError);

  const { densityClass, panelDefaults, warning: densityWarning } = resolveDensityClass(tier);
  if (densityWarning) adapterErrors.push(densityWarning);

  // STAGE 3: Route by render state
  if (validationResult.renderState === 'BLOCKED') {
    return {
      renderState: 'BLOCKED',
      audienceTier: tier,
      surfaceMode: 'BLOCKED',
      densityClass,
      panelDefaults,
      readinessBadge: null,
      qualifierChip: null,
      narrative: null,
      evidencePanel: null,
      tracePanel: null,
      explainabilityBundle: null,
      topologySummary: null,
      auditLineage: null,
      blockedState: adaptBlockedState(validationResult, tier),
      diagnosticState: null,
      validationResult,
      adapterErrors,
      warnings: validationResult.warnings || [],
    };
  }

  if (validationResult.renderState === 'DIAGNOSTIC_ONLY') {
    const topologySummary = adaptTopologySummary(reportObject, currentPhase);
    const auditLineage = adaptAuditLineage(reportObject, tier);
    return {
      renderState: 'DIAGNOSTIC_ONLY',
      audienceTier: tier,
      surfaceMode,
      densityClass,
      panelDefaults,
      readinessBadge: adaptReadinessBadge(reportObject),
      qualifierChip: null,
      narrative: null,
      evidencePanel: null,
      tracePanel: null,
      explainabilityBundle: null,
      topologySummary,
      auditLineage,
      blockedState: null,
      diagnosticState: adaptDiagnosticState(validationResult, []),
      validationResult,
      adapterErrors,
      warnings: validationResult.warnings || [],
    };
  }

  // EXECUTIVE_READY or EXECUTIVE_READY_WITH_QUALIFIER — full adapter chain
  const qualifier_class = reportObject.qualifier_class;
  const tooltip_text = reportObject.header_block &&
    reportObject.header_block.readiness_badge &&
    reportObject.header_block.readiness_badge.tooltip_text;

  const readinessBadge = adaptReadinessBadge(reportObject);
  if (readinessBadge.error) adapterErrors.push(readinessBadge.error);

  const qualifierChip = adaptQualifierChip(qualifier_class, tooltip_text);
  if (qualifierChip.error) adapterErrors.push(qualifierChip.error);

  const narrative = adaptNarrative(reportObject);
  if (narrative.error) adapterErrors.push(narrative.error);

  const evidencePanel = adaptEvidencePanel(reportObject, tier);
  if (evidencePanel.error) adapterErrors.push(evidencePanel.error);

  const tracePanel = adaptTracePanel(reportObject, tier);
  if (tracePanel.error) adapterErrors.push(tracePanel.error);

  const explainabilityBundle = adaptExplainabilityBundle(reportObject, validationResult, tier);
  adapterErrors.push(...explainabilityBundle.errors);

  const topologySummary = adaptTopologySummary(reportObject, currentPhase);
  if (topologySummary.error) adapterErrors.push(topologySummary.error);

  const auditLineage = adaptAuditLineage(reportObject, tier);
  if (auditLineage.error) adapterErrors.push(auditLineage.error);

  // Diagnostic banner if diagnostic reasons exist alongside executive-ready state
  const diagnosticState = validationResult.diagnosticReasons && validationResult.diagnosticReasons.length > 0
    ? adaptDiagnosticState(validationResult, [])
    : null;

  return {
    renderState: validationResult.renderState,
    audienceTier: tier,
    surfaceMode,
    densityClass,
    panelDefaults,
    readinessBadge,
    qualifierChip,
    narrative,
    evidencePanel,
    tracePanel,
    explainabilityBundle,
    topologySummary,
    auditLineage,
    blockedState: null,
    diagnosticState,
    validationResult,
    adapterErrors,
    warnings: validationResult.warnings || [],
  };
}

module.exports = {
  adaptReport,
  // Re-export individual adapters for direct use by downstream components
  adaptReadinessBadge: require('./ReadinessBadgeAdapter').adaptReadinessBadge,
  adaptQualifierChip: require('./QualifierChipAdapter').adaptQualifierChip,
  adaptNarrative: require('./NarrativeAdapter').adaptNarrative,
  adaptEvidencePanel: require('./EvidencePanelAdapter').adaptEvidencePanel,
  adaptEvidenceDrawer: require('./EvidenceDrawerAdapter').adaptEvidenceDrawer,
  adaptSignalCard: require('./SignalCardAdapter').adaptSignalCard,
  adaptTracePanel: require('./TracePanelAdapter').adaptTracePanel,
  adaptExplainabilityBundle: require('./ExplainabilityBundleAdapter').adaptExplainabilityBundle,
  adaptTopologySummary: require('./TopologySummaryAdapter').adaptTopologySummary,
  adaptBlockedState: require('./BlockedStateAdapter').adaptBlockedState,
  adaptDiagnosticState: require('./DiagnosticStateAdapter').adaptDiagnosticState,
  adaptAuditLineage: require('./AuditLineageAdapter').adaptAuditLineage,
  resolveSurfaceMode: require('./SurfaceModeResolver').resolveSurfaceMode,
  resolveDensityClass: require('./SurfaceModeResolver').resolveDensityClass,
};
