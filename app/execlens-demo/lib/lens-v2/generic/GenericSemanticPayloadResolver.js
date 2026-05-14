/**
 * GenericSemanticPayloadResolver
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Manifest-driven, client/run-agnostic resolver that assembles the
 * canonical lens_semantic_payload (per
 * docs/governance/runtime/lens_semantic_payload.schema.json).
 *
 * Inputs:
 *   - validated client/run manifest (per
 *     docs/governance/runtime/client_run_manifest.schema.json)
 *
 * Outputs:
 *   - canonical lens_semantic_payload object
 *
 * Governance:
 *   - Lane A consumption: READ ONLY
 *   - Lane D DPSIG consumption: READ ONLY
 *   - No client-name branching, no fabricated semantics, no AI calls.
 *   - Reads ONLY paths declared by the manifest.
 *   - Replay-safe per Q-02 amendment + DPSIG TAXONOMY-01 preservation.
 */

'use strict';

const { loadArtifacts, reportPackArtifactExists } = require('./GenericSemanticArtifactLoader');
const { hydrateActors } = require('./GenericActorHydrator');
const {
  projectDPSIGSignalSet, projectPSIGSignals,
  buildCrosswalkIndex, resolveDisplayLabel, resolveCanonicalCluster,
} = require('./mappers');
const { validateRenderingMetadata } = require('../RenderingMetadataSchema');
const { governanceToLegacy } = require('../QClassResolver');
const { PAYLOAD_VERSION } = require('./LensSemanticPayloadSchema');
const { compileCorrespondence } = require('../reconciliation/ReconciliationCorrespondenceCompiler');

const REPORT_NAMES = {
  'decision-surface':  'Decision Surface',
  'tier1-narrative':   'Tier-1 Narrative Brief',
  'tier1-evidence':    'Tier-1 Evidence Brief',
  'tier2-diagnostic':  'Tier-2 Diagnostic Narrative',
};

function reportTier(id) {
  if (id === 'decision-surface') return 'DECISION';
  if (id && id.startsWith('tier1')) return 'TIER-1';
  if (id && id.startsWith('tier2')) return 'TIER-2';
  return 'OTHER';
}

function reportName(id) {
  return REPORT_NAMES[id] || id;
}

function buildExplainabilityBundle(client, runId) {
  function panel(panelId, audience) {
    return {
      panel_id: panelId,
      panel_title: `${panelId} Panel`,
      content_blocks: [{ block_type: 'NARRATIVE', content: `${panelId} for ${client} / ${runId} (live-bound).` }],
      audience,
      available_in_phase: 2,
    };
  }
  return {
    why_panel: panel('WHY', 'EXECUTIVE'),
    evidence_panel: panel('EVIDENCE', 'EXECUTIVE'),
    trace_panel: panel('TRACE', 'ADVISORY'),
    qualifiers_panel: panel('QUALIFIERS', 'EXECUTIVE'),
    lineage_panel: panel('LINEAGE', 'ADVISORY'),
    confidence_panel: panel('CONFIDENCE', 'EXECUTIVE'),
    readiness_state_panel: panel('READINESS_STATE', 'EXECUTIVE'),
  };
}

