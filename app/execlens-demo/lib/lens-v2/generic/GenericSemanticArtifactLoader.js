/**
 * GenericSemanticArtifactLoader
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Manifest-driven artifact loading for the LENS V2 generic resolver.
 *
 * The resolver MUST NOT infer arbitrary filesystem structure. It loads
 * ONLY the paths declared by a validated client/run manifest. All paths
 * are resolved relative to REPO_ROOT and are rejected if they escape
 * the repository (path traversal protection).
 *
 * Required artifacts: any missing or invalid required artifact returns
 * `{ ok: false }` from `loadArtifacts`, signalling REJECTED to the
 * caller. Optional artifacts: missing/invalid optional artifacts are
 * recorded as `unresolved_gaps` with `impact: NON_BLOCKING` (or
 * INFERENCE_PROHIBITION_PLACEHOLDER for `rendering_metadata`).
 */

'use strict';

const path = require('path');

const { loadJSON, artifactExists } = require('../SemanticArtifactLoader');

function joinRepoRelative(p) {
  // p is repo-relative; SemanticArtifactLoader joins with REPO_ROOT and
  // rejects traversal via resolveAllowedPath. We trust it.
  return p;
}

function classifyOptionalGap(key, p, reason) {
  if (key === 'rendering_metadata') {
    return {
      code: 'IP_RENDERING_METADATA',
      path: p,
      reason: reason || 'rendering_metadata not yet exposed as a per-run vault artifact',
      impact: 'INFERENCE_PROHIBITION_PLACEHOLDER',
    };
  }
  return {
    code: key.toUpperCase(),
    path: p,
    reason: reason || 'ARTIFACT_ABSENT',
    impact: 'NON_BLOCKING',
  };
}

/**
 * Load all artifacts declared by a manifest.
 * @param {object} manifest validated client/run manifest
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   missing?: object,
 *   sources: object,                      // map id → { path, ok, data?, error?, missing? }
 *   unresolvedGaps: Array<object>,
 *   reportPackPaths: object,              // map id → repo-relative path
 * }}
 */
function loadArtifacts(manifest) {
  const required = (manifest.artifacts && manifest.artifacts.required) || {};
  const optional = (manifest.artifacts && manifest.artifacts.optional) || {};
  const reportPack = manifest.report_pack || {};

  const sources = {};
  const unresolvedGaps = [];

  for (const [key, p] of Object.entries(required)) {
    const r = loadJSON(joinRepoRelative(p));
    sources[key] = { path: p, ok: r.ok, data: r.ok ? r.data : null };
    if (!r.ok) {
      return {
        ok: false,
        error: 'REQUIRED_ARTIFACT_MISSING',
        missing: { key, path: p, reason: r.missing ? 'MISSING' : (r.error || 'INVALID') },
        sources,
        unresolvedGaps,
        reportPackPaths: reportPack,
      };
    }
  }

  for (const [key, p] of Object.entries(optional)) {
    const r = loadJSON(joinRepoRelative(p));
    sources[key] = { path: p, ok: r.ok, data: r.ok ? r.data : null };
    if (!r.ok) {
      unresolvedGaps.push(classifyOptionalGap(key, p, r.missing ? 'ARTIFACT_ABSENT' : (r.error || 'INVALID')));
    }
  }

  return { ok: true, sources, unresolvedGaps, reportPackPaths: reportPack };
}

/**
 * Whether a given report-pack artifact id has a backing file on disk
 * (relative to REPO_ROOT). Used to surface AVAILABLE / PENDING binding
 * status without leaking absolute filesystem paths to the page.
 */
function reportPackArtifactExists(reportPackPaths, id) {
  const p = reportPackPaths && reportPackPaths[id];
  return !!(p && artifactExists(p));
}

module.exports = {
  loadArtifacts,
  classifyOptionalGap,
  reportPackArtifactExists,
};
