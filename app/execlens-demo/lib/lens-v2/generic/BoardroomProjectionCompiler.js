/**
 * BoardroomProjectionCompiler
 *
 * Layer 3 projection compiler for BOARDROOM persona.
 * Input: resolved payload (fullReport). Output: boardroom_projection per contract.
 *
 * Contract: docs/pios/PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01/BOARDROOM_PROJECTION_OBJECT_CONTRACT.md
 */

const SCHEMA_VERSION = '1.0.0';
const COMPILER_VERSION = '1.0.0';

const FAMILY_LABELS = {
  DPSIG: 'Structural Concentration',
  PSIG: 'Architectural Binding',
  ISIG: 'Import Dependency',
};

const FAMILY_SORT_ORDER = ['DPSIG', 'PSIG', 'ISIG'];

function generateProjectionId() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 8);
  return `bp-${ts}-${rnd}`;
}

function resolveQualificationPosture(fullReport) {
  const gl = fullReport.governance_lifecycle;
  const rs = fullReport.readiness_summary || {};

  if (gl && gl.available && gl.s_level && ['S1', 'S2', 'S3'].includes(gl.s_level)) {
    const transitionCount = gl.transition_count || (gl.transitions || []).length;
    const provenance = gl.qualification_provenance
      || (transitionCount > 0
        ? `Earned through ${transitionCount} governance transition${transitionCount !== 1 ? 's' : ''}.`
        : null);

    return {
      s_level: gl.s_level,
      qualification_method: 'GOVERNED_LIFECYCLE',
      governed: true,
      posture_label: `${gl.s_level} GOVERNED`,
      provenance_summary: provenance,
      authority_ceiling: gl.authority_ceiling || 'L3',
      authority_ceiling_label: 'AI-derived intelligence under bounded interpretive authority.',
    };
  }

  return {
    s_level: null,
    qualification_method: 'LEGACY',
    governed: false,
    posture_label: rs.posture || 'UNKNOWN',
    provenance_summary: null,
    authority_ceiling: null,
    authority_ceiling_label: null,
  };
}

function compileTensionSummary(fullReport, qualificationPosture) {
  const sigs = fullReport.signal_interpretations || [];
  const activated = sigs.filter(s =>
    s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED'
  );
  const familySet = [...new Set(activated.map(s => s.signal_family).filter(Boolean))];
  familySet.sort((a, b) => (FAMILY_SORT_ORDER.indexOf(a) - FAMILY_SORT_ORDER.indexOf(b)));

  const tensionCount = familySet.length;
  const tensionLabel = tensionCount > 0
    ? `${tensionCount} STRUCTURAL TENSION${tensionCount !== 1 ? 'S' : ''}`
    : 'NO ELEVATED PRESSURE';

  const ps = fullReport.propagation_summary || {};
  const pressureZone = ps.primary_zone_business_label || null;

  let pressureZoneNarrative = null;
  if (pressureZone && tensionCount > 0) {
    pressureZoneNarrative = `Structural load concentrates in ${pressureZone} — this domain carries disproportionate weight across the system.`;
  }

  return {
    tension_count: tensionCount,
    tension_label: tensionLabel,
    active_families: familySet,
    pressure_zone: pressureZone,
    pressure_zone_narrative: pressureZoneNarrative,
  };
}

function compileSignalIntelligence(fullReport) {
  const sigs = fullReport.signal_interpretations || [];

  const familyMap = {};
  for (const sig of sigs) {
    const fam = sig.signal_family || 'UNKNOWN';
    if (!familyMap[fam]) {
      familyMap[fam] = {
        family: fam,
        family_label: FAMILY_LABELS[fam] || fam,
        signal_count: 0,
        activated_count: 0,
        signals: [],
      };
    }
    const entry = familyMap[fam];
    entry.signal_count += 1;

    const isActivated = sig.severity !== 'NOMINAL'
      && sig.activation_state !== 'NOMINAL'
      && sig.activation_state !== 'CLUSTER_BALANCED';
    if (isActivated) entry.activated_count += 1;

    entry.signals.push({
      signal_id: sig.signal_id,
      signal_name: sig.signal_name,
      severity: sig.severity || sig.activation_state,
      executive_reading: sig.boardroom_interpretation || sig.interpretation || null,
      source_lineage: {
        resolved_signal_id: sig.signal_id,
        derivation: 'altitude_projection',
      },
    });
  }

  const families = FAMILY_SORT_ORDER
    .filter(f => familyMap[f])
    .map(f => familyMap[f])
    .concat(Object.keys(familyMap).filter(f => !FAMILY_SORT_ORDER.includes(f)).map(f => familyMap[f]));

  const totalSignals = sigs.length;
  const activatedSignals = sigs.filter(s =>
    s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED'
  ).length;

  const compoundNarrative = sigs.length > 0 && sigs[0].compound_narrative
    ? sigs[0].compound_narrative
    : null;

  return {
    families,
    total_signals: totalSignals,
    activated_signals: activatedSignals,
    compound_narrative: compoundNarrative,
  };
}

