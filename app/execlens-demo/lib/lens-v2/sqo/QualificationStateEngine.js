'use strict';

const { loadManifest, listAllowedClientRuns, isClientRunAllowed } = require('../manifests');
const { loadArtifacts } = require('../generic/GenericSemanticArtifactLoader');
const { resolveSemanticPayload } = require('../generic/GenericSemanticPayloadResolver');
const { REQUIRED_ARTIFACT_KEYS } = require('../generic/ClientRunManifestSchema');

const S_STATES = {
  S0: 'STRUCTURAL_ONLY',
  S1: 'STRUCTURAL_LABELS_ONLY',
  S2: 'PARTIAL_GROUNDING_WITH_CONTINUITY',
  S3: 'SEMANTICALLY_GOVERNABLE',
  S4_PLUS: 'GOVERNED_COGNITION',
};

const AUTHORIZATION_MAP = {
  S0: {
    authorization_tier: 'NOT_AUTHORIZED',
    boardroom_readiness: 'REPORT_PACK_ONLY',
    projection_permission: 'NONE',
  },
  S1: {
    authorization_tier: 'NOT_AUTHORIZED',
    boardroom_readiness: 'NOT_READY',
    projection_permission: 'DENIED',
  },
  S2: {
    authorization_tier: 'AUTHORIZED_WITH_QUALIFICATION',
    boardroom_readiness: 'BOARDROOM_QUALIFIED',
    projection_permission: 'EXECUTIVE_SURFACE_WITH_QUALIFIER',
  },
  S3: {
    authorization_tier: 'FULLY_AUTHORIZED',
    boardroom_readiness: 'BOARDROOM_READY',
    projection_permission: 'FULL_EXECUTIVE_SURFACE',
  },
};

const GOVERNANCE_DISCLOSURES = {
  S0: [],
  S1: ['REQUIRED_ARTIFACT_MISSING'],
  S2: ['QUALIFIER_CHIP_REQUIRED', 'ADVISORY_CONFIRMATION_MANDATORY'],
  S3: [],
};

const OPERATION_VERSION = '1.0';

function detectQualificationState({ client, run, manifest, loadResult, payload }) {
  if (!manifest) {
    return {
      s_state: 'S0',
      state_label: S_STATES.S0,
      state_reason: 'No manifest available for this client/run',
      detection_path: 'NO_MANIFEST',
    };
  }

  const requiredArtifacts = (manifest.artifacts && manifest.artifacts.required) || {};
  if (!requiredArtifacts.semantic_topology_model) {
    return {
      s_state: 'S0',
      state_label: S_STATES.S0,
      state_reason: 'No semantic_topology_model declared in manifest',
      detection_path: 'NO_SEMANTIC_TOPOLOGY_DECLARED',
    };
  }

  if (loadResult && !loadResult.ok) {
    return {
      s_state: 'S1',
      state_label: S_STATES.S1,
      state_reason: loadResult.error === 'REQUIRED_ARTIFACT_MISSING'
        ? `Required artifact missing: ${loadResult.missing ? loadResult.missing.key : 'unknown'}`
        : `Artifact loader failed: ${loadResult.error || 'unknown'}`,
      detection_path: 'LOAD_FAILED',
      missing_artifact: loadResult.missing || null,
    };
  }

  if (!payload || !payload.ok) {
    return {
      s_state: 'S1',
      state_label: S_STATES.S1,
      state_reason: payload
        ? `Payload resolver returned not-ok: ${payload.error || 'unknown'}`
        : 'Payload not available',
      detection_path: 'PAYLOAD_NOT_OK',
    };
  }

  const qualifierSummary = payload.qualifier_summary || {};
  const qualifierClass = qualifierSummary.qualifier_class;

  if (qualifierClass === 'Q-01') {
    return {
      s_state: 'S3',
      state_label: S_STATES.S3,
      state_reason: 'All domains structurally grounded, full semantic continuity',
      detection_path: 'Q_CLASS_Q01',
    };
  }

  if (qualifierClass === 'Q-02' || qualifierClass === 'Q-03') {
    return {
      s_state: 'S2',
      state_label: S_STATES.S2,
      state_reason: qualifierClass === 'Q-02'
        ? 'Partial grounding with validated semantic continuity'
        : 'Semantic continuity only, no structural grounding',
      detection_path: `Q_CLASS_${qualifierClass.replace('-', '')}`,
    };
  }

  if (qualifierClass === 'Q-04') {
    return {
      s_state: 'S1',
      state_label: S_STATES.S1,
      state_reason: 'Evidence unavailable (Q-04)',
      detection_path: 'Q_CLASS_Q04',
    };
  }

  return {
    s_state: 'S1',
    state_label: S_STATES.S1,
    state_reason: `Unknown qualifier class: ${qualifierClass || 'none'}; fail-closed to S1`,
    detection_path: 'FAIL_CLOSED',
  };
}

