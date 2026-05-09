/**
 * SemanticActorHydrator
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * Hydrate the 15 LENS V2 semantic actors from BlueEdge productized substrate.
 *
 * Each actor is classified into:
 *   HYDRATED                       — direct binding from a real artifact
 *   HYDRATED_WITH_DERIVATION        — derived via a documented rule
 *   PLACEHOLDER_BINDING_PENDING     — substrate not yet vault-written (IP)
 *   PRESENTATION_LAYER_DERIVED      — surfaced by /api/report-pack (RA)
 *
 * Governance: every actor carries source paths + governance assertions.
 * No fabrication. Honest binding state.
 */

'use strict';

/**
 * Compute qualifier_class from grounding_ratio.
 *
 * NOTE on governance: only Q-00 and Q-01 are currently amended in governance.
 * Q-02 is an exploratory class (proposed for ratio < 0.6) but requires
 * a separate governance amendment before it can be rendered in the executive
 * surface. Until then we map all partial-grounding states to Q-01 to remain
 * compatible with the existing rendering orchestrator and Path A.5.
 *
 *   ratio == 1.0   → Q-00 (Full Grounding)
 *   [0.0, 1.0)     → Q-01 (Partial Grounding · advisory bound)
 *
 * The richer Q-02 derivation is exposed in the `derived_qualifier_class`
 * field for consumers that have governance authority to use it.
 */
function deriveQualifierClass(groundedCount, totalCount) {
  const total = Math.max(1, totalCount || 0);
  const ratio = (groundedCount || 0) / total;
  if (ratio >= 1.0) {
    return {
      qualifier_class: 'Q-00',
      qualifier_label: 'Full Grounding',
      qualifier_note: 'All semantic domains structurally backed.',
      ratio,
      derived_qualifier_class: 'Q-00',
    };
  }
  // Q-02 candidate (exploratory, not yet amended in governance)
  const exploratoryQ02 = ratio < 0.6;
  return {
    qualifier_class: 'Q-01',
    qualifier_label: 'Partial Grounding · advisory bound',
    qualifier_note:
      exploratoryQ02
        ? 'Most semantic domains are semantic-only. Executive action requires advisory confirmation. (Exploratory: would map to Q-02 under proposed governance amendment.)'
        : 'Some semantic domains lack structural backing. Advisory confirmation recommended.',
    ratio,
    derived_qualifier_class: exploratoryQ02 ? 'Q-02' : 'Q-01',
  };
}

/**
 * Derive render_state from decision_validation band + posture.
 */
function deriveRenderState(band, posture, qualifierClass) {
  const b = (band || '').toUpperCase();
  const p = (posture || '').toUpperCase();
  if (b === 'CONDITIONAL' && p === 'INVESTIGATE') {
    return 'EXECUTIVE_READY_WITH_QUALIFIER';
  }
  if (b === 'FAVORABLE' && p === 'AUTHORIZE') {
    return 'EXECUTIVE_READY';
  }
  if (b === 'ESCALATED' && p === 'HALT') {
    return 'BLOCKED';
  }
  if (b === 'DIAGNOSTIC' || (qualifierClass === 'Q-02' && p === 'INVESTIGATE')) {
    return 'DIAGNOSTIC_ONLY';
  }
  return 'EXECUTIVE_READY_WITH_QUALIFIER';
}

/**
 * Extract score / band / posture from decision_validation evidence text.
 */
function extractDecisionPosture(decisionValidation) {
  if (!decisionValidation || !Array.isArray(decisionValidation.checks)) {
    return { score: null, band: null, posture: null, source: null };
  }
  const vf01 = decisionValidation.checks.find((c) => c.id === 'VF-01');
  if (!vf01 || !vf01.evidence) {
    return { score: null, band: null, posture: null, source: 'VF-01_NOT_FOUND' };
  }
  const m = vf01.evidence.match(/(\d+),\s*([A-Z_]+),\s*([A-Z_]+)/);
  if (m) {
    return {
      score: Number(m[1]),
      band: m[2],
      posture: m[3],
      source: 'decision_validation.VF-01.evidence',
    };
  }
  return { score: null, band: null, posture: null, source: 'VF-01_PARSE_FAILED' };
}

/**
 * Hydrate the 15-actor registry.
 * Returns the actor_registry object plus computed summary fields.
 */
