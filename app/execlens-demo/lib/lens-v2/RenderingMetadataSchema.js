/**
 * RenderingMetadataSchema
 * PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
 *
 * Lightweight builder + validator for the rendering_metadata vault artifact
 * defined by docs/governance/runtime/rendering_metadata.schema.json.
 *
 * Replay-safe: pure functions; deterministic; no I/O; no AI inference.
 *
 * The validator implements the LOCKED schema directly (no external JSON
 * Schema dependency). It is stricter than additionalProperties:true on
 * the wire schema — internal callers should use the wire schema for
 * looser-shape interop.
 */

'use strict';

const RENDERING_CONTRACT_VERSION = '1.0';

const SEMANTIC_PROJECTION_CLASS = new Set([
  'FULL_GROUNDING',
  'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY',
  'SEMANTIC_ONLY',
  'UNAVAILABLE',
]);

const INFERENCE_PROHIBITION_STATUS = new Set(['ENFORCED', 'PLACEHOLDER_PENDING']);
const GROUNDING_CLASS = new Set(['Q-01', 'Q-02', 'Q-03', 'Q-04']);
const SEMANTIC_CONTINUITY_STATUS = new Set(['VALIDATED', 'ABSENT']);
const ACTOR_STATUS = new Set([
  'HYDRATED',
  'HYDRATED_WITH_DERIVATION',
  'PRESENTATION_LAYER_DERIVED',
  'PLACEHOLDER_BINDING_PENDING',
]);
const GAP_IMPACT = new Set(['NON_BLOCKING', 'ADVISORY_REQUIRED', 'EXECUTIVE_CAUTION']);

const REQUIRED_GOVERNANCE_FLAGS = [
  'no_ai_inference',
  'no_synthetic_qualifiers',
  'no_topology_mutation',
  'additive_artifact_only',
  'no_prompt_surfaces',
  'no_chatbot_ux',
];

/**
 * Validate a rendering_metadata document.
 * @param {object} doc
 * @returns {{ ok: boolean, errors: string[] }}
 */