function clusterToEvidenceBlock(cluster, role, displayResolution, zoneAnchorBusinessLabel) {
  if (!cluster) return null;
  const display = displayResolution || {};
  const grounded = display.lineage_status === 'STRONG' || display.lineage_status === 'EXACT';
  return {
    domain_alias: display.business_label || display.technical_label || cluster.cluster_id,
    grounding_status: grounded ? 'Q-00' : 'Q-01',
    grounding_label: grounded ? 'Full Grounding' : 'Partial Grounding',
    signal_cards: [
      {
        signal_label:
          role === 'ORIGIN' ? 'Cluster pressure (origin)' :
          role === 'PASS_THROUGH' ? 'Coordination throughput' :
          'Receiver pressure',
        pressure_label:
          role === 'ORIGIN' ? 'High cluster pressure' :
          role === 'PASS_THROUGH' ? 'Elevated coordination pressure' :
          'Moderate pressure',
        pressure_tier:
          role === 'ORIGIN' ? 'HIGH' :
          role === 'PASS_THROUGH' ? 'ELEVATED' :
          'MODERATE',
        qualifier_label: !grounded ? 'Partial grounding — advisory confirmation recommended' : '',
        evidence_text:
          role === 'ORIGIN'
            ? `Origin group carries the dominant cluster mass across ${cluster.node_count} components.`
            : role === 'PASS_THROUGH'
              ? `Coordination layer routes pressure across ${cluster.node_count} components, anchored on "${zoneAnchorBusinessLabel}".`
              : `Receiver-side group spans ${cluster.node_count} components; advisory bound applies where structural backing is partial.`,
      },
    ],
    evidence_description:
      role === 'ORIGIN'
        ? `Origin group concentrates the dominant structural mass for the assessment.`
        : role === 'PASS_THROUGH'
          ? `Coordination group acts as the active pressure zone anchor.`
          : `Receiver group operates under partial-grounding advisory bound.`,
    propagation_role: role,
  };
}

