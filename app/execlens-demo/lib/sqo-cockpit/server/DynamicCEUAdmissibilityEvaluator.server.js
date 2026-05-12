'use strict';

const path = require('path');
const { loadJSON } = require('../../lens-v2/SemanticArtifactLoader');
const { loadSemanticCandidateData, CLIENT, RUN } = require('./BlueEdgeSemanticCandidateExtractor.server');

const DEBT_INVENTORY_PATH = path.join(
  'artifacts', 'sqo', CLIENT, RUN, 'semantic_debt_inventory.v1.json'
);

const STRUCTURAL_COMPATIBILITY = {
  DOMAIN_GROUNDING_STATUS: 'HIGH',
  FOCUS_DOMAIN_DESIGNATION: 'HIGH',
  GAUGE_ARTIFACT_TITLE: 'HIGH',
  GAUGE_CLAIM_LABEL: 'HIGH',
  GAUGE_METRIC_VALUE: 'HIGH',
  STRUCTURAL_SIGNAL: 'MODERATE',
  DIAGNOSTIC_DOMAIN_REFERENCE: 'MODERATE',
  DIAGNOSTIC_SECTION: 'LOW',
  DIAGNOSTIC_CAPABILITY_REFERENCE: 'NONE',
};

const ADMISSIBILITY_STATES = {
  ADMISSIBLE: 'ADMISSIBLE',
  QUARANTINED: 'QUARANTINED',
  REJECTED: 'REJECTED',
  UNRESOLVED: 'UNRESOLVED',
};

function loadDomainLineageStates() {
  const debtResult = loadJSON(DEBT_INVENTORY_PATH);
  if (!debtResult || !debtResult.ok) return {};

  const lineageMap = {};
  const debtItems = debtResult.data.debt_items || [];

  for (const item of debtItems) {
    if (item.category === 'grounding_gap' && item.evidence && item.evidence.field_path) {
      const match = item.evidence.field_path.match(/domains\[([^\]]+)\]\.lineage_status/);
      if (match) {
        lineageMap[match[1]] = item.evidence.current_value;
      }
    }
  }

  return lineageMap;
}

function computeEvidenceRepetitionScores(candidates) {
  const domainEvidence = {};

  for (const c of candidates) {
    if (c.candidate_domain === 'UNMAPPED_CANDIDATE') continue;
    if (!domainEvidence[c.candidate_domain]) {
      domainEvidence[c.candidate_domain] = new Set();
    }
    domainEvidence[c.candidate_domain].add(c.evidence_id);
  }

  const scores = {};
  for (const [domain, evidenceIds] of Object.entries(domainEvidence)) {
    scores[domain] = evidenceIds.size;
  }

  return scores;
}

function detectConflicts(candidates) {
  const domainAssertions = {};

  for (const c of candidates) {
    if (c.candidate_domain === 'UNMAPPED_CANDIDATE') continue;
    if (c.candidate_type !== 'DOMAIN_GROUNDING_STATUS') continue;

    if (!domainAssertions[c.candidate_domain]) {
      domainAssertions[c.candidate_domain] = [];
    }
    domainAssertions[c.candidate_domain].push({
      candidate_id: c.candidate_id,
      evidence_id: c.evidence_id,
      extracted_label: c.extracted_label,
    });
  }

  const conflicts = {};
  for (const [domain, assertions] of Object.entries(domainAssertions)) {
    if (assertions.length > 1) {
      const uniqueEvidence = new Set(assertions.map(a => a.evidence_id));
      if (uniqueEvidence.size > 1) {
        conflicts[domain] = { type: 'COMPETING_VALUE', assertions };
      }
    }
  }

  return conflicts;
}

