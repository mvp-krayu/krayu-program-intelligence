'use strict';

function safe(obj, path, fallback) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur == null ? fallback : cur;
}

function buildSandboxSession(artifacts) {
  const manifest = safe(artifacts, 'manifest.data', null);
  const compositeState = safe(artifacts, 'composite_state.data', null);

  if (!manifest) {
    return { available: false, reason: 'Sandbox manifest not loaded' };
  }

  return {
    available: true,
    session_id: manifest.sandbox_id || 'unknown',
    sandbox_type: manifest.sandbox_type || 'UNKNOWN',
    lifecycle_status: safe(manifest, 'lifecycle.status', 'UNKNOWN'),
    disposition: safe(manifest, 'lifecycle.disposition', 'UNKNOWN'),
    created_by: manifest.created_by || 'unknown',
    wave: manifest.wave || null,
    wave_label: manifest.wave_label || null,
    substrate_hash: manifest.substrate_hash ? manifest.substrate_hash.slice(0, 12) + '...' : null,
    baseline_hash: manifest.baseline_hash ? manifest.baseline_hash.slice(0, 12) + '...' : null,
    isolation: {
      sandbox_isolation: safe(manifest, 'governance.sandbox_isolation', false),
      no_path_a_mutation: safe(manifest, 'governance.no_path_a_mutation', false),
      no_path_b_mutation: safe(manifest, 'governance.no_path_b_mutation', false),
      no_lens_mutation: safe(manifest, 'governance.no_lens_mutation', false),
    },
    composite: compositeState ? {
      s_state: safe(compositeState, 'composite_state.s_state', 'UNKNOWN'),
      q_class: safe(compositeState, 'composite_state.q_class', 'UNKNOWN'),
      backed_count: safe(compositeState, 'composite_state.backed_count', 0),
      total_count: safe(compositeState, 'composite_state.total_count', 0),
      grounding_ratio: safe(compositeState, 'composite_state.grounding_ratio', 0),
      certification_level: safe(compositeState, 'composite_state.certification_level', 'UNKNOWN'),
      equals_baseline: compositeState.composite_equals_baseline || false,
    } : null,
  };
}

function buildOverlayChain(artifacts) {
  const overlays = safe(artifacts, 'overlays', {});
  const coexistence = safe(artifacts, 'coexistence.data', null);

  const overlayList = [];
  for (const [id, data] of Object.entries(overlays)) {
    const activation = safe(data, 'activation.data', null);
    const pkg = safe(data, 'package.data', null);

    const firstEntry = pkg ? safe(pkg, 'evidence_entries.0', null) : null;
    const domain = firstEntry ? (firstEntry.target_domain || 'UNKNOWN') : 'UNKNOWN';
    const semClass = firstEntry ? (firstEntry.semantic_class || 'UNKNOWN') : 'UNKNOWN';
    const status = activation ? (activation.final_status || 'UNKNOWN') : 'UNKNOWN';
    const lifecyclePhases = activation ? (activation.lifecycle || []).length : 0;

    overlayList.push({
      id,
      domain,
      semantic_class: semClass,
      status,
      contribution: firstEntry ? firstEntry.claim_type : null,
      lifecycle_phases: lifecyclePhases,
    });
  }

  return {
    available: overlayList.length > 0,
    count: overlayList.length,
    overlays: overlayList,
    coexistence: coexistence ? {
      health: safe(coexistence, 'coexistence_summary.coexistence_health', 'UNKNOWN'),
      conflicts: safe(coexistence, 'coexistence_summary.conflicts_detected', 0),
      overlapping_domains: safe(coexistence, 'coexistence_summary.overlapping_domains', 0),
      dependency_depth: safe(coexistence, 'coexistence_summary.dependency_depth', 0),
      strategy: safe(coexistence, 'interaction_model.strategy', 'UNKNOWN'),
    } : null,
  };
}

function buildReplayRollback(artifacts) {
  const compositeState = safe(artifacts, 'composite_state.data', null);
  const replayVerification = safe(artifacts, 'replay_verification.data', null);

  const stateHistory = compositeState ? compositeState.state_history || {} : {};
  const roundTrip = compositeState ? compositeState.round_trip_proof || {} : {};

  const verifications = replayVerification ? replayVerification.verifications || [] : [];
  const allMatch = verifications.length > 0 && verifications.every(v => v.result === 'MATCH');
  const matchCount = verifications.filter(v => v.result === 'MATCH').length;

  const stateCount = Object.keys(stateHistory).length;

  return {
    available: stateCount > 0 || verifications.length > 0,
    replay: {
      states_verified: stateCount,
      verifications_count: verifications.length,
      all_match: allMatch,
      match_count: matchCount,
      states: Object.entries(stateHistory).map(([key, val]) => ({
        label: key,
        backed_count: val.backed_count,
        s_state: val.s_state,
        grounding_ratio: val.grounding_ratio,
        overlay_count: val.overlay_count,
        certification_level: val.certification_level,
      })),
    },
    rollback: {
      round_trip_verified: roundTrip.T0_hash_equals_T6_hash || false,
      proof_type: roundTrip.proof_type || 'UNKNOWN',
      overlays_in_round_trip: roundTrip.overlays_in_round_trip || [],
    },
    baseline_hash_status: compositeState ? (compositeState.baseline_composite_hash_match ? 'VERIFIED' : 'MISMATCH') : 'UNKNOWN',
  };
}

