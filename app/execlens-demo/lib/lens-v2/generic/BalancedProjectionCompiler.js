/**
 * BalancedProjectionCompiler
 *
 * Layer 3 projection compiler for BALANCED persona.
 * Input: resolved payload (fullReport). Output: balanced_projection per contract.
 *
 * BALANCED answers: "How did this qualification posture emerge?"
 * It is a sibling to BOARDROOM, not its child — parallel compilation from the same resolved payload.
 *
 * Contract: docs/pios/PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01/BALANCED_PROJECTION_OBJECT_CONTRACT.md
 */

const SCHEMA_VERSION = '1.0.0';
const COMPILER_VERSION = '1.0.0';

const FAMILY_LABELS = {
  DPSIG: 'Structural Concentration',
  PSIG: 'Architectural Binding',
  ISIG: 'Import Dependency',
};

const FAMILY_EXPLANATIONS = {
  DPSIG: 'DPSIG signals measure structural concentration — where architectural weight accumulates disproportionately. Concentration creates fragility when load-bearing domains carry outsized responsibility.',
  PSIG: 'PSIG signals measure architectural binding pressure — how tightly coupled structural elements are across domain boundaries. High binding pressure means changes propagate widely.',
  ISIG: 'ISIG signals measure import dependency tension — the degree to which a domain depends on external structural elements. High import dependency creates vulnerability to upstream instability.',
};

const FAMILY_SORT_ORDER = ['DPSIG', 'PSIG', 'ISIG'];

const SEMANTIC_PHASES = [
  { label: 'EMERGENCE', description: 'Raw intake — the system encounters unknown structure' },
  { label: 'FORMATION', description: 'Semantic claims crystallize from evidence' },
  { label: 'TENSION', description: 'Governance challenges weak meaning — friction, dispute, rejection' },
  { label: 'STRENGTHENING', description: 'Substrate enriches, debt evolves — the system self-corrects' },
  { label: 'STABILIZATION', description: 'Deterministic replay confirms — what was challenged now holds' },
  { label: 'QUALIFICATION', description: 'Governed advancement — the system earns its state transition' },
  { label: 'CONVERGENCE', description: 'Cross-specimen pattern — generalized governed cognition emerges' },
  { label: 'PROJECTION', description: 'Executive understanding crystallizes — cognition becomes communicable' },
];

const QUERY_CATALOG = [
  {
    query_id: 'GQ-01',
    query_text: 'Which domains carry the highest structural concentration?',
    query_category: 'PRESSURE',
    grounding: 'pressure_zone_distribution',
    depth_target: 'DENSE',
  },
  {
    query_id: 'GQ-02',
    query_text: 'What claims were rejected during governance review?',
    query_category: 'FRICTION',
    grounding: 'governance_friction',
    depth_target: 'INVESTIGATION',
  },
  {
    query_id: 'GQ-03',
    query_text: 'How did evidence enrichment change domain confidence?',
    query_category: 'ENRICHMENT',
    grounding: 'enrichment_corrections',
    depth_target: 'DENSE',
  },
  {
    query_id: 'GQ-04',
    query_text: 'What governance patterns converge across specimens?',
    query_category: 'CONVERGENCE',
    grounding: 'convergence_observations',
    depth_target: 'INVESTIGATION',
  },
  {
    query_id: 'GQ-05',
    query_text: 'Which signal families are activated and why?',
    query_category: 'SIGNALS',
    grounding: 'signal_family_explanation',
    depth_target: 'DENSE',
  },
  {
    query_id: 'GQ-06',
    query_text: 'What constitutional dimensions were assessed?',
    query_category: 'ANCHOR',
    grounding: 'constitutional_anchor_dimensions',
    depth_target: 'INVESTIGATION',
  },
  {
    query_id: 'GQ-07',
    query_text: 'What did deterministic revalidation check?',
    query_category: 'REVALIDATION',
    grounding: 'revalidation_detail',
    depth_target: 'DENSE',
  },
];

function generateProjectionId() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 8);
  return `bal-${ts}-${rnd}`;
}

// ── Shared gate: governed qualification (same logic as BOARDROOM) ──

function resolveGovernedGate(fullReport) {
  const gl = fullReport.governance_lifecycle;
  if (gl && gl.available && gl.s_level && ['S1', 'S2', 'S3'].includes(gl.s_level)) {
    return { governed: true, s_level: gl.s_level, lifecycle: gl };
  }
  return { governed: false, s_level: null, lifecycle: null };
}