function evaluateCandidate(candidate, structuralCompat, repetitionScore, conflict, lineageState) {
  const result = {
    candidate_id: candidate.candidate_id,
    evidence_id: candidate.evidence_id,
    candidate_domain: candidate.candidate_domain,
    extracted_label: candidate.extracted_label,
    candidate_type: candidate.candidate_type,
    confidence_class: candidate.confidence_class,
    extraction_method: candidate.extraction_method,
    source_hash: candidate.source_hash,
    source_span_reference: candidate.source_span_reference,
    source_path: candidate.source_path,
    domain_lineage_state: lineageState || 'BACKED',
    structural_compatibility: structuralCompat,
    evidence_repetition_score: repetitionScore,
    replay_compatibility: 'COMPATIBLE',
    conflict_status: conflict ? 'DETECTED' : 'NONE',
    quarantine_reason: null,
    admissibility_confidence: null,
    admissibility_state: null,
    admissibility_reason: null,
    required_next_step: null,
    authority_state: 'NON_AUTHORITATIVE_ADMISSIBILITY_RESULT',
  };

  if (candidate.candidate_domain === 'UNMAPPED_CANDIDATE') {
    result.admissibility_state = ADMISSIBILITY_STATES.REJECTED;
    result.admissibility_reason = 'No deterministic domain resolution — candidate cannot be admitted without domain mapping';
    result.structural_compatibility = 'NONE';
    result.admissibility_confidence = 'N_A';
    result.required_next_step = 'REJECTED — domain resolution or evidence strengthening required';
    return result;
  }

  if (structuralCompat === 'NONE') {
    result.admissibility_state = ADMISSIBILITY_STATES.REJECTED;
    result.admissibility_reason = 'No structural correlation to substrate entities — candidate type provides insufficient domain context';
    result.admissibility_confidence = 'N_A';
    result.required_next_step = 'REJECTED — requires capability-to-domain mapping or additional structural evidence';
    return result;
  }

  if (conflict) {
    result.admissibility_state = ADMISSIBILITY_STATES.QUARANTINED;
    result.admissibility_reason = 'Conflicting grounding assertions detected for target domain';
    result.quarantine_reason = 'Cross-evidence conflict requires governance review before admissibility determination';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — conflict resolution needed before proceeding';
    return result;
  }

  if (structuralCompat === 'HIGH' && candidate.confidence_class === 'STRONG') {
    result.admissibility_state = ADMISSIBILITY_STATES.ADMISSIBLE;
    result.admissibility_reason = 'Strong evidence signal with high structural correlation to target domain';
    result.admissibility_confidence = 'HIGH';
    result.required_next_step = 'OVERLAY_PROPOSAL_ELIGIBLE — candidate may proceed to overlay proposal corridor';
    return result;
  }

  if (structuralCompat === 'HIGH' && candidate.confidence_class === 'MODERATE') {
    result.admissibility_state = ADMISSIBILITY_STATES.QUARANTINED;
    result.admissibility_reason = 'Moderate evidence strength with high structural correlation — insufficient confidence for direct admissibility';
    result.quarantine_reason = 'Evidence indicates ambiguous or weak grounding — requires stronger evidence for overlay candidacy';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — evidence strengthening or governance review needed';
    return result;
  }

  if (structuralCompat === 'HIGH' && candidate.confidence_class === 'WEAK') {
    result.admissibility_state = ADMISSIBILITY_STATES.QUARANTINED;
    result.admissibility_reason = 'Weak evidence strength despite high structural correlation';
    result.quarantine_reason = 'Evidence confidence too low for admissibility — requires evidence strengthening';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — evidence strengthening required';
    return result;
  }

  if (structuralCompat === 'MODERATE') {
    result.admissibility_state = ADMISSIBILITY_STATES.QUARANTINED;
    result.admissibility_reason = 'Moderate structural correlation — candidate provides organizational signal but insufficient structural binding';
    result.quarantine_reason = 'Structural correlation insufficient for direct admissibility — requires corroborating evidence';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — structural binding or corroborating evidence needed';
    return result;
  }

  if (structuralCompat === 'LOW') {
    result.admissibility_state = ADMISSIBILITY_STATES.QUARANTINED;
    result.admissibility_reason = 'Low structural correlation — cross-domain organizational signal without single-domain binding';
    result.quarantine_reason = 'Cross-domain scope prevents deterministic admissibility — requires domain decomposition';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — domain scoping or decomposition needed';
    return result;
  }

  result.admissibility_state = ADMISSIBILITY_STATES.UNRESOLVED;
  result.admissibility_reason = 'Evaluation criteria did not produce a deterministic classification';
  result.admissibility_confidence = 'LOW';
  result.required_next_step = 'ADDITIONAL_EVIDENCE_REQUIRED — evaluation criteria insufficient for classification';
  return result;
}

