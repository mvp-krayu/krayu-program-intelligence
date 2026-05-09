'use strict';

/**
 * SurfaceModeResolver.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Maps validated readiness_state + governance_verdict → surface render mode.
 * Maps audience_tier → density class + panel defaults.
 *
 * Source contracts: VIS-READY-01; executive_rendering_system.json.
 * Pure function. No side effects. No mutation.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

// VIS-READY-01 — surface mode derivation from readiness_state
const READINESS_TO_SURFACE_MODE = {
  EXECUTIVE_READY: 'EXECUTIVE_READY',
  EXECUTIVE_READY_WITH_QUALIFIER: 'EXECUTIVE_READY_WITH_QUALIFIER',
  DIAGNOSTIC_ONLY: 'DIAGNOSTIC_ONLY',
  SUPPRESSED_FROM_EXECUTIVE: 'STRUCTURAL_ONLY',
  BLOCKED_PENDING_DOMAIN_GROUNDING: 'BLOCKED',
};

// Audience tier → density class (executive_rendering_system.json)
const AUDIENCE_TO_DENSITY_CLASS = {
  EXECUTIVE: 'EXECUTIVE_DENSE',
  ADVISORY: 'INVESTIGATION_DENSE',
  AUDIT: 'AUDIT_DENSE',
};

// Density class → region default states
const DENSITY_PANEL_DEFAULTS = {
  EXECUTIVE_DENSE: {
    REGION_EXECUTIVE_HEADER: 'EXPANDED',
    REGION_INTELLIGENCE_SUMMARY: 'EXPANDED',
    REGION_EXPLAINABILITY: 'PARTIALLY_EXPANDED',
    REGION_TOPOLOGY: 'PLACEHOLDER',
    REGION_DIAGNOSTIC: 'CONDITIONAL',
    REGION_LINEAGE: 'COLLAPSED',
    REGION_AUDIT: 'COLLAPSED',
  },
  INVESTIGATION_DENSE: {
    REGION_EXECUTIVE_HEADER: 'EXPANDED',
    REGION_INTELLIGENCE_SUMMARY: 'EXPANDED',
    REGION_EXPLAINABILITY: 'EXPANDED',
    REGION_TOPOLOGY: 'PLACEHOLDER',
    REGION_DIAGNOSTIC: 'EXPANDED',
    REGION_LINEAGE: 'EXPANDED',
    REGION_AUDIT: 'COLLAPSED',
  },
  AUDIT_DENSE: {
    REGION_EXECUTIVE_HEADER: 'EXPANDED',
    REGION_INTELLIGENCE_SUMMARY: 'EXPANDED',
    REGION_EXPLAINABILITY: 'EXPANDED',
    REGION_TOPOLOGY: 'PLACEHOLDER',
    REGION_DIAGNOSTIC: 'EXPANDED',
    REGION_LINEAGE: 'EXPANDED',
    REGION_AUDIT: 'EXPANDED',
  },
};

/**
 * resolveSurfaceMode(readiness_state, governance_verdict)
 *
 * Maps readiness_state + governance_verdict → surface render mode.
 * governance_verdict FAIL always overrides to BLOCKED.
 *
 * Returns: { surfaceMode: string, error: AdapterError | null }
 * Pure function.
 */
function resolveSurfaceMode(readiness_state, governance_verdict) {
  if (governance_verdict === 'FAIL') {
    return { surfaceMode: 'BLOCKED', error: null };
  }

  const surfaceMode = READINESS_TO_SURFACE_MODE[readiness_state];
  if (!surfaceMode) {
    return {
      surfaceMode: 'BLOCKED',
      error: makeAdapterError('ADAPT-SURFACE-01',
        `readiness_state '${readiness_state}' cannot be resolved to a surface mode`),
    };
  }

  return { surfaceMode, error: null };
}

/**
 * resolveDensityClass(audienceTier)
 *
 * Maps audience_tier → density class and panel defaults.
 * Unknown audience_tier defaults to EXECUTIVE_DENSE with a diagnostic warning.
 *
 * Returns: { densityClass: string, panelDefaults: object, warning: AdapterError | null }
 * Pure function.
 */
function resolveDensityClass(audienceTier) {
  const densityClass = AUDIENCE_TO_DENSITY_CLASS[audienceTier];
  if (!densityClass) {
    return {
      densityClass: 'EXECUTIVE_DENSE',
      panelDefaults: DENSITY_PANEL_DEFAULTS['EXECUTIVE_DENSE'],
      warning: makeAdapterError('ADAPT-SURFACE-02',
        `Unknown audience_tier '${audienceTier}' — defaulting to EXECUTIVE_DENSE`),
    };
  }

  return {
    densityClass,
    panelDefaults: DENSITY_PANEL_DEFAULTS[densityClass],
    warning: null,
  };
}

module.exports = {
  resolveSurfaceMode,
  resolveDensityClass,
  READINESS_TO_SURFACE_MODE,
  AUDIENCE_TO_DENSITY_CLASS,
  DENSITY_PANEL_DEFAULTS,
};