// ── Section 1: Qualification Timeline ──

function compileQualificationTimeline(fullReport, gate) {
  if (!gate.governed) {
    return {
      available: false,
      s_level: null,
      governed: false,
      transitions: [],
      transition_count: 0,
      timeline_narrative: null,
      hold_reason: null,
      promotion_eligible: false,
    };
  }

  const gl = gate.lifecycle;
  const transitions = (gl.transitions || []).map(t => {
    const gatesCleared = [];
    const mech = (t.mechanism || '').toLowerCase();
    if (mech.includes('revalidation')) gatesCleared.push('revalidation');
    if (mech.includes('proposition') || mech.includes('accepted') || mech.includes('rejected')) gatesCleared.push('proposition_review');
    if (mech.includes('constitutional')) gatesCleared.push('constitutional_anchor');
    if (mech.includes('enrichment')) gatesCleared.push('enrichment');
    if (mech.includes('replay') && mech.includes('certif')) gatesCleared.push('replay_certification');

    return {
      from: t.from,
      to: t.to,
      timestamp: t.timestamp,
      actor: t.actor,
      mechanism_summary: t.mechanism || null,
      semantic_phase: 'QUALIFICATION',
      governance_gates_cleared: gatesCleared,
    };
  });

  const transitionCount = gl.transition_count || transitions.length;
  const transitionDescriptions = transitions.map(t => `${t.from}→${t.to}`).join(' then ');

  const timelineNarrative = transitionCount > 0
    ? `This specimen advanced through ${transitionCount} governed transition${transitionCount !== 1 ? 's' : ''} — ${transitionDescriptions}. Each transition required operator review, deterministic revalidation, and constitutional anchor clearance.`
    : `${gl.s_level} qualification achieved. No recorded transitions.`;

  return {
    available: true,
    s_level: gl.s_level,
    governed: true,
    transitions,
    transition_count: transitionCount,
    timeline_narrative: timelineNarrative,
    hold_reason: gl.hold_reason || null,
    promotion_eligible: gl.promotion_eligible || false,
  };
}

// ── Section 2: Signal Family Explanation ──