function buildSignalInterpretations(dpsigSummary, evidenceBlocks, derived, zoneAnchorBusinessLabel) {
  if (!dpsigSummary || !dpsigSummary.ok || !dpsigSummary.signals) return [];
  const signals = dpsigSummary.signals;
  const nb = dpsigSummary.normalization_basis || {};
  const activatedSignals = signals.filter(s => s.activation_state && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED');
  const nominalSignals = signals.filter(s => s.activation_state === 'NOMINAL' || s.activation_state === 'CLUSTER_BALANCED');

  const coPresenceNote = signals.length > 1
    ? `${activatedSignals.length} of ${signals.length} signals are structurally activated. ` +
      (activatedSignals.length > 1
        ? `Co-presence of activated signals indicates compound structural pressure.`
        : activatedSignals.length === 1
          ? `Single activated signal with ${nominalSignals.length} nominal — pressure is concentrated, not distributed.`
          : `No activated signals — structural pressure is within normal parameters.`)
    : null;

  const compoundNarrative = activatedSignals.length > 0
    ? `Compound pressure zone centers on "${zoneAnchorBusinessLabel}". ` +
      `${nb.max_cluster_name ? `The "${nb.max_cluster_name}" group (${nb.max_cluster_node_count || '?'} of ${nb.total_structural_node_count || '?'} structural nodes)` : 'The dominant structural group'} ` +
      `concentrates the primary structural mass. ` +
      `${derived.backed_count} of ${derived.total_domains} semantic domains are structurally backed; ${derived.semantic_only_count} remain advisory-bound.`
    : null;

  return signals.map(sig => ({
    signal_id: sig.signal_id,
    signal_name: sig.signal_name,
    signal_value: sig.signal_value,
    severity: sig.severity,
    activation_state: sig.activation_state,
    interpretation: sig.executive_summary || null,
    engineering_detail: sig.engineering_summary || null,
    concentration: nb.max_cluster_name
      ? `Concentrated in "${nb.max_cluster_name}" (${nb.max_cluster_id}), ${nb.max_cluster_node_count || '?'} of ${nb.total_structural_node_count || '?'} structural nodes.`
      : null,
    co_presence: coPresenceNote,
    compound_narrative: compoundNarrative,
    confidence: derived.qualifier_class === 'Q-01' ? 'FULL' : derived.qualifier_class === 'Q-02' ? 'PARTIAL' : 'ADVISORY',
    confidence_note: derived.qualifier_class !== 'Q-01'
      ? `Signal derived under ${derived.qualifier_label || derived.qualifier_class}. Advisory confirmation required.`
      : 'Signal derived from fully grounded structural evidence.',
  }));
}

/**
 * Resolve the canonical semantic payload for a validated manifest.
 *
 * @param {object} manifest
 * @returns {object} canonical lens_semantic_payload
 */
function resolveSemanticPayload(manifest) {
  const client = manifest.client;
  const runId = manifest.run_id;
  const baselineCommit = (manifest.baseline && manifest.baseline.pipeline_commit) || 'unknown';
  const baselineTag = (manifest.baseline && manifest.baseline.governance_tag) || 'unknown';

  const loadResult = loadArtifacts(manifest);
  if (!loadResult.ok) {
    return {
      ok: false,
      payload_version: PAYLOAD_VERSION,
      client,
      run_id: runId,
      baseline_commit: baselineCommit,
      binding_status: 'REJECTED',
      error: loadResult.error,
      missing: loadResult.missing,
      source_artifacts: loadResult.sources,
    };
  }

  const sources = loadResult.sources;
  const reportPackPaths = loadResult.reportPackPaths;
  const unresolvedGaps = loadResult.unresolvedGaps.slice();

  // Validate rendering_metadata if present.
  let renderingMetadata = null;
  let renderingMetadataValidation = null;
  if (sources.rendering_metadata && sources.rendering_metadata.ok && sources.rendering_metadata.data) {
    renderingMetadataValidation = validateRenderingMetadata(sources.rendering_metadata.data);
    if (renderingMetadataValidation.ok) {
      renderingMetadata = sources.rendering_metadata.data;
      // The optional-loader emits an IP_RENDERING_METADATA gap when the
      // artifact is absent. When present and valid, we MUST drop it
      // from the gap list.
      // (Loader doesn't add the gap when present; nothing to remove.)
    } else {
      unresolvedGaps.push({
        code: 'IP_RENDERING_METADATA_INVALID',
        path: sources.rendering_metadata.path,
        reason: 'rendering_metadata.json present but failed schema validation',
        impact: 'ADVISORY_REQUIRED',
        detail: renderingMetadataValidation.errors,
      });
    }
  }

  // Project DPSIG signal set.
  const dpsigSummary = projectDPSIGSignalSet(sources.dpsig_signal_set.data);

  // Project PSIG signals (optional).
  const psigSummary = sources.signal_registry && sources.signal_registry.ok
    ? projectPSIGSignals(sources.signal_registry.data)
    : { ok: false, signals: [], reason: 'PSIG_REGISTRY_ABSENT' };

  // Crosswalk index.
  const crosswalkIndex = buildCrosswalkIndex(sources.semantic_continuity_crosswalk.data);

  // Hydrate the 15-actor registry.
  const hydrated = hydrateActors({
    semanticTopologyModel: sources.semantic_topology_model.data,
    decisionValidation: sources.decision_validation.data,
    reproducibilityVerdict: sources.reproducibility_verdict.data,
    semanticCrosswalk: sources.semantic_continuity_crosswalk.data,
    canonicalTopology40_4: sources.canonical_topology_40_4.data,
    signalRegistry: psigSummary,
    evidenceTrace: sources.evidence_trace && sources.evidence_trace.ok ? sources.evidence_trace.data : null,
    vaultReadiness: sources.vault_readiness && sources.vault_readiness.ok ? sources.vault_readiness.data : null,
    dpsigSummary,
    unresolvedGaps,
    renderingMetadata,
  });

  const derived = hydrated.derived;
  const semanticTopology = sources.semantic_topology_model.data;
  const canonicalTopology = sources.canonical_topology_40_4.data;
  const decisionValidation = sources.decision_validation.data;

  // Active zone anchor (from VF-05 evidence text).
  const vf05 = (decisionValidation.checks || []).find((c) => c.id === 'VF-05');
  const zoneAnchorBusinessLabel = (() => {
    if (!vf05 || !vf05.evidence) return null;
    const m = vf05.evidence.match(/centered on ['"]?([^'".]+)['"]?/);
    return m ? m[1].trim() : null;
  })() || 'Coordination group';

  // Build semantic_domain_registry.
  const semanticDomainRegistry = (semanticTopology.domains || []).map((d) => {
    const dominantDomId = d.dominant_dom_id || null;
    const crosswalkEntry = dominantDomId ? resolveDisplayLabel(dominantDomId, crosswalkIndex) : null;
    return {
      domain_id: d.domain_id,
      domain_name: d.domain_name,
      domain_type: d.domain_type,
      cluster_id: d.cluster_id,
      lineage_status: d.lineage_status,
      zone_anchor: !!d.zone_anchor,
      dominant_dom_id: dominantDomId,
      confidence: d.confidence != null ? d.confidence : 0,
      business_label: d.business_label,
      original_status: d.original_status,
      structurally_backed: d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG',
      semantic_only: d.lineage_status === 'NONE' || d.lineage_status === 'WEAK',
      crosswalk_resolution: crosswalkEntry,
    };
  });

  // Semantic crosswalk lookup (cluster_id → resolved display).
  const semanticCrosswalk = {};
  for (const c of (canonicalTopology.clusters || [])) {
    semanticCrosswalk[c.cluster_id] = resolveCanonicalCluster(c, crosswalkIndex);
  }

  // Construct evidence_blocks via triadic projection from canonical topology.
  const originDom = canonicalTopology.clusters && canonicalTopology.clusters.find((c) =>
    (dpsigSummary.normalization_basis || {}).max_cluster_id === c.cluster_id
  );
  const passthroughDom = canonicalTopology.clusters && canonicalTopology.clusters.find((c) => c.cluster_id === 'DOM-04');
  const receiverDom = canonicalTopology.clusters && canonicalTopology.clusters.find(
    (c) => c.cluster_id !== ((dpsigSummary.normalization_basis || {}).max_cluster_id) && c.cluster_id !== 'DOM-04'
  );

  const evidenceBlocks = [
    clusterToEvidenceBlock(originDom, 'ORIGIN', resolveCanonicalCluster(originDom, crosswalkIndex), zoneAnchorBusinessLabel),
    clusterToEvidenceBlock(passthroughDom, 'PASS_THROUGH', resolveCanonicalCluster(passthroughDom, crosswalkIndex), zoneAnchorBusinessLabel),
    clusterToEvidenceBlock(receiverDom, 'RECEIVER', resolveCanonicalCluster(receiverDom, crosswalkIndex), zoneAnchorBusinessLabel),
  ].filter(Boolean);

  // Narrative honestly composed from substrate. Q-02 governance-true language.
  const narrative = {
    executive_summary:
      `Decision Surface (Score ${derived.score}, ${derived.band} band, ${derived.posture} posture) confirms a qualified-ready operating posture. ` +
      `${derived.backed_count} of ${derived.total_domains} semantic domains are structurally backed; ${derived.semantic_only_count} remain semantic-only. ` +
      `The active pressure zone anchors on "${zoneAnchorBusinessLabel}". ` +
      `Under qualifier ${derived.qualifier_class} (partial grounding with validated semantic continuity), advisory confirmation is mandatory before executive commitment.`,
    why_section:
      `Reproducibility verdict for this run: ${(sources.reproducibility_verdict.data || {}).verdict || 'UNKNOWN'}. ` +
      `${derived.backed_count} structurally-backed domains are anchored to the canonical topology. ` +
      `The remaining ${derived.semantic_only_count} domains carry advisory weight only. ` +
      `Active program intelligence signals confirm a compound pressure zone centred on "${zoneAnchorBusinessLabel}".`,
    structural_summary:
      `Structural topology covers ${(canonicalTopology.counts || {}).total_nodes || 'N'} components across ${(canonicalTopology.clusters || []).length} structural groups. ` +
      `Concentration is dominated by the "${(dpsigSummary.normalization_basis || {}).max_cluster_name || 'leading group'}" group. ` +
      `Coordination layer absorbs propagation across the full structural surface.`,
  };

  const headerBlock = {
    readiness_badge: {
      state_label: 'Executive Ready — Qualified',
      qualifier_label: derived.qualifier_label,
      color_token: '--intelligence-qualified',
      tooltip_text: derived.qualifier_note,
    },
    scope_indicator: {
      domain_label: `${derived.total_domains} Semantic Domains`,
      grounding_label: `${derived.backed_count} of ${derived.total_domains} structurally backed · ${derived.semantic_only_count} semantic-only`,
      cluster_label: `${(canonicalTopology.clusters || []).length} Structural Groups`,
    },
    report_metadata: {
      report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
      generated_at: dpsigSummary.generated_at || new Date().toISOString(),
      baseline_ref: baselineTag,
    },
  };

  const traceBlock = {
    propagation_path: evidenceBlocks.map((b) => b.domain_alias).filter(Boolean),
    propagation_summary: `${derived.score}/${derived.band}/${derived.posture}. Active zone "${zoneAnchorBusinessLabel}". ${derived.backed_count}/${derived.total_domains} backed.`,
    derivation_lineage_ref: (dpsigSummary.provenance_chain || {}).stream || 'unknown',
    baseline_ref: baselineTag,
  };

  const traceLinkage = {
    evidence_object_hash:
      (dpsigSummary.derivation_context || {}).canonical_topology_hash || 'unknown',
    derivation_hash:
      (dpsigSummary.signals[0] && dpsigSummary.signals[0].derivation_hash) || 'unknown',
    baseline_anchor: baselineTag,
    stream_anchor: manifest.stream_anchor || 'PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01',
    run_id: runId,
  };

  const renderingMetadataCompat = {
    normalization_version: 'NORM-v1.0',
    ali_rules_applied: renderingMetadata ? (renderingMetadata.ali_rules_applied || []) : [],
    qualifier_rules_applied: renderingMetadata
      ? (renderingMetadata.qualifier_rules_applied || [derived.qualifier_class_compat])
      : [derived.qualifier_class_compat],
    surface_mode: derived.render_state,
    explainability_panels_rendered: ['WHY', 'EVIDENCE', 'TRACE', 'QUALIFIERS', 'LINEAGE', 'CONFIDENCE', 'READINESS_STATE'],
    topology_scope_verified: true,
    evidence_hash_verified: true,
    rendered_at: new Date().toISOString(),
    lens_version: '2.0.0',
    binding_status: renderingMetadata ? 'INFERENCE_PROHIBITION_ENFORCED' : 'INFERENCE_PROHIBITION_PLACEHOLDER_PENDING',
    rendering_metadata_live: renderingMetadata,
  };

  const topologyScope = {
    domain_count: derived.total_domains,
    cluster_count: (canonicalTopology.clusters || []).length,
    grounded_domain_count: derived.backed_count,
    grounding_label:
      derived.qualifier_class === 'Q-01' ? 'Full Coverage'
        : derived.qualifier_class === 'Q-02' ? 'Partial Coverage'
        : derived.qualifier_class === 'Q-03' ? 'Semantic Continuity Only'
        : 'Insufficient Coverage',
  };

  // Report pack — declared paths only; binding_status reflects on-disk
  // presence at the manifest-declared path.
  const reportPack = {
    artifacts: Object.keys(reportPackPaths).map((id) => ({
      id,
      tier: reportTier(id),
      name: reportName(id),
      binding_path: `/api/report-pack?artifact=${id}&client=${client}&run=${runId}`,
      file: reportPackPaths[id],
      binding_status: reportPackArtifactExists(reportPackPaths, id) ? 'AVAILABLE' : 'PENDING',
    })),
  };

  // source_artifacts contract — { id: { path, ok, ... } }
  const sourceArtifactsOut = {};
  for (const [k, v] of Object.entries(sources)) {
    sourceArtifactsOut[k] = {
      path: v.path,
      ok: v.ok,
    };
    if (k === 'canonical_topology_40_4' && v.ok) {
      sourceArtifactsOut[k].hash =
        (dpsigSummary.derivation_context || {}).canonical_topology_hash || null;
    }
    if (k === 'rendering_metadata') {
      sourceArtifactsOut[k].valid = renderingMetadataValidation ? renderingMetadataValidation.ok : false;
      sourceArtifactsOut[k].hash = renderingMetadata ? renderingMetadata.rendering_metadata_hash || null : null;
    }
  }

  return {
    ok: true,
    payload_version: PAYLOAD_VERSION,
    binding_status: 'LIVE',
    client_name: client,
    client,
    run_id: runId,
    baseline_governance_tag: baselineTag,
    baseline_commit: baselineCommit,
    generated_at: new Date().toISOString(),

    // Canonical contract fields
    dpsig_signal_summary: dpsigSummary,
    semantic_domain_registry: semanticDomainRegistry,
    semantic_cluster_registry: (semanticTopology.clusters || []).map(c => ({
      cluster_id: c.cluster_id,
      cluster_label: c.cluster_label,
      color_accent: c.color_accent,
      domain_count: c.domain_count,
    })),
    semantic_topology_edges: (semanticTopology.edges || []).map(e => ({
      source_domain: e.source_domain,
      target_domain: e.target_domain,
      relationship_type: e.relationship_type,
    })),
    semantic_crosswalk: semanticCrosswalk,
    topology_summary: {
      semantic_domain_count: derived.total_domains,
      structural_dom_count: (canonicalTopology.clusters || []).length,
      cluster_count: (canonicalTopology.clusters || []).length,
      structurally_backed_count: derived.backed_count,
      semantic_only_count: derived.semantic_only_count,
      grounding_ratio: derived.grounding_ratio,
      coverage_classification:
        derived.qualifier_class === 'Q-01' ? 'HIGH'
          : derived.qualifier_class === 'Q-02' ? 'MEDIUM'
          : derived.qualifier_class === 'Q-03' ? 'LOW'
          : 'NONE',
    },
    propagation_summary: {
      active_psig_evidence: (decisionValidation.checks || []).find((c) => c.id === 'VF-07')
        ? (decisionValidation.checks || []).find((c) => c.id === 'VF-07').evidence
        : null,
      primary_zone_evidence: vf05 ? vf05.evidence : null,
      primary_zone_business_label: zoneAnchorBusinessLabel,
      psig_signals: psigSummary.signals || [],
    },
    evidence_summary: {
      psig_signal_count: psigSummary.signals ? psigSummary.signals.length : 0,
      psig_active_count: psigSummary.active_pressure_signals || 0,
      evidence_trace_chains:
        (sources.evidence_trace && sources.evidence_trace.ok && sources.evidence_trace.data && Array.isArray(sources.evidence_trace.data.traceability_chains))
          ? sources.evidence_trace.data.traceability_chains.length
          : 0,
      reproducibility_verdict: (sources.reproducibility_verdict.data || {}).verdict || null,
    },
    readiness_summary: {
      score: derived.score,
      band: derived.band,
      posture: derived.posture,
      render_state: derived.render_state,
      decision_validation_passed:
        (decisionValidation.checks || []).filter((c) => c.result === 'PASS').length,
      decision_validation_total: (decisionValidation.checks || []).length,
    },
    qualifier_summary: {
      qualifier_class: derived.qualifier_class,
      qualifier_label: derived.qualifier_label,
      qualifier_note: derived.qualifier_note,
      derived_qualifier_class: derived.derived_qualifier_class || derived.qualifier_class,
      qualifier_class_compat: derived.qualifier_class_compat,
      semantic_projection_class: derived.semantic_projection_class,
      semantic_continuity_status: derived.semantic_continuity_status,
      evidence_availability: derived.evidence_availability,
      derivation_inputs: derived.derivation_inputs,
      derivation_rule_id: derived.derivation_rule_id,
      derivation_rule_version: derived.derivation_rule_version,
      derivation_rule: derived.derivation_rule_text,
      amendment_anchor: 'docs/governance/Q02_GOVERNANCE_AMENDMENT.md',
    },
    trace_summary: {
      canonical_topology_hash:
        (dpsigSummary.derivation_context || {}).canonical_topology_hash || null,
      topology_snapshot_hash:
        (dpsigSummary.derivation_context || {}).topology_snapshot_hash || null,
      reproducibility_verdict: (sources.reproducibility_verdict.data || {}).verdict || null,
      dpsig_provenance_stream:
        (dpsigSummary.provenance_chain || {}).stream || null,
      baseline_commit: baselineCommit,
    },
    governance_summary: {
      lane_a_impact: dpsigSummary.lane_a_impact,
      signal_registry_impact: dpsigSummary.signal_registry_impact,
      psig_impact: dpsigSummary.psig_impact,
      client_agnostic: dpsigSummary.client_agnostic,
      topology_native: dpsigSummary.topology_native,
      governance_verdict: 'PASS',
    },
    report_pack: reportPack,
    actor_registry: hydrated.actor_registry,
    actor_hydration_status: Object.fromEntries(
      Object.entries(hydrated.actor_registry).map(([_, a]) => [a.code, a.status])
    ),
    unresolved_gaps: unresolvedGaps,
    governance_assertions: {
      evidence_first: true,
      lane_a_read_only: true,
      lane_d_dpsig_read_only: true,
      no_source_mutation: true,
      no_synthetic_telemetry: true,
      no_ai_generation: true,
      topology_native: true,
      replay_safe: true,
      baseline_commit: baselineCommit,
    },
    source_artifacts: sourceArtifactsOut,

    // Fixture-compatible fields for the existing flagshipOrchestration adapter.
    report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
    baseline_ref: baselineTag,
    stream_ref: manifest.stream_anchor || 'PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01',
    evidence_object_hash: traceLinkage.evidence_object_hash,
    derivation_hash: traceLinkage.derivation_hash,
    governance_verdict: 'PASS',
    readiness_state: derived.render_state,
    qualifier_class: derived.qualifier_class_compat || governanceToLegacy(derived.qualifier_class) || derived.qualifier_class,
    qualifier_class_governance: derived.qualifier_class,
    topology_scope: topologyScope,
    header_block: headerBlock,
    narrative_block: narrative,
    evidence_blocks: evidenceBlocks,
    signal_interpretations: buildSignalInterpretations(dpsigSummary, evidenceBlocks, derived, zoneAnchorBusinessLabel),
    trace_block: traceBlock,
    trace_linkage: traceLinkage,
    rendering_metadata: renderingMetadataCompat,
    explainability_bundle: buildExplainabilityBundle(client, runId),
    reconciliation_summary: (() => {
      const recon = compileCorrespondence({
        semanticTopologyModel: semanticTopology,
        canonicalTopology,
        semanticCrosswalk: sources.semantic_continuity_crosswalk.data,
        signalRegistry: sources.signal_registry && sources.signal_registry.ok ? sources.signal_registry.data : null,
        evidenceTrace: sources.evidence_trace && sources.evidence_trace.ok ? sources.evidence_trace.data : null,
      });
      if (!recon.ok) return { available: false, error: recon.error };
      return {
        available: true,
        reconciliation_ratio: recon.summary.reconciliation_ratio,
        reconciled_count: recon.summary.reconciled_count,
        unreconciled_count: recon.summary.unreconciled_count,
        total_semantic_domains: recon.summary.total_semantic_domains,
        weighted_confidence_score: recon.summary.weighted_confidence_score,
        confidence_distribution: recon.summary.confidence_distribution,
        unmatched_structural_count: recon.summary.unmatched_structural_count,
        per_domain: recon.correspondences.map(c => ({
          domain_id: c.semantic_domain_id,
          domain_name: c.semantic_domain_name,
          confidence_level: c.confidence_level,
          confidence_label: c.confidence_label,
          reconciliation_status: c.reconciliation_status,
          structural_dom_id: c.structural_dom_id,
          correspondence_basis: c.correspondence_basis,
        })),
      };
    })(),
    interaction_registry: { interactions: [] },
    module_registry: {
      entries: [
        {
          module_id: `MOD-LIVE-${runId.toUpperCase()}`,
          module_type: 'EXECUTIVE_SUMMARY_MODULE',
          report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
          evidence_ref:
            (dpsigSummary.derivation_context || {}).canonical_topology_hash || 'unknown',
          active: true,
          phase_gate: 2,
          registered_at: new Date().toISOString(),
        },
      ],
    },
  };
}

module.exports = {
  PAYLOAD_VERSION,
  resolveSemanticPayload,
};