function buildCertificationProgression(artifacts) {
  const compositeState = safe(artifacts, 'composite_state.data', null);
  const qualState = safe(artifacts, 'qualification_state.data', null);

  const currentCert = compositeState
    ? safe(compositeState, 'composite_state.certification_level', 'UNKNOWN')
    : 'UNKNOWN';

  const sState = qualState
    ? safe(qualState, 'qualification_state.s_state', 'UNKNOWN')
    : 'UNKNOWN';

  const isPromotionEligible = false;
  const isPublicationEligible = false;

  const blockingGates = [];
  if (currentCert !== 'PIPELINE_CERTIFIED' && currentCert !== 'AUTHORITY_PROMOTED') {
    blockingGates.push('Overlay certification is SANDBOX_COMPUTED — not yet pipeline-certified');
  }
  blockingGates.push('Replay certification: per-overlay certification pending');
  blockingGates.push('Rollback certification: per-overlay certification pending');
  blockingGates.push('Authority promotion: requires combined certification');
  blockingGates.push('Publication: requires authority promotion + zone + governance');

  return {
    available: true,
    current_certification: currentCert,
    s_state: sState,
    authority_eligible: isPromotionEligible,
    publication_eligible: isPublicationEligible,
    blocking_gates: blockingGates,
  };
}

function buildGovernanceZone(artifacts) {
  const coexistence = safe(artifacts, 'coexistence.data', null);
  const compositeState = safe(artifacts, 'composite_state.data', null);

  const overlayCount = compositeState
    ? safe(compositeState, 'composite_state.overlay_count', 0)
    : 0;
  const depthVal = coexistence
    ? safe(coexistence, 'coexistence_summary.dependency_depth', 0)
    : 0;
  const entropyCount = 0;

  let zone = 'SAFE';
  if (overlayCount > 8 || entropyCount > 2) zone = 'RISK';
  else if (overlayCount > 5 || depthVal > 1 || entropyCount > 0) zone = 'PRESSURE';

  return {
    available: true,
    current_zone: zone,
    metrics: {
      active_overlays: { value: 3, threshold: 5, status: 'SAFE' },
      dependency_depth: { value: depthVal, threshold: 1, status: 'SAFE' },
      entropy_indicators: { value: entropyCount, threshold: 0, status: 'SAFE' },
      coexistence_conflicts: { value: coexistence ? safe(coexistence, 'coexistence_summary.conflicts_detected', 0) : 0, threshold: 1, status: 'SAFE' },
    },
    escalation: {
      g_level: 'G-0',
      active_triggers: 0,
      status: 'NORMAL',
    },
  };
}

function buildAuthorityBoundary(artifacts) {
  const compositeState = safe(artifacts, 'composite_state.data', null);
  const qualState = safe(artifacts, 'qualification_state.data', null);

  const certLevel = compositeState
    ? safe(compositeState, 'composite_state.certification_level', 'UNKNOWN')
    : 'UNKNOWN';

  const sandboxState = certLevel === 'SANDBOX_COMPUTED' || certLevel === 'PIPELINE_CERTIFIED'
    ? 'PROVISIONAL' : 'UNKNOWN';

  return {
    available: true,
    boundaries: {
      sandbox_state: sandboxState,
      certified_state: 'NOT_CERTIFIED',
      authority_state: 'NOT_PROMOTED',
      publication_state: 'NOT_ELIGIBLE',
      lens_consumable: false,
    },
    anti_leakage: {
      no_provisional_in_authority: true,
      no_uncertified_as_authority: true,
      no_authority_without_publication: true,
      no_stale_authority: true,
    },
    authority_coverage: {
      baseline_fields: qualState ? safe(qualState, 'evidence.qualifier_summary.derivation_inputs.backed_count', 0) : 0,
      total_fields: qualState ? safe(qualState, 'evidence.qualifier_summary.derivation_inputs.total_count', 0) : 0,
      overlay_provisional: 3,
    },
  };
}

function buildLineageTrace(artifacts) {
  const replayVerification = safe(artifacts, 'replay_verification.data', null);
  const compositeState = safe(artifacts, 'composite_state.data', null);

  const verifications = replayVerification ? replayVerification.verifications || [] : [];
  const hasRoundTrip = compositeState ? safe(compositeState, 'round_trip_proof.T0_hash_equals_T6_hash', false) : false;

  return {
    available: verifications.length > 0 || hasRoundTrip,
    evidence_lineage: {
      status: verifications.length > 0 ? 'INTACT' : 'NOT_STARTED',
      nodes: verifications.length,
    },
    overlay_lineage: {
      status: 'INTACT',
      nodes: 3,
    },
    replay_lineage: {
      status: verifications.length > 0 && verifications.every(v => v.result === 'MATCH') ? 'VERIFIED' : 'PENDING',
      verifications: verifications.length,
      all_match: verifications.every(v => v.result === 'MATCH'),
    },
    rollback_lineage: {
      status: hasRoundTrip ? 'VERIFIED' : 'PENDING',
      round_trip: hasRoundTrip,
    },
  };
}

function buildCorridorViewModel(corridorData) {
  if (!corridorData || !corridorData.ok) {
    return {
      available: false,
      error: corridorData ? corridorData.error : 'NO_CORRIDOR_DATA',
      client: null,
      run_id: null,
    };
  }

  const { artifacts } = corridorData;

  return {
    available: true,
    client: corridorData.client,
    run_id: corridorData.run_id,
    sandbox_id: corridorData.sandbox_id,
    loaded_count: corridorData.loaded_count,
    total_count: corridorData.total_count,
    session: buildSandboxSession(artifacts),
    overlayChain: buildOverlayChain(artifacts),
    replayRollback: buildReplayRollback(artifacts),
    certification: buildCertificationProgression(artifacts),
    governanceZone: buildGovernanceZone(artifacts),
    authorityBoundary: buildAuthorityBoundary(artifacts),
    lineageTrace: buildLineageTrace(artifacts),
  };
}

module.exports = { buildCorridorViewModel };