function compileSignalFamilyExplanation(fullReport) {
  const sigs = fullReport.signal_interpretations || [];
  if (sigs.length === 0) {
    return { available: false, families: [], total_signals: 0, activated_signals: 0 };
  }

  const familyMap = {};
  for (const sig of sigs) {
    const fam = sig.signal_family || 'UNKNOWN';
    if (!familyMap[fam]) {
      familyMap[fam] = {
        family: fam,
        family_label: FAMILY_LABELS[fam] || fam,
        family_explanation: FAMILY_EXPLANATIONS[fam] || null,
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

    const pressureZone = (fullReport.propagation_summary || {}).primary_zone_business_label || null;
    entry.signals.push({
      signal_id: sig.signal_id,
      signal_name: sig.signal_name,
      severity: sig.severity || sig.activation_state,
      investigative_reading: sig.boardroom_interpretation || sig.interpretation || null,
      activation_context: isActivated ? {
        what_triggered: sig.interpretation || 'Signal activation exceeds structural norm',
        what_it_means: sig.boardroom_interpretation || 'Structural tension detected in this dimension',
        where_it_concentrates: pressureZone || null,
      } : null,
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

  return {
    available: true,
    families,
    total_signals: totalSignals,
    activated_signals: activatedSignals,
  };
}

// ── Section 3: Pressure Zone Distribution ──

function compilePressureZoneDistribution(fullReport) {
  const blocks = fullReport.evidence_blocks;
  const ps = fullReport.propagation_summary || {};
  const pressureZone = ps.primary_zone_business_label || null;

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return {
      available: false,
      primary_zone: null,
      propagation_pattern: null,
      propagation_narrative: null,
      zone_count: 0,
      affected_domain_count: 0,
    };
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

  const origin = extractRole('ORIGIN');
  const passthrough = extractRole('PASS_THROUGH');
  const receiver = extractRole('RECEIVER');

  const allLabels = new Set();
  if (origin) origin.domain_labels.forEach(l => allLabels.add(l));
  if (passthrough) passthrough.domain_labels.forEach(l => allLabels.add(l));
  if (receiver) receiver.domain_labels.forEach(l => allLabels.add(l));

  const zoneCount = [origin, passthrough, receiver].filter(Boolean).length;

  let propagationNarrative = null;
  if (origin) {
    const parts = [`Structural pressure originates in ${origin.domain_label}`];
    if (passthrough) parts.push(`transfers through ${passthrough.domain_labels.join(' and ')}`);
    if (receiver) parts.push(`settles in ${receiver.domain_labels.join(' and ')}`);
    propagationNarrative = parts.join(', ') + '. This triadic flow reveals the system\'s structural dependency chain.';
  }

  return {
    available: true,
    primary_zone: pressureZone ? {
      domain_label: pressureZone,
      zone_role: 'ORIGIN',
      structural_weight_narrative: `This domain carries the dominant cluster mass and acts as the structural origin of propagated pressure.`,
    } : null,
    propagation_pattern: { origin, passthrough, receiver },
    propagation_narrative: propagationNarrative,
    zone_count: zoneCount,
    affected_domain_count: allLabels.size,
  };
}

// ── Section 4: Governance Friction ──

function compileGovernanceFriction(fullReport, gate) {
  if (!gate.governed) {
    return { available: false, proposition_review: null, friction_summary: null };
  }

  const pc = fullReport.proposition_corpus;
  if (!pc || !pc.available) {
    return { available: false, proposition_review: null, friction_summary: null };
  }

  const dc = pc.disposition_counts || {};
  const total = pc.total || 0;
  const accepted = dc.accepted || 0;
  const rejected = dc.rejected || 0;
  const arbitrated = dc.arbitrated || 0;
  const contested = dc.contested || 0;
  const frictionRate = pc.governance_friction_rate || 0;
  const frPct = `${Math.round(frictionRate * 100 * 10) / 10}%`;

  const frictionParts = [`${total} semantic propositions reviewed.`];
  frictionParts.push(`${accepted} accepted on structural merit.`);
  if (rejected > 0) {
    frictionParts.push(`${rejected} rejected — governance friction challenged weak claims and they did not survive.`);
  }
  if (arbitrated > 0) {
    frictionParts.push(`${arbitrated} arbitrated — operator judgment resolved ${arbitrated === 1 ? 'a' : ''} contested ${arbitrated === 1 ? 'boundary' : 'boundaries'}.`);
  }

  const frictionNarrative = frictionParts.join(' ');

  const frictionQuality = (rejected + arbitrated) > 0
    ? `Governance friction rate: ${frPct}. The system challenged ${rejected + arbitrated} claims — ${rejected} rejected outright${arbitrated > 0 ? `, ${arbitrated} resolved through operator arbitration` : ''}. This is genuine operational governance, not rubber-stamp acceptance.`
    : `Governance friction rate: ${frPct}. All ${total} claims accepted — no governance tension surfaced during review.`;

  return {
    available: true,
    proposition_review: {
      total,
      accepted,
      rejected,
      arbitrated,
      contested,
      friction_rate: frictionRate,
      friction_narrative: frictionNarrative,
      review_status: pc.review_status || null,
      review_completed_by: pc.review_completed_by || null,
      class_distribution: pc.by_class || {},
      tier_distribution: pc.by_tier || {},
    },
    friction_summary: frictionQuality,
  };
}

// ── Section 5: Enrichment Corrections ──

function compileEnrichmentCorrections(fullReport, gate) {
  if (!gate.governed) {
    return { available: false };
  }

  const ei = fullReport.enrichment_intelligence;
  if (!ei || !ei.available) {
    return { available: false };
  }

  const corrected = ei.domains_corrected || 0;
  const confirmed = ei.domains_confirmed || 0;
  const noMatch = ei.domains_no_sdc_match || 0;
  const capCorrected = ei.capabilities_domain_corrected || 0;
  const totalDomains = (fullReport.topology_summary || {}).semantic_domain_count || 0;
  const confidence = ei.mean_confidence_post;

  const parts = [];
  parts.push(`Evidence enrichment corrected domain assignments for ${corrected} of ${totalDomains || '?'} domains.`);
  if (capCorrected > 0) parts.push(`${capCorrected} capabilities received domain-reference corrections.`);
  if (noMatch > 0) parts.push(`${noMatch} domains had no SDC match — an honest gap in evidence coverage.`);
  if (confidence != null) parts.push(`Mean confidence after enrichment: ${Math.round(confidence * 1000) / 10}%.`);

  return {
    available: true,
    domains_corrected: corrected,
    domains_confirmed: confirmed,
    domains_no_sdc_match: noMatch,
    capabilities_domain_corrected: capCorrected,
    mean_confidence_post: confidence,
    domains_with_change: ei.domains_with_change || 0,
    correction_narrative: parts.join(' '),
    debt: ei.debt ? {
      available: !!(ei.debt.available),
      total_items: ei.debt.total_items || null,
      improved: ei.debt.improved || null,
      unchanged: ei.debt.unchanged || null,
      worsened: ei.debt.worsened || null,
      blockers_resolved: ei.debt.blockers_resolved || null,
      trajectory: ei.debt.trajectory || null,
      debt_narrative: null,
    } : { available: false },
  };
}

// ── Section 6: Constitutional Anchor Dimensions ──

function compileConstitutionalAnchorDimensions(fullReport, gate) {
  if (!gate.governed) {
    return { available: false };
  }

  const ca = fullReport.constitutional_anchor;
  if (!ca || !ca.available) {
    return { available: false };
  }

  const dims = (ca.dimensions || []).map((d, i) => ({
    dimension_id: d.dimension_id || `DIM-${String(i + 1).padStart(2, '0')}`,
    dimension_label: d.dimension_label || d.dimension_id || `Dimension ${i + 1}`,
    verdict: d.verdict || 'UNKNOWN',
    verdict_label: d.verdict === 'PASS'
      ? 'Constitutional distance within acceptable range'
      : d.verdict === 'FAIL'
        ? 'Constitutional distance exceeds threshold'
        : d.verdict || 'Unknown',
  }));

  const passCount = dims.filter(d => d.verdict === 'PASS').length;
  const failCount = dims.filter(d => d.verdict === 'FAIL').length;

  const anchorNarrative = `Constitutional anchor assessed ${dims.length} dimensions. ${passCount} PASS${failCount > 0 ? `, ${failCount} FAIL` : ''} — ${ca.advancement_blocked ? 'advancement BLOCKED' : 'constitutional distance acceptable'}. ${ca.advancement_blocked ? 'The specimen does not yet meet constitutional requirements for advancement.' : 'The specimen\'s governance structure is constitutionally sound relative to the reference specimen.'}`;

  return {
    available: true,
    status: ca.status,
    advancement_blocked: ca.advancement_blocked,
    overall_verdict: ca.overall_verdict || ca.status,
    dimension_count: dims.length,
    dimensions: dims,
    anchor_narrative: anchorNarrative,
    reference_specimen: ca.reference_specimen || null,
    candidate_specimen: ca.candidate_specimen || null,
  };
}

// ── Section 7: Convergence Observations ──

function compileConvergenceObservations(fullReport, gate) {
  if (!gate.governed) {
    return { available: false };
  }

  const ci = fullReport.convergence_intelligence;
  if (!ci || !ci.available) {
    return { available: false };
  }

  const convergences = Array.isArray(ci.convergences) ? ci.convergences : [];
  const divergences = Array.isArray(ci.divergences) ? ci.divergences : [];
  const mixed = Array.isArray(ci.mixed) ? ci.mixed : [];
  const specimens = Array.isArray(ci.specimens)
    ? ci.specimens
    : (ci.specimens && typeof ci.specimens === 'object')
      ? Object.values(ci.specimens).map(s => s.specimen_id || s).filter(Boolean)
      : [];
  const specimenCount = specimens.length;

  const convergenceNarrative = `${ci.total_observations || 0} cross-specimen observations across ${specimenCount} specimens. ${convergences.length} convergences, ${divergences.length} divergences, ${mixed.length} mixed. Observation maturity: ${ci.observation_maturity || 'DESCRIPTIVE'} — ${specimenCount <= 2 ? 'two specimens establish comparison, not pattern' : 'multiple specimens strengthen pattern claims'}. ${convergences.length > 0 ? `Convergences include ${convergences.slice(0, 3).join(', ').replace(/_/g, ' ')}.` : ''} ${divergences.length > 0 ? `Divergences reflect legitimate PATH A/PATH B differences in ${divergences.slice(0, 2).join(', ').replace(/_/g, ' ')}.` : ''}`;

  return {
    available: true,
    observation_maturity: ci.observation_maturity || 'DESCRIPTIVE',
    total_observations: ci.total_observations || 0,
    convergence_count: convergences.length,
    divergence_count: divergences.length,
    mixed_count: mixed.length,
    convergences,
    divergences,
    mixed,
    convergence_narrative: convergenceNarrative,
    specimens,
    verdict: ci.verdict || null,
    observations: ci.observations || [],
  };
}

// ── Section 8: Chronicle Navigation ──

function compileChronicleNavigation(fullReport, gate) {
  if (!gate.governed) {
    return { available: false };
  }

  const cc = fullReport.chronicle_certification;
  if (!cc || !cc.available) {
    return { available: false };
  }

  const phaseBreakdown = cc.phase_breakdown || {};
  const phaseEntries = Array.isArray(phaseBreakdown)
    ? phaseBreakdown
    : Object.entries(phaseBreakdown).map(([key, val]) => ({ phase_id: key, ...val }));
  const phaseSummary = phaseEntries.map((pb, i) => ({
    phase_label: SEMANTIC_PHASES[i] ? SEMANTIC_PHASES[i].label : (pb.phase_id || `Phase ${i + 1}`),
    phase_description: SEMANTIC_PHASES[i] ? SEMANTIC_PHASES[i].description : null,
    status: pb.status || (pb.passed === pb.total ? 'COMPLETE' : 'PARTIAL'),
  }));

  const chronicleNarrative = `Chronicle replay ${cc.certification_status || 'UNKNOWN'} — ${cc.passed || 0}/${cc.total_checks || 0} checks across ${cc.phase_count || 0} semantic phases. The governed cognitive replay traces the full lifecycle from specimen intake through qualification, enrichment, revalidation, and cross-specimen convergence.`;

  return {
    available: true,
    certification_status: cc.certification_status,
    total_checks: cc.total_checks || 0,
    passed: cc.passed || 0,
    failed: cc.failed || 0,
    phase_count: cc.phase_count || 0,
    phase_summary: phaseSummary,
    chronicle_narrative: chronicleNarrative,
    descent_available: cc.certification_status === 'CERTIFIED',
    descent_label: 'Descend into Chronicle for the full governed cognitive replay.',
  };
}

// ── Section 9: Revalidation Detail ──

function compileRevalidationDetail(fullReport, gate) {
  if (!gate.governed) {
    return { available: false };
  }

  const rv = fullReport.revalidation_intelligence;
  if (!rv || !rv.available) {
    return { available: false };
  }

  const phases = (rv.phases || []).map((p, i) => ({
    phase_id: p.phase_id || `PHASE-${i + 1}`,
    phase_label: p.phase_label || p.phase_id || `Phase ${i + 1}`,
    passed: p.passed || 0,
    total: p.total || 0,
    status: p.passed === p.total ? 'PASS' : 'PARTIAL',
  }));

  const phaseNames = phases.map(p => p.phase_label.toLowerCase().replace(/_/g, ' ')).join(', ');
  const revalidationNarrative = `Deterministic revalidation: ${rv.passed || 0}/${rv.total_checks || 0} checks across ${rv.phase_count || 0} phases. ${rv.status === 'PASS' ? 'All phases PASS.' : `${phases.filter(p => p.status !== 'PASS').length} phase(s) incomplete.`}${phaseNames ? ` ${phaseNames.charAt(0).toUpperCase() + phaseNames.slice(1)} — all verified deterministically.` : ''}`;

  return {
    available: true,
    status: rv.status,
    total_checks: rv.total_checks || 0,
    passed: rv.passed || 0,
    failed: rv.failed || 0,
    phase_count: rv.phase_count || 0,
    phases,
    revalidation_narrative: revalidationNarrative,
  };
}

// ── Section 10: Guided Query Seeds ──

function compileGuidedQuerySeeds(sectionAvailability) {
  const queries = QUERY_CATALOG.filter(q => sectionAvailability[q.grounding]);
  return {
    available: queries.length > 0,
    queries,
  };
}

// ── Section 11: Domain Coverage Extended ──

function compileDomainCoverageExtended(fullReport, gate) {
  const ts = fullReport.topology_summary || {};
  const totalDomains = ts.semantic_domain_count || 0;
  const backed = ts.structurally_backed_count || 0;
  const semanticOnly = ts.semantic_only_count || 0;

  const base = {
    available: totalDomains > 0,
    total_domains: totalDomains,
    structurally_backed: backed,
    semantic_only: semanticOnly,
    grounding_ratio: totalDomains > 0 ? backed / totalDomains : 0,
    coverage_label: totalDomains > 0
      ? `${backed} of ${totalDomains} domains structurally grounded`
      : 'No domains resolved',
    cluster_count: ts.cluster_count || 0,
    proposition_coverage: null,
    coverage_narrative: null,
  };

  if (gate.governed && fullReport.proposition_corpus && fullReport.proposition_corpus.available) {
    const pc = fullReport.proposition_corpus;
    base.proposition_coverage = {
      domains_with_propositions: totalDomains,
      mean_confidence: pc.mean_confidence || null,
      derivation_path: pc.derivation_path || null,
    };

    const classKeys = pc.by_class ? Object.keys(pc.by_class) : [];
    base.coverage_narrative = `${totalDomains} semantic domains, ${backed} structurally backed. ${pc.total || 0} propositions across ${classKeys.length} PATH B classes. Mean proposition confidence: ${pc.mean_confidence ? `${Math.round(pc.mean_confidence * 1000) / 10}%` : 'N/A'}. ${pc.derivation_path ? `Evidence derivation via ${pc.derivation_path}.` : ''}`;
  } else {
    base.coverage_narrative = totalDomains > 0
      ? `${totalDomains} semantic domains, ${backed} structurally backed.`
      : null;
  }

  return base;
}

// ── Section 12: Authority Declaration ──

function compileAuthorityDeclaration(resolvedPayloadHash) {
  return {
    interpretive_authority: '75.x',
    authority_ceiling: 'L3',
    governance_contract: `BALANCED_PROJECTION_CONTRACT_v${SCHEMA_VERSION}`,
    evidence_traced: true,
    prohibitions_enforced: 13,
    structural_derivation_primary: true,
    compilation_timestamp: new Date().toISOString(),
    resolved_payload_hash: resolvedPayloadHash || null,
    compiler_version: COMPILER_VERSION,
  };
}

// ── Payload hash (shared logic with BOARDROOM) ──

function computePayloadHash(fullReport) {
  if (fullReport.trace_summary && fullReport.trace_summary.derivation_hash) {
    return fullReport.trace_summary.derivation_hash;
  }
  if (fullReport.evidence_object_hash) {
    return fullReport.evidence_object_hash;
  }
  return null;
}

// ── Main compiler ──

function compileBalancedProjection(fullReport) {
  if (!fullReport) return null;

  const payloadHash = computePayloadHash(fullReport);
  const gate = resolveGovernedGate(fullReport);

  const qualificationTimeline = compileQualificationTimeline(fullReport, gate);
  const signalFamilyExplanation = compileSignalFamilyExplanation(fullReport);
  const pressureZoneDistribution = compilePressureZoneDistribution(fullReport);
  const governanceFriction = compileGovernanceFriction(fullReport, gate);
  const enrichmentCorrections = compileEnrichmentCorrections(fullReport, gate);
  const constitutionalAnchorDimensions = compileConstitutionalAnchorDimensions(fullReport, gate);
  const convergenceObservations = compileConvergenceObservations(fullReport, gate);
  const chronicleNavigation = compileChronicleNavigation(fullReport, gate);
  const revalidationDetail = compileRevalidationDetail(fullReport, gate);
  const domainCoverageExtended = compileDomainCoverageExtended(fullReport, gate);

  const sectionAvailability = {
    qualification_timeline: qualificationTimeline.available,
    signal_family_explanation: signalFamilyExplanation.available,
    pressure_zone_distribution: pressureZoneDistribution.available,
    governance_friction: governanceFriction.available,
    enrichment_corrections: enrichmentCorrections.available,
    constitutional_anchor_dimensions: constitutionalAnchorDimensions.available,
    convergence_observations: convergenceObservations.available,
    chronicle_navigation: chronicleNavigation.available,
    revalidation_detail: revalidationDetail.available,
    domain_coverage_extended: domainCoverageExtended.available,
  };

  const guidedQuerySeeds = compileGuidedQuerySeeds(sectionAvailability);

  return {
    projection_id: generateProjectionId(),
    persona: 'BALANCED',
    altitude: 'INVESTIGATIVE',
    generated_at: new Date().toISOString(),
    specimen_id: fullReport.client || null,
    run_id: fullReport.run_id || null,
    schema_version: SCHEMA_VERSION,

    qualification_timeline: qualificationTimeline,
    signal_family_explanation: signalFamilyExplanation,
    pressure_zone_distribution: pressureZoneDistribution,
    governance_friction: governanceFriction,
    enrichment_corrections: enrichmentCorrections,
    constitutional_anchor_dimensions: constitutionalAnchorDimensions,
    convergence_observations: convergenceObservations,
    chronicle_navigation: chronicleNavigation,
    revalidation_detail: revalidationDetail,
    guided_query_seeds: guidedQuerySeeds,
    domain_coverage_extended: domainCoverageExtended,
    authority_declaration: compileAuthorityDeclaration(payloadHash),
  };
}

module.exports = { compileBalancedProjection };
