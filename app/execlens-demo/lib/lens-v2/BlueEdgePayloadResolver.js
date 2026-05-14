/**
 * BlueEdgePayloadResolver
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 * (originally PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01)
 *
 * Compatibility wrapper around the productized
 * `GenericSemanticPayloadResolver`. This module preserves the public
 * API consumed by:
 *   - app/execlens-demo/pages/lens-v2-flagship.js (getServerSideProps)
 *   - app/execlens-demo/pages/api/lens-payload.js
 *   - app/execlens-demo/pages/api/report-pack.js
 *   - app/execlens-demo/flagship-experience/tests/live-binding.test.js
 *   - app/execlens-demo/flagship-experience/tests/q02-and-ip.test.js
 *
 * It now delegates substrate loading and payload assembly to the
 * generic, manifest-driven resolver. Manifests live under
 * `app/execlens-demo/lib/lens-v2/manifests/` and are governed by
 * `docs/governance/runtime/client_run_manifest.schema.json`.
 *
 * Governance:
 *   - No client-name branching beyond the allow-list registry.
 *   - No filesystem-path inference; all paths are declared by manifests.
 *   - Lane A / Lane D DPSIG consumption READ ONLY.
 *   - Q-02 governance + IP hydration preserved.
 *   - Backward-compatible payload shape preserved (top-level
 *     qualifier_class = legacy compat; qualifier_summary.qualifier_class
 *     = governance-true).
 */

'use strict';

const path = require('path');

const { resolveSemanticPayload } = require('./generic/GenericSemanticPayloadResolver');
const { loadManifest, REGISTRY, isAllowedPair } = require('./manifests');

const BASELINE_GOVERNANCE_TAG = 'governed-dpsig-baseline-v1';
const BASELINE_PIPELINE_COMMIT = '93098cb';

// Public allow-list — kept as Sets for backward-compat with prior tests.
const ALLOWED_CLIENTS = new Set(Object.keys(REGISTRY));
const ALLOWED_RUNS = Object.fromEntries(
  Object.keys(REGISTRY).map((c) => [c, new Set(Object.keys(REGISTRY[c]))])
);

/**
 * Validate the requested (client, runId) pair against the manifest
 * registry. Same return shape as the prior implementation so existing
 * tests continue to work.
 */
function validateClientRun(client, runId) {
  if (!ALLOWED_CLIENTS.has(client)) {
    return { ok: false, error: 'CLIENT_NOT_ALLOWED', client };
  }
  const allowedRuns = ALLOWED_RUNS[client] || new Set();
  if (!allowedRuns.has(runId)) {
    return { ok: false, error: 'RUN_NOT_ALLOWED', client, run: runId };
  }
  return { ok: true };
}

/**
 * Build the per-run path map by reading the manifest. Preserves the
 * legacy `buildPaths(client, runId)` contract for backward-compatible
 * tests, so callers can still introspect the resolved paths without
 * loading the manifest themselves.
 *
 * Falls back to throwing if the requested pair is not on the allow-list.
 */
function buildPaths(client, runId) {
  const m = loadManifest(client, runId);
  if (!m.ok) {
    // Preserve legacy throw-free behaviour: return a minimal path map
    // with the allow-listed identity but no concrete artifact paths.
    return {
      client,
      run: runId,
      runRoot: path.posix.join('clients', client, 'psee', 'runs', runId),
      dpsig: path.posix.join('artifacts', 'dpsig', client, runId, 'dpsig_signal_set.json'),
      reports: {},
      _resolver_error: m.error,
    };
  }
  const required = (m.manifest.artifacts && m.manifest.artifacts.required) || {};
  const optional = (m.manifest.artifacts && m.manifest.artifacts.optional) || {};
  return {
    client,
    run: runId,
    runRoot: path.posix.join('clients', client, 'psee', 'runs', runId),
    dpsig:   required.dpsig_signal_set
      || path.posix.join('artifacts', 'dpsig', client, runId, 'dpsig_signal_set.json'),
    semantic_topology_model: required.semantic_topology_model,
    decision_validation: required.decision_validation,
    reproducibility_verdict: required.reproducibility_verdict,
    semantic_continuity_crosswalk: required.semantic_continuity_crosswalk,
    canonical_topology_40_4: required.canonical_topology_40_4,
    structural_topology_log_40_3: optional.structural_topology_log_40_3,
    signal_registry: optional.signal_registry,
    evidence_trace: optional.evidence_trace,
    vault_readiness: optional.vault_readiness,
    semantic_bundle_manifest: optional.semantic_bundle_manifest,
    rendering_metadata: optional.rendering_metadata,
    dpsig_signal_set: required.dpsig_signal_set,
    reports: m.manifest.report_pack || {},
  };
}

/**
 * Resolve the live payload for an allowed BlueEdge run.
 *
 * Public contract preserved:
 *   - returns `{ ok: true, ... }` with the canonical payload on success
 *   - returns `{ ok: false, binding_status: 'REJECTED', error, ... }` on
 *     unknown client/run, missing required artifact, or manifest issues
 */
function resolveBlueEdgePayload(client, runId) {
  const v = validateClientRun(client, runId);
  if (!v.ok) {
    return { ok: false, error: v.error, binding_status: 'REJECTED', detail: v };
  }
  const m = loadManifest(client, runId);
  if (!m.ok) {
    return {
      ok: false,
      binding_status: 'REJECTED',
      error: m.error,
      detail: m.detail,
    };
  }
  return resolveSemanticPayload(m.manifest);
}

module.exports = {
  BASELINE_GOVERNANCE_TAG,
  BASELINE_PIPELINE_COMMIT,
  ALLOWED_CLIENTS,
  ALLOWED_RUNS,
  buildPaths,
  validateClientRun,
  resolveBlueEdgePayload,
};