function compileDomainCoverage(fullReport) {
  const ts = fullReport.topology_summary || {};
  const totalDomains = ts.semantic_domain_count || 0;
  const backed = ts.structurally_backed_count || 0;
  const semanticOnly = ts.semantic_only_count || 0;

  return {
    total_domains: totalDomains,
    structurally_backed: backed,
    semantic_only: semanticOnly,
    grounding_ratio: totalDomains > 0 ? backed / totalDomains : 0,
    coverage_label: totalDomains > 0
      ? `${backed} of ${totalDomains} domains structurally grounded`
      : 'No domains resolved',
    cluster_count: ts.cluster_count || 0,
  };
}

function compileGovernedNarrative(fullReport, qualificationPosture) {
  const gn = fullReport.governed_narrative;
  if (!qualificationPosture.governed || !gn) {
    return { available: false, paragraphs: [], composition_provenance: null, qualification_context: null, proof_graph: null };
  }

  return {
    available: true,
    paragraphs: gn.paragraphs || [],
    composition_provenance: gn.composition_provenance || null,
    qualification_context: gn.qualification_context || null,
    proof_graph: gn.proof_graph || null,
  };
}

function compileGovernanceLegitimacy(fullReport, qualificationPosture) {
  if (!qualificationPosture.governed) {
    return { available: false, lifecycle_summary: null, sections: {} };
  }

  const gl = fullReport.governance_lifecycle || {};
  const transitionCount = gl.transition_count || (gl.transitions || []).length;
  const lifecycleSummary = `Fully governed ${qualificationPosture.s_level} lifecycle. ${transitionCount} governance transition${transitionCount !== 1 ? 's' : ''}.`;

  const sections = {};

  // Proposition review
  const pc = fullReport.proposition_corpus;
  if (pc && pc.available) {
    const dc = pc.disposition_counts || {};
    const total = pc.total || 0;
    const fr = pc.governance_friction_rate;
    const frPct = fr != null ? `${Math.round(fr * 100)}%` : null;
    sections.proposition_review = {
      available: true,
      finding: `${total} semantic propositions reviewed.` +
        (dc.accepted ? ` ${dc.accepted} accepted` : '') +
        (dc.rejected ? `, ${dc.rejected} rejected` : '') +
        (dc.arbitrated ? `, ${dc.arbitrated} arbitrated` : '') +
        (frPct ? `. ${frPct} governance friction rate.` : '.'),
      detail: {
        total,
        accepted: dc.accepted || 0,
        rejected: dc.rejected || 0,
        arbitrated: dc.arbitrated || 0,
        friction_rate: fr || 0,
      },
    };
  } else {
    sections.proposition_review = { available: false, finding: null, detail: null };
  }

  // Evidence enrichment
  const ei = fullReport.enrichment_intelligence;
  if (ei && ei.available) {
    sections.evidence_enrichment = {
      available: true,
      finding: `${ei.enrichment_events || 0} evidence enrichment event${(ei.enrichment_events || 0) !== 1 ? 's' : ''} corrected confidence across ${ei.domains_corrected || 0} domain${(ei.domains_corrected || 0) !== 1 ? 's' : ''}.`,
      detail: {
        enrichment_events: ei.enrichment_events || 0,
        domains_corrected: ei.domains_corrected || 0,
      },
    };
  } else {
    sections.evidence_enrichment = { available: false, finding: null, detail: null };
  }

  // Deterministic replay
  const rv = fullReport.revalidation_intelligence;
  if (rv && rv.available) {
    sections.deterministic_replay = {
      available: true,
      finding: `Deterministic revalidation ${rv.status}. ${rv.passed || 0} of ${rv.total_checks || 0} checks across ${rv.phase_count || 0} phases.`,
      detail: {
        status: rv.status,
        passed: rv.passed || 0,
        total_checks: rv.total_checks || 0,
        phase_count: rv.phase_count || 0,
      },
    };
  } else {
    sections.deterministic_replay = { available: false, finding: null, detail: null };
  }

  // Constitutional anchor
  const ca = fullReport.constitutional_anchor;
  if (ca && ca.available) {
    const blocked = ca.advancement_blocked;
    sections.constitutional_anchor = {
      available: true,
      finding: blocked
        ? `Constitutional replay anchor: advancement BLOCKED.`
        : `Constitutional replay anchor verified. No advancement blockers.`,
      detail: {
        advancement_blocked: blocked,
        overall_verdict: ca.overall_verdict || ca.status,
      },
    };
  } else {
    sections.constitutional_anchor = { available: false, finding: null, detail: null };
  }

  // Cross-specimen
  const ci = fullReport.convergence_intelligence;
  if (ci && ci.available) {
    const convCount = Array.isArray(ci.convergences) ? ci.convergences.length : (ci.convergences || 0);
    const divCount = Array.isArray(ci.divergences) ? ci.divergences.length : (ci.divergences || 0);
    sections.cross_specimen = {
      available: true,
      finding: `${ci.total_observations || 0} cross-specimen convergence observation${(ci.total_observations || 0) !== 1 ? 's' : ''}. ${convCount} convergence${convCount !== 1 ? 's' : ''}, ${divCount} divergence${divCount !== 1 ? 's' : ''}.`,
      detail: {
        total_observations: ci.total_observations || 0,
        convergences: convCount,
        divergences: divCount,
      },
    };
  } else {
    sections.cross_specimen = { available: false, finding: null, detail: null };
  }

  // Replay certification
  const cc = fullReport.chronicle_certification;
  if (cc && cc.available) {
    sections.replay_certification = {
      available: true,
      finding: `Replay corridor ${cc.certification_status || 'UNKNOWN'}. ${cc.passed || 0} of ${cc.total_checks || 0} checks across ${cc.phase_count || 0} phases.`,
      detail: {
        certification_status: cc.certification_status,
        passed: cc.passed || 0,
        total_checks: cc.total_checks || 0,
        phase_count: cc.phase_count || 0,
      },
    };
  } else {
    sections.replay_certification = { available: false, finding: null, detail: null };
  }

  return {
    available: true,
    lifecycle_summary: lifecycleSummary,
    sections,
  };
}