function classifyAuthorizationFromSState(sState) {
  return AUTHORIZATION_MAP[sState] || AUTHORIZATION_MAP.S1;
}

function normalizeQualificationState(detection) {
  const auth = classifyAuthorizationFromSState(detection.s_state);
  const disclosures = GOVERNANCE_DISCLOSURES[detection.s_state] || [];
  return {
    s_state: detection.s_state,
    state_label: detection.state_label,
    state_reason: detection.state_reason,
    detection_path: detection.detection_path,
    authorization_tier: auth.authorization_tier,
    boardroom_readiness: auth.boardroom_readiness,
    projection_permission: auth.projection_permission,
    governance_disclosures: disclosures,
    missing_artifact: detection.missing_artifact || null,
  };
}

function runFullDetection(client, runId) {
  if (!isClientRunAllowed(client, runId)) {
    return {
      ok: false,
      error: 'CLIENT_RUN_NOT_REGISTERED',
      client,
      run_id: runId,
    };
  }

  const manifestResult = loadManifest(client, runId);
  if (!manifestResult.ok) {
    return {
      ok: true,
      client,
      run_id: runId,
      qualification: normalizeQualificationState(
        detectQualificationState({
          client, run: runId, manifest: null, loadResult: null, payload: null,
        })
      ),
      evidence: {
        manifest_registered: true,
        manifest_loaded: false,
        manifest_error: manifestResult.error,
      },
    };
  }

  const manifest = manifestResult.manifest;
  const loadResult = loadArtifacts(manifest);

  let payload = null;
  if (loadResult.ok) {
    try {
      payload = resolveSemanticPayload(manifest);
    } catch (_) {
      payload = null;
    }
  }

  const detection = detectQualificationState({
    client, run: runId, manifest, loadResult, payload,
  });
  const normalized = normalizeQualificationState(detection);

  const requiredKeys = REQUIRED_ARTIFACT_KEYS;
  const requiredDeclared = Object.keys(
    (manifest.artifacts && manifest.artifacts.required) || {}
  );
  const requiredPresent = [];
  const requiredMissing = [];
  for (const key of requiredKeys) {
    const sources = loadResult.sources || {};
    if (sources[key] && sources[key].ok) {
      requiredPresent.push(key);
    } else {
      requiredMissing.push(key);
    }
  }

  const qualifierSummary = (payload && payload.ok && payload.qualifier_summary) || {};

  return {
    ok: true,
    client,
    run_id: runId,
    qualification: normalized,
    evidence: {
      manifest_registered: true,
      manifest_loaded: true,
      required_artifacts_declared: requiredDeclared,
      required_artifacts_present: requiredPresent,
      required_artifacts_missing: requiredMissing,
      loader_status: loadResult.ok ? 'OK' : loadResult.error,
      binding_status: payload ? (payload.binding_status || (payload.ok ? 'LIVE' : 'REJECTED')) : 'NOT_RESOLVED',
      q_class: qualifierSummary.qualifier_class || 'NOT_AVAILABLE',
      qualifier_summary: qualifierSummary,
    },
  };
}

module.exports = {
  S_STATES,
  AUTHORIZATION_MAP,
  GOVERNANCE_DISCLOSURES,
  OPERATION_VERSION,
  detectQualificationState,
  classifyAuthorizationFromSState,
  normalizeQualificationState,
  runFullDetection,
};