function validateRenderingMetadata(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, errors: ['ROOT_NOT_OBJECT'] };
  }

  const requiredTopLevel = [
    'rendering_contract_version', 'client_id', 'run_id', 'generated_at',
    'semantic_projection_class', 'inference_prohibition_status',
    'grounding_class', 'semantic_continuity_status', 'replay_safe',
    'topology_safe', 'unresolved_semantic_gaps', 'disclosure_requirements',
    'governance_assertions', 'actor_projection_status',
  ];
  for (const key of requiredTopLevel) {
    if (!Object.prototype.hasOwnProperty.call(doc, key)) {
      errors.push(`MISSING_REQUIRED_FIELD:${key}`);
    }
  }

  if (typeof doc.rendering_contract_version !== 'string'
      || !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(doc.rendering_contract_version)) {
    errors.push('INVALID_CONTRACT_VERSION');
  }
  if (typeof doc.client_id !== 'string' || doc.client_id.length === 0 || doc.client_id.length > 64) {
    errors.push('INVALID_CLIENT_ID');
  }
  if (typeof doc.run_id !== 'string' || doc.run_id.length === 0 || doc.run_id.length > 128) {
    errors.push('INVALID_RUN_ID');
  }
  if (typeof doc.generated_at !== 'string' || isNaN(Date.parse(doc.generated_at))) {
    errors.push('INVALID_GENERATED_AT');
  }
  if (!SEMANTIC_PROJECTION_CLASS.has(doc.semantic_projection_class)) {
    errors.push('INVALID_SEMANTIC_PROJECTION_CLASS');
  }
  if (!INFERENCE_PROHIBITION_STATUS.has(doc.inference_prohibition_status)) {
    errors.push('INVALID_INFERENCE_PROHIBITION_STATUS');
  }
  if (!GROUNDING_CLASS.has(doc.grounding_class)) {
    errors.push('INVALID_GROUNDING_CLASS');
  }
  if (!SEMANTIC_CONTINUITY_STATUS.has(doc.semantic_continuity_status)) {
    errors.push('INVALID_SEMANTIC_CONTINUITY_STATUS');
  }
  if (doc.replay_safe !== true) errors.push('REPLAY_SAFE_MUST_BE_TRUE');
  if (doc.topology_safe !== true) errors.push('TOPOLOGY_SAFE_MUST_BE_TRUE');

  if (!Array.isArray(doc.unresolved_semantic_gaps)) {
    errors.push('UNRESOLVED_GAPS_NOT_ARRAY');
  } else {
    doc.unresolved_semantic_gaps.forEach((g, i) => {
      if (!g || typeof g !== 'object') {
        errors.push(`GAP_INVALID:${i}`);
        return;
      }
      if (typeof g.code !== 'string' || !g.code) errors.push(`GAP_MISSING_CODE:${i}`);
      if (typeof g.reason !== 'string' || !g.reason) errors.push(`GAP_MISSING_REASON:${i}`);
      if (!GAP_IMPACT.has(g.impact)) errors.push(`GAP_INVALID_IMPACT:${i}`);
    });
  }

  if (!Array.isArray(doc.disclosure_requirements) || doc.disclosure_requirements.length === 0) {
    errors.push('DISCLOSURE_REQUIREMENTS_EMPTY');
  } else {
    doc.disclosure_requirements.forEach((d, i) => {
      if (typeof d !== 'string' || !d) errors.push(`DISCLOSURE_ITEM_INVALID:${i}`);
    });
  }

  const ga = doc.governance_assertions;
  if (!ga || typeof ga !== 'object') {
    errors.push('GOVERNANCE_ASSERTIONS_MISSING');
  } else {
    REQUIRED_GOVERNANCE_FLAGS.forEach(k => {
      if (ga[k] !== true) errors.push(`GOVERNANCE_ASSERTION_FALSE:${k}`);
    });
  }

  const aps = doc.actor_projection_status;
  if (!aps || typeof aps !== 'object' || Array.isArray(aps)) {
    errors.push('ACTOR_PROJECTION_STATUS_INVALID');
  } else {
    const codes = Object.keys(aps);
    codes.forEach(code => {
      if (!/^[A-Z]{2}$/.test(code)) {
        errors.push(`ACTOR_CODE_INVALID:${code}`);
      } else if (!ACTOR_STATUS.has(aps[code])) {
        errors.push(`ACTOR_STATUS_INVALID:${code}=${aps[code]}`);
      }
    });
    if (codes.length !== 15) {
      errors.push(`ACTOR_PROJECTION_STATUS_COUNT_NOT_15:${codes.length}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Build a rendering_metadata document from inputs.
 * Deterministic when given the same inputs (callers must supply
 * generated_at to keep the document byte-stable across re-runs).
 *
 * @param {object} input
 * @param {string} input.client_id
 * @param {string} input.run_id
 * @param {string} input.generated_at         ISO date-time string
 * @param {string} input.grounding_class      Q-01..Q-04
 * @param {string} input.semantic_projection_class
 * @param {string} input.inference_prohibition_status
 * @param {string} input.semantic_continuity_status
 * @param {object} input.derivation_inputs
 * @param {Array}  input.unresolved_semantic_gaps
 * @param {Array}  input.disclosure_requirements
 * @param {object} input.actor_projection_status
 * @param {Array}  [input.qualifier_rules_applied]
 * @param {Array}  [input.ali_rules_applied]
 * @param {string} [input.stream_anchor]
 * @param {string} [input.amendment_anchor]
 * @param {string} [input.baseline_commit]
 * @returns {object}
 */
function buildRenderingMetadata(input) {
  const out = {
    rendering_contract_version: RENDERING_CONTRACT_VERSION,
    client_id: input.client_id,
    run_id: input.run_id,
    generated_at: input.generated_at,
    semantic_projection_class: input.semantic_projection_class,
    inference_prohibition_status: input.inference_prohibition_status || 'ENFORCED',
    grounding_class: input.grounding_class,
    semantic_continuity_status: input.semantic_continuity_status,
    replay_safe: true,
    topology_safe: true,
    unresolved_semantic_gaps: Array.isArray(input.unresolved_semantic_gaps)
      ? input.unresolved_semantic_gaps : [],
    disclosure_requirements: Array.isArray(input.disclosure_requirements)
      ? input.disclosure_requirements : [],
    governance_assertions: {
      no_ai_inference: true,
      no_synthetic_qualifiers: true,
      no_topology_mutation: true,
      additive_artifact_only: true,
      no_prompt_surfaces: true,
      no_chatbot_ux: true,
      evidence_first: true,
      lane_a_read_only: true,
      lane_d_dpsig_read_only: true,
    },
    actor_projection_status: input.actor_projection_status || {},
    qualifier_rules_applied: Array.isArray(input.qualifier_rules_applied)
      ? input.qualifier_rules_applied : [input.grounding_class],
    ali_rules_applied: Array.isArray(input.ali_rules_applied)
      ? input.ali_rules_applied : [],
    derivation_inputs: input.derivation_inputs || null,
    stream_anchor: input.stream_anchor || 'PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01',
    amendment_anchor: input.amendment_anchor || 'docs/governance/Q02_GOVERNANCE_AMENDMENT.md',
    baseline_commit: input.baseline_commit || '93098cb',
  };
  return out;
}

module.exports = {
  RENDERING_CONTRACT_VERSION,
  SEMANTIC_PROJECTION_CLASS,
  INFERENCE_PROHIBITION_STATUS,
  GROUNDING_CLASS,
  SEMANTIC_CONTINUITY_STATUS,
  ACTOR_STATUS,
  GAP_IMPACT,
  REQUIRED_GOVERNANCE_FLAGS,
  validateRenderingMetadata,
  buildRenderingMetadata,
};