function compilePropagationChain(fullReport) {
  const blocks = fullReport.evidence_blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { available: false, origin: null, passthrough: null, receiver: null };
  }

  function extractRole(role) {
    const matching = blocks.filter(b => b.role === role);
    if (matching.length === 0) return null;
    const labels = matching.map(b => b.domain_name || b.business_label || b.cluster_id || 'Unknown');
    return {
      domain_labels: labels,
      domain_label: labels[0],
      cluster_count: matching.length,
      evidence_summary: role === 'ORIGIN'
        ? 'Origin group carries the dominant cluster mass.'
        : role === 'PASS_THROUGH'
          ? 'Intermediate coupling transfers pressure from origin to peripheral zones.'
          : 'Receiving domains absorb propagated pressure from the origin zone.',
    };
  }

  return {
    available: true,
    origin: extractRole('ORIGIN'),
    passthrough: extractRole('PASS_THROUGH'),
    receiver: extractRole('RECEIVER'),
  };
}

function compileTopologyReference(fullReport) {
  const ts = fullReport.topology_summary || {};
  const hasDomains = Array.isArray(fullReport.semantic_domain_registry) && fullReport.semantic_domain_registry.length > 0;

  return {
    available: hasDomains,
    domain_count: ts.semantic_domain_count || 0,
    cluster_count: ts.cluster_count || 0,
    edge_count: Array.isArray(fullReport.semantic_topology_edges) ? fullReport.semantic_topology_edges.length : 0,
    governance_overlay: {
      grounding_status: true,
      pressure_zone_highlighting: true,
      proposition_state_indicators: true,
    },
    data_ref: 'resolved_payload.topology',
  };
}

function compileAuthorityDeclaration(resolvedPayloadHash) {
  return {
    interpretive_authority: '75.x',
    authority_ceiling: 'L3',
    governance_contract: `BOARDROOM_PROJECTION_CONTRACT_v${SCHEMA_VERSION}`,
    evidence_traced: true,
    prohibitions_enforced: 13,
    structural_derivation_primary: true,
    compilation_timestamp: new Date().toISOString(),
    resolved_payload_hash: resolvedPayloadHash || null,
    compiler_version: COMPILER_VERSION,
  };
}

function computePayloadHash(fullReport) {
  if (fullReport.trace_summary && fullReport.trace_summary.derivation_hash) {
    return fullReport.trace_summary.derivation_hash;
  }
  if (fullReport.evidence_object_hash) {
    return fullReport.evidence_object_hash;
  }
  return null;
}

function compileBoardroomProjection(fullReport) {
  if (!fullReport) return null;

  const payloadHash = computePayloadHash(fullReport);
  const qualificationPosture = resolveQualificationPosture(fullReport);

  return {
    projection_id: generateProjectionId(),
    persona: 'BOARDROOM',
    altitude: 'EXECUTIVE',
    generated_at: new Date().toISOString(),
    specimen_id: fullReport.client || null,
    run_id: fullReport.run_id || null,
    schema_version: SCHEMA_VERSION,

    qualification_posture: qualificationPosture,
    tension_summary: compileTensionSummary(fullReport, qualificationPosture),
    signal_intelligence: compileSignalIntelligence(fullReport),
    domain_coverage: compileDomainCoverage(fullReport),
    governed_narrative: compileGovernedNarrative(fullReport, qualificationPosture),
    governance_legitimacy: compileGovernanceLegitimacy(fullReport, qualificationPosture),
    propagation_chain: compilePropagationChain(fullReport),
    topology_reference: compileTopologyReference(fullReport),
    authority_declaration: compileAuthorityDeclaration(payloadHash),
  };
}

module.exports = { compileBoardroomProjection };
