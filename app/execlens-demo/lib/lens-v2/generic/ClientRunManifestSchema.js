/**
 * ClientRunManifestSchema
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * JS validator + builder for client/run manifests. Mirrors the wire
 * schema at docs/governance/runtime/client_run_manifest.schema.json.
 *
 * The resolver reads ONLY paths declared by the manifest. There is no
 * fallback to arbitrary filesystem inference.
 */

'use strict';

const REQUIRED_TOPLEVEL = [
  'manifest_version', 'client', 'run_id', 'stream_anchor',
  'baseline', 'artifacts', 'report_pack', 'governance',
];

const REQUIRED_ARTIFACT_KEYS = [
  'semantic_topology_model',
  'decision_validation',
  'reproducibility_verdict',
  'semantic_continuity_crosswalk',
  'canonical_topology_40_4',
  'dpsig_signal_set',
];

const OPTIONAL_ARTIFACT_KEYS_HINT = [
  'structural_topology_log_40_3',
  'signal_registry',
  'evidence_trace',
  'vault_readiness',
  'semantic_bundle_manifest',
  'rendering_metadata',
];

const REPORT_PACK_ARTIFACT_KEYS_HINT = [
  'decision-surface', 'tier1-narrative', 'tier1-evidence', 'tier2-diagnostic',
];

function looksLikeRelativePath(p) {
  return typeof p === 'string'
    && p.length > 0
    && !p.includes('..')
    && !p.startsWith('/')
    && !/^[A-Za-z]:[\\/]/.test(p);
}

function validateClientRunManifest(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, errors: ['ROOT_NOT_OBJECT'] };
  }
  for (const key of REQUIRED_TOPLEVEL) {
    if (!Object.prototype.hasOwnProperty.call(doc, key)) {
      errors.push(`MISSING_REQUIRED_FIELD:${key}`);
    }
  }
  if (typeof doc.manifest_version !== 'string'
      || !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(doc.manifest_version)) {
    errors.push('INVALID_MANIFEST_VERSION');
  }
  if (typeof doc.client !== 'string' || !/^[A-Za-z0-9_\-]+$/.test(doc.client) || doc.client.length > 64) {
    errors.push('INVALID_CLIENT');
  }
  if (typeof doc.run_id !== 'string' || !/^[A-Za-z0-9_\-]+$/.test(doc.run_id) || doc.run_id.length > 128) {
    errors.push('INVALID_RUN_ID');
  }
  if (!doc.baseline || typeof doc.baseline !== 'object') {
    errors.push('BASELINE_MISSING');
  } else {
    if (typeof doc.baseline.governance_tag !== 'string') errors.push('BASELINE_TAG_MISSING');
    if (typeof doc.baseline.pipeline_commit !== 'string') errors.push('BASELINE_COMMIT_MISSING');
  }
  if (!doc.artifacts || typeof doc.artifacts !== 'object') {
    errors.push('ARTIFACTS_MISSING');
  } else {
    if (!doc.artifacts.required || typeof doc.artifacts.required !== 'object') {
      errors.push('ARTIFACTS_REQUIRED_MISSING');
    } else {
      for (const k of REQUIRED_ARTIFACT_KEYS) {
        if (!Object.prototype.hasOwnProperty.call(doc.artifacts.required, k)) {
          errors.push(`ARTIFACT_REQUIRED_MISSING:${k}`);
          continue;
        }
        if (!looksLikeRelativePath(doc.artifacts.required[k])) {
          errors.push(`ARTIFACT_REQUIRED_PATH_INVALID:${k}`);
        }
      }
    }
    if (!doc.artifacts.optional || typeof doc.artifacts.optional !== 'object') {
      errors.push('ARTIFACTS_OPTIONAL_MISSING');
    } else {
      for (const [k, v] of Object.entries(doc.artifacts.optional)) {
        if (!looksLikeRelativePath(v)) {
          errors.push(`ARTIFACT_OPTIONAL_PATH_INVALID:${k}`);
        }
      }
    }
  }
  if (!doc.report_pack || typeof doc.report_pack !== 'object') {
    errors.push('REPORT_PACK_MISSING');
  } else {
    for (const [k, v] of Object.entries(doc.report_pack)) {
      if (!/^[A-Za-z0-9_\-]+$/.test(k)) errors.push(`REPORT_PACK_ID_INVALID:${k}`);
      if (!looksLikeRelativePath(v)) errors.push(`REPORT_PACK_PATH_INVALID:${k}`);
    }
  }
  const ga = doc.governance;
  if (!ga || typeof ga !== 'object') {
    errors.push('GOVERNANCE_MISSING');
  } else {
    if (ga.lane_a_read_only !== true) errors.push('GOVERNANCE_LANE_A_NOT_READ_ONLY');
    if (ga.lane_d_dpsig_read_only !== true) errors.push('GOVERNANCE_LANE_D_NOT_READ_ONLY');
    if (ga.additive_only !== true) errors.push('GOVERNANCE_NOT_ADDITIVE_ONLY');
  }
  return { ok: errors.length === 0, errors };
}

module.exports = {
  REQUIRED_TOPLEVEL,
  REQUIRED_ARTIFACT_KEYS,
  OPTIONAL_ARTIFACT_KEYS_HINT,
  REPORT_PACK_ARTIFACT_KEYS_HINT,
  looksLikeRelativePath,
  validateClientRunManifest,
};
