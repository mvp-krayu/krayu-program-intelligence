/**
 * DPSIGSignalMapper
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * Map a DPSIG signal set into a LENS V2 signal stack summary.
 * Preserves DPSIG id, signal_value, severity, activation_state, replay_class,
 * denominator_guard, derivation_trace, provenance_chain, topology-native
 * status, and Lane A impact NONE.
 *
 * Governance: pure projection. No fabrication. Replay-safe fields preserved
 * verbatim. No mutation of source DPSIG signal set.
 */

'use strict';

/**
 * Project a single DPSIG signal entry into the LENS V2 signal stack shape.
 */
function projectDPSIGSignal(entry) {
  if (!entry) return null;
  return {
    signal_id: entry.signal_id || null,
    signal_class: entry.signal_class || null,
    signal_name: entry.signal_name || null,
    formula: entry.formula || null,
    activation_method: entry.activation_method || null,
    threshold_high: entry.threshold_high != null ? entry.threshold_high : null,
    threshold_elevated: entry.threshold_elevated != null ? entry.threshold_elevated : null,
    signal_value: entry.signal_value != null ? entry.signal_value : null,
    activation_state: entry.activation_state || null,
    severity: entry.severity || null,
    replay_class: entry.replay_class || null,
    lens_tier: Array.isArray(entry.lens_tier) ? entry.lens_tier : [],
    denominator_guard: entry.denominator_guard || null,
    derivation_trace: entry.derivation_trace || null,
    explainability_render: entry.explainability_render || null,
    executive_summary: entry.executive_summary || null,
    engineering_summary: entry.engineering_summary || null,
    derivation_summary: entry.derivation_summary || null,
    signal_stable_key: entry.signal_stable_key || null,
    derivation_hash: entry.derivation_hash || null,
  };
}

/**
 * Project the DPSIG signal set into the LENS V2 dpsig_signal_summary shape.
 * Returns { ok, signals, derivation_summary, normalization_basis, provenance_chain,
 *           replay_taxonomy, topology_native, lane_a_impact, ... }
 */
function projectDPSIGSignalSet(dpsigData) {
  if (!dpsigData || typeof dpsigData !== 'object') {
    return { ok: false, signals: [], reason: 'DPSIG_SET_MISSING_OR_INVALID' };
  }
  const signals = Array.isArray(dpsigData.signal_entries)
    ? dpsigData.signal_entries.map(projectDPSIGSignal).filter(Boolean)
    : [];
  return {
    ok: true,
    schema_version: dpsigData.schema_version || null,
    script_version: dpsigData.script_version || null,
    client_id: dpsigData.client_id || null,
    run_id: dpsigData.run_id || null,
    generated_at: dpsigData.generated_at || null,
    derivation_context: dpsigData.derivation_context || null,
    normalization_basis: dpsigData.normalization_basis || null,
    derivation_summary: dpsigData.derivation_summary || null,
    replay_taxonomy: dpsigData.replay_taxonomy || null,
    provenance_chain: dpsigData.provenance_chain || null,
    signals,
    primary_signal: signals[0] || null,
    activated_count:
      (dpsigData.derivation_summary && dpsigData.derivation_summary.signals_activated) || 0,
    derived_count:
      (dpsigData.derivation_summary && dpsigData.derivation_summary.signals_derived) || signals.length,
    severity_band:
      (dpsigData.derivation_summary && dpsigData.derivation_summary.severity_band) || null,
    topology_native:
      !!(dpsigData.provenance_chain && dpsigData.provenance_chain.topology_native),
    client_agnostic:
      !!(dpsigData.provenance_chain && dpsigData.provenance_chain.client_agnostic),
    lane_a_impact:
      (dpsigData.provenance_chain && dpsigData.provenance_chain.lane_a_impact) || 'UNKNOWN',
    signal_registry_impact:
      (dpsigData.provenance_chain && dpsigData.provenance_chain.signal_registry_impact) || 'UNKNOWN',
    psig_impact:
      (dpsigData.provenance_chain && dpsigData.provenance_chain.psig_impact) || 'UNKNOWN',
    baseline_commit:
      (dpsigData.provenance_chain && dpsigData.provenance_chain.baseline_commit) || null,
  };
}

/**
 * Project PSIG signal_registry signals into a parallel summary.
 */
function projectPSIGSignals(signalRegistryData) {
  if (!signalRegistryData || !Array.isArray(signalRegistryData.signals)) {
    return { ok: false, signals: [], reason: 'PSIG_REGISTRY_MISSING_OR_INVALID' };
  }
  return {
    ok: true,
    contract_id: signalRegistryData.contract_id || null,
    schema_version: signalRegistryData.schema_version || null,
    block: signalRegistryData.block || null,
    generated_date: signalRegistryData.generated_date || null,
    run_id: signalRegistryData.run_id || null,
    signal_authority: signalRegistryData.signal_authority || null,
    total_signals: signalRegistryData.total_signals || 0,
    active_pressure_signals: signalRegistryData.active_pressure_signals || 0,
    signals: signalRegistryData.signals.map((s) => ({
      signal_id: s.signal_id || null,
      signal_label: s.signal_label || null,
      activation_state: s.activation_state || null,
      signal_value: s.signal_value != null ? s.signal_value : null,
      activation_method: s.activation_method || null,
      threshold: s.threshold != null ? s.threshold : null,
      population_type: s.population_type || null,
      population_size: s.population_size != null ? s.population_size : null,
      primary_entity: s.primary_entity || null,
      primary_domain: s.primary_domain || null,
      zone_id: s.zone_id || null,
      zone_class: s.zone_class || null,
      source_traceability: s.source_traceability || null,
      runtime_required: !!s.runtime_required,
    })),
  };
}

module.exports = {
  projectDPSIGSignal,
  projectDPSIGSignalSet,
  projectPSIGSignals,
};
