/**
 * LensSemanticPayloadSchema
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * JS validator for the canonical lens_semantic_payload emitted by the
 * generic resolver. Mirrors the wire schema at
 * docs/governance/runtime/lens_semantic_payload.schema.json.
 *
 * The validator is permissive on optional / fixture-compat fields to
 * preserve backward compatibility with the existing BlueEdge payload.
 * Required structural fields are enforced strictly.
 */

'use strict';

const PAYLOAD_VERSION = '1.0';

const REQUIRED_TOPLEVEL = [
  'ok', 'payload_version', 'client', 'run_id', 'baseline_commit',
  'binding_status', 'actor_registry', 'source_artifacts', 'unresolved_gaps',
  'report_pack', 'governance_assertions', 'rendering_metadata',
  'qualifier_summary', 'evidence_summary', 'topology_summary',
  'trace_summary', 'dpsig_signal_summary',
];

const REQUIRED_GOVERNANCE_FLAGS = [
  'evidence_first', 'no_source_mutation', 'no_synthetic_telemetry',
  'no_ai_generation', 'topology_native', 'replay_safe',
];

const VALID_QUALIFIER_CLASSES = new Set(['Q-01', 'Q-02', 'Q-03', 'Q-04']);
const VALID_RM_BINDING = new Set([
  'INFERENCE_PROHIBITION_ENFORCED', 'INFERENCE_PROHIBITION_PLACEHOLDER_PENDING',
]);
const VALID_ACTOR_STATUS = new Set([
  'HYDRATED', 'HYDRATED_WITH_DERIVATION', 'PRESENTATION_LAYER_DERIVED',
  'PLACEHOLDER_BINDING_PENDING', 'BLOCKED_MISSING_ARTIFACT', 'PARTIALLY_HYDRATED',
]);
const VALID_BINDING_STATUS = new Set(['LIVE', 'REJECTED', 'PARTIAL']);

function validateLensSemanticPayload(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, errors: ['ROOT_NOT_OBJECT'] };
  }
  for (const k of REQUIRED_TOPLEVEL) {
    if (!Object.prototype.hasOwnProperty.call(doc, k)) {
      errors.push(`MISSING_REQUIRED_FIELD:${k}`);
    }
  }
  if (typeof doc.payload_version !== 'string'
      || !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(doc.payload_version)) {
    errors.push('INVALID_PAYLOAD_VERSION');
  }
  if (typeof doc.client !== 'string' || doc.client.length === 0) errors.push('INVALID_CLIENT');
  if (typeof doc.run_id !== 'string' || doc.run_id.length === 0) errors.push('INVALID_RUN_ID');
  if (typeof doc.baseline_commit !== 'string' || doc.baseline_commit.length === 0) errors.push('INVALID_BASELINE_COMMIT');
  if (!VALID_BINDING_STATUS.has(doc.binding_status)) errors.push('INVALID_BINDING_STATUS');

  if (!doc.qualifier_summary || typeof doc.qualifier_summary !== 'object') {
    errors.push('QUALIFIER_SUMMARY_MISSING');
  } else if (!VALID_QUALIFIER_CLASSES.has(doc.qualifier_summary.qualifier_class)) {
    errors.push(`INVALID_QUALIFIER_CLASS:${doc.qualifier_summary.qualifier_class}`);
  }

  if (!doc.actor_registry || typeof doc.actor_registry !== 'object') {
    errors.push('ACTOR_REGISTRY_MISSING');
  } else {
    const codes = new Set();
    for (const [name, actor] of Object.entries(doc.actor_registry)) {
      if (!actor || typeof actor !== 'object') {
        errors.push(`ACTOR_INVALID:${name}`);
        continue;
      }
      if (!/^[A-Z]{2}$/.test(actor.code)) errors.push(`ACTOR_CODE_INVALID:${name}=${actor.code}`);
      if (!VALID_ACTOR_STATUS.has(actor.status)) errors.push(`ACTOR_STATUS_INVALID:${name}=${actor.status}`);
      codes.add(actor.code);
    }
    if (codes.size !== 15) {
      errors.push(`ACTOR_REGISTRY_COUNT_NOT_15:${codes.size}`);
    }
  }

  if (!Array.isArray(doc.unresolved_gaps)) errors.push('UNRESOLVED_GAPS_NOT_ARRAY');
  if (!doc.report_pack || !Array.isArray(doc.report_pack.artifacts)) {
    errors.push('REPORT_PACK_MISSING');
  }

  const ga = doc.governance_assertions;
  if (!ga || typeof ga !== 'object') {
    errors.push('GOVERNANCE_ASSERTIONS_MISSING');
  } else {
    REQUIRED_GOVERNANCE_FLAGS.forEach(k => {
      if (ga[k] !== true) errors.push(`GOVERNANCE_FLAG_FALSE:${k}`);
    });
  }

  const rm = doc.rendering_metadata;
  if (!rm || typeof rm !== 'object') {
    errors.push('RENDERING_METADATA_MISSING');
  } else if (!VALID_RM_BINDING.has(rm.binding_status)) {
    errors.push(`RENDERING_METADATA_BINDING_INVALID:${rm.binding_status}`);
  }

  return { ok: errors.length === 0, errors };
}

module.exports = {
  PAYLOAD_VERSION,
  REQUIRED_TOPLEVEL,
  REQUIRED_GOVERNANCE_FLAGS,
  VALID_QUALIFIER_CLASSES,
  VALID_RM_BINDING,
  VALID_ACTOR_STATUS,
  VALID_BINDING_STATUS,
  validateLensSemanticPayload,
};