function hydrateActors({
  semanticTopologyModel,
  decisionValidation,
  reproducibilityVerdict,
  semanticCrosswalk,
  canonicalTopology40_4,
  signalRegistry,
  evidenceTrace,
  vaultReadiness,
  dpsigSummary,
  unresolvedGaps,
}) {
  // 17-domain registry summary
  const domains = (semanticTopologyModel && semanticTopologyModel.domains) || [];
  const totalDomains = domains.length;
  const backedDomains = domains.filter(
    (d) => d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG'
  );
  const semanticOnlyDomains = domains.filter(
    (d) => d.lineage_status === 'NONE' || d.lineage_status === 'WEAK'
  );

  // Decision posture from validation
  const posture = extractDecisionPosture(decisionValidation);

  // Qualifier from grounding ratio
  const qualifier = deriveQualifierClass(backedDomains.length, totalDomains);

  // Render state
  const renderState = deriveRenderState(posture.band, posture.posture, qualifier.qualifier_class);

  // Active zone anchor (from decision_validation VF-05)
  const vf05 = (decisionValidation && Array.isArray(decisionValidation.checks))
    ? decisionValidation.checks.find((c) => c.id === 'VF-05')
    : null;
  const zoneAnchorEvidence = vf05 ? vf05.evidence : null;

  // Active PSIG ids from VF-07
  const vf07 = (decisionValidation && Array.isArray(decisionValidation.checks))
    ? decisionValidation.checks.find((c) => c.id === 'VF-07')
    : null;
  const activePSIGEvidence = vf07 ? vf07.evidence : null;

  const actorRegistry = {
    decision_posture: {
      code: 'DP',
      name: 'Decision Posture',
      status: posture.score != null ? 'HYDRATED' : 'PARTIALLY_HYDRATED',
      source: 'semantic/decision/decision_validation.json (VF-01)',
      value: {
        score: posture.score,
        band: posture.band,
        posture: posture.posture,
        render_state: renderState,
        state_label: 'Executive Ready — Qualified',
      },
    },
    confidence_boundary: {
      code: 'CB',
      name: 'Confidence Boundary',
      status: 'HYDRATED_WITH_DERIVATION',
      source: 'semantic/topology/semantic_topology_model.json (lineage_status counts) + derivation rule',
      derivation_rule: 'grounding_ratio = backed / total; ratio < 0.6 → Q-02',
      value: {
        backed_count: backedDomains.length,
        total_count: totalDomains,
        semantic_only_count: semanticOnlyDomains.length,
        grounding_ratio: qualifier.ratio,
        qualifier_class: qualifier.qualifier_class,
        qualifier_label: qualifier.qualifier_label,
      },
    },
    pressure_anchor: {
      code: 'PA',
      name: 'Pressure Anchor',
      status: 'HYDRATED',
      source: 'DPSIG signal_set normalization_basis + decision_validation VF-05',
      value: {
        max_cluster_id:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.max_cluster_id) ||
          null,
        max_cluster_name:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.max_cluster_name) ||
          null,
        zone_anchor_evidence: zoneAnchorEvidence,
      },
    },
    propagation_path: {
      code: 'PP',
      name: 'Propagation Path',
      status: 'HYDRATED',
      source: 'vault/evidence_trace.json + vault/signal_registry.json primary_entity',
      value: {
        chains:
          (evidenceTrace && Array.isArray(evidenceTrace.traceability_chains))
            ? evidenceTrace.traceability_chains.map((c) => ({
                signal_id: c.signal_id || null,
                vault_artifact: c.vault_artifact || null,
                chain_steps: Array.isArray(c.chain) ? c.chain.length : 0,
              }))
            : [],
      },
    },
    absorption_load: {
      code: 'AL',
      name: 'Absorption Load',
      status: 'HYDRATED',
      source: 'DPSIG signal_set normalization_basis (mean_non_singleton_cluster_size)',
      value: {
        mean_non_singleton_cluster_size:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.mean_non_singleton_cluster_size) ||
          null,
        max_cluster_node_count:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.max_cluster_node_count) ||
          null,
        non_singleton_cluster_count:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.non_singleton_cluster_count) ||
          null,
        singleton_cluster_count:
          (dpsigSummary && dpsigSummary.normalization_basis && dpsigSummary.normalization_basis.singleton_cluster_count) ||
          null,
      },
    },
    receiver_exposure: {
      code: 'RE',
      name: 'Receiver Exposure',
      status: 'HYDRATED',
      source: 'semantic_topology_model.domains where lineage_status in [NONE, WEAK]',
      value: {
        semantic_only_count: semanticOnlyDomains.length,
        semantic_only_domain_ids: semanticOnlyDomains.map((d) => d.domain_id || d.domain_name || null),
      },
    },
    semantic_topology: {
      code: 'ST',
      name: 'Semantic Topology',
      status: 'HYDRATED',
      source: 'semantic/topology/semantic_topology_model.json (17 DOMAINs)',
      value: {
        total_domains: totalDomains,
        backed_count: backedDomains.length,
        semantic_only_count: semanticOnlyDomains.length,
      },
    },
    structural_backing: {
      code: 'SB',
      name: 'Structural Backing',
      status: 'HYDRATED',
      source: '17-domain registry lineage_status filter',
      value: {
        backed_domain_ids: backedDomains.map((d) => d.domain_id || d.domain_name || null),
      },
    },
    semantic_only_exposure: {
      code: 'SO',
      name: 'Semantic-Only Exposure',
      status: 'HYDRATED',
      source: '17-domain registry inverse of structural backing',
      value: {
        semantic_only_domain_ids: semanticOnlyDomains.map((d) => d.domain_id || d.domain_name || null),
      },
    },
    cluster_concentration: {
      code: 'CC',
      name: 'Cluster Concentration',
      status: 'HYDRATED',
      source: 'structure/40.4/canonical_topology.json + DPSIG normalization_basis',
      value: {
        cluster_count:
          (canonicalTopology40_4 && Array.isArray(canonicalTopology40_4.clusters))
            ? canonicalTopology40_4.clusters.length
            : null,
        total_structural_nodes:
          (canonicalTopology40_4 && canonicalTopology40_4.counts && canonicalTopology40_4.counts.total_nodes) ||
          (dpsigSummary && dpsigSummary.derivation_context && dpsigSummary.derivation_context.total_structural_nodes) ||
          null,
        total_edges:
          (canonicalTopology40_4 && canonicalTopology40_4.counts && canonicalTopology40_4.counts.total_edges) ||
          null,
        coverage_percent:
          (canonicalTopology40_4 && canonicalTopology40_4.counts && canonicalTopology40_4.counts.coverage_percent) ||
          null,
      },
    },
    signal_stack: {
      code: 'SS',
      name: 'Signal Stack',
      status: 'HYDRATED',
      source: 'vault/signal_registry.json (PSIG) + artifacts/dpsig (DPSIG) + decision_validation VF-07',
      value: {
        psig_total: (signalRegistry && signalRegistry.total_signals) || 0,
        psig_active_count: (signalRegistry && signalRegistry.active_pressure_signals) || 0,
        active_psig_evidence: activePSIGEvidence,
        dpsig_derived_count: dpsigSummary ? dpsigSummary.derived_count : 0,
        dpsig_activated_count: dpsigSummary ? dpsigSummary.activated_count : 0,
        dpsig_severity_band: dpsigSummary ? dpsigSummary.severity_band : null,
      },
    },
    evidence_trace: {
      code: 'ET',
      name: 'Evidence Trace',
      status: 'HYDRATED_WITH_DERIVATION',
      source: 'DPSIG canonical_topology_hash + reproducibility_verdict + vault/evidence_trace.json',
      value: {
        canonical_topology_hash:
          (dpsigSummary && dpsigSummary.derivation_context && dpsigSummary.derivation_context.canonical_topology_hash) ||
          null,
        topology_snapshot_hash:
          (dpsigSummary && dpsigSummary.derivation_context && dpsigSummary.derivation_context.topology_snapshot_hash) ||
          null,
        reproducibility_verdict: reproducibilityVerdict ? reproducibilityVerdict.verdict : null,
        evidence_trace_chains_count:
          (evidenceTrace && Array.isArray(evidenceTrace.traceability_chains))
            ? evidenceTrace.traceability_chains.length
            : 0,
      },
    },
    resolution_boundary: {
      code: 'RB',
      name: 'Resolution Boundary',
      status: 'HYDRATED',
      source: 'semantic/decision/decision_validation.json (8 VF checks)',
      value: {
        checks_total:
          (decisionValidation && Array.isArray(decisionValidation.checks))
            ? decisionValidation.checks.length
            : 0,
        checks_passed:
          (decisionValidation && Array.isArray(decisionValidation.checks))
            ? decisionValidation.checks.filter((c) => c.result === 'PASS').length
            : 0,
        contract_id: decisionValidation ? decisionValidation.contract_id : null,
      },
    },
    inference_prohibition: {
      code: 'IP',
      name: 'Inference Prohibition',
      status: 'PLACEHOLDER_BINDING_PENDING',
      source: 'rendering_metadata not yet vault-written',
      value: {
        binding_pending_reason:
          'rendering_metadata.qualifier_rules_applied / ali_rules_applied are not yet exposed as a per-run vault artifact. First binding ships with placeholder + caption for IP.',
        placeholder_qualifier_rules: [qualifier.qualifier_class],
        placeholder_ali_rules: [],
      },
    },
    report_artifact_access: {
      code: 'RA',
      name: 'Report Artifact Access',
      status: 'PRESENTATION_LAYER_DERIVED',
      source: '/api/report-pack endpoint',
      value: {
        endpoint: '/api/report-pack',
        artifacts: ['decision-surface', 'tier1-narrative', 'tier1-evidence', 'tier2-diagnostic'],
      },
    },
  };

  return {
    actor_registry: actorRegistry,
    derived: {
      total_domains: totalDomains,
      backed_count: backedDomains.length,
      semantic_only_count: semanticOnlyDomains.length,
      grounding_ratio: qualifier.ratio,
      qualifier_class: qualifier.qualifier_class,
      qualifier_label: qualifier.qualifier_label,
      qualifier_note: qualifier.qualifier_note,
      derived_qualifier_class: qualifier.derived_qualifier_class || qualifier.qualifier_class,
      score: posture.score,
      band: posture.band,
      posture: posture.posture,
      render_state: renderState,
    },
  };
}

module.exports = {
  deriveQualifierClass,
  deriveRenderState,
  extractDecisionPosture,
  hydrateActors,
};