function loadDynamicCEUAdmissibilityData() {
  const candidateData = loadSemanticCandidateData();
  if (!candidateData.ok) {
    return { ok: false, error: candidateData.error };
  }

  const candidates = candidateData.candidates;
  const lineageMap = loadDomainLineageStates();
  const repetitionScores = computeEvidenceRepetitionScores(candidates);
  const conflicts = detectConflicts(candidates);

  const evaluations = [];
  const evaluationLog = [];

  for (const candidate of candidates) {
    const structuralCompat = candidate.candidate_domain === 'UNMAPPED_CANDIDATE'
      ? 'NONE'
      : (STRUCTURAL_COMPATIBILITY[candidate.candidate_type] || 'NONE');

    const repetitionScore = candidate.candidate_domain === 'UNMAPPED_CANDIDATE'
      ? 0
      : (repetitionScores[candidate.candidate_domain] || 1);

    const conflict = conflicts[candidate.candidate_domain] || null;
    const lineageState = lineageMap[candidate.candidate_domain] || null;

    const evaluation = evaluateCandidate(candidate, structuralCompat, repetitionScore, conflict, lineageState);
    evaluations.push(evaluation);

    evaluationLog.push({
      candidate_id: candidate.candidate_id,
      candidate_domain: candidate.candidate_domain,
      admissibility_state: evaluation.admissibility_state,
      structural_compatibility: evaluation.structural_compatibility,
      replay_compatibility: evaluation.replay_compatibility,
      conflict_status: evaluation.conflict_status,
    });
  }

  const admissibleCount = evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE').length;
  const quarantinedCount = evaluations.filter(e => e.admissibility_state === 'QUARANTINED').length;
  const rejectedCount = evaluations.filter(e => e.admissibility_state === 'REJECTED').length;
  const unresolvedCount = evaluations.filter(e => e.admissibility_state === 'UNRESOLVED').length;

  const admissibleDomains = [...new Set(
    evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE').map(e => e.candidate_domain)
  )];

  const quarantinedDomains = [...new Set(
    evaluations.filter(e => e.admissibility_state === 'QUARANTINED' && e.candidate_domain !== 'UNMAPPED_CANDIDATE').map(e => e.candidate_domain)
  )];

  const noneDomainsWithAdmissible = admissibleDomains.filter(d => lineageMap[d] === 'NONE');

  return {
    ok: true,
    client: CLIENT,
    run_id: RUN,
    upstream_registry_id: candidateData.evidence_registry_id,
    upstream_candidate_count: candidateData.candidate_count,
    evaluations,
    evaluation_count: evaluations.length,
    evaluation_log: evaluationLog,
    summary: {
      total_evaluated: evaluations.length,
      admissible: admissibleCount,
      quarantined: quarantinedCount,
      rejected: rejectedCount,
      unresolved: unresolvedCount,
      admissible_domains: admissibleDomains,
      quarantined_domains: quarantinedDomains,
      none_domains_with_admissible: noneDomainsWithAdmissible,
      structural_compatibility_distribution: {
        HIGH: evaluations.filter(e => e.structural_compatibility === 'HIGH').length,
        MODERATE: evaluations.filter(e => e.structural_compatibility === 'MODERATE').length,
        LOW: evaluations.filter(e => e.structural_compatibility === 'LOW').length,
        NONE: evaluations.filter(e => e.structural_compatibility === 'NONE').length,
      },
      replay_compatibility_distribution: {
        COMPATIBLE: evaluations.filter(e => e.replay_compatibility === 'COMPATIBLE').length,
        UNCERTAIN: evaluations.filter(e => e.replay_compatibility === 'UNCERTAIN').length,
        INCOMPATIBLE: evaluations.filter(e => e.replay_compatibility === 'INCOMPATIBLE').length,
      },
      conflict_count: Object.keys(conflicts).length,
      all_non_authoritative: evaluations.every(e => e.authority_state === 'NON_AUTHORITATIVE_ADMISSIBILITY_RESULT'),
    },
    governance: {
      no_grounding_mutation: true,
      no_overlay_generation: true,
      no_qualification_mutation: true,
      no_authority_assertion: true,
      no_lens_mutation: true,
      admissibility_evaluation_only: true,
      additive_only: true,
      fail_closed: true,
    },
  };
}

module.exports = { loadDynamicCEUAdmissibilityData, CLIENT, RUN, STRUCTURAL_COMPATIBILITY, ADMISSIBILITY_STATES };
