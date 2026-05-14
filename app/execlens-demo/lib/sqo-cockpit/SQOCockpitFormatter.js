'use strict';

const { getArtifactData, isArtifactAvailable } = require('./SQOCockpitArtifactLoader');

const S_STATE_LABELS = {
  S0: 'Structural Only',
  S1: 'Structural Labels Only',
  S2: 'Partial Grounding with Continuity',
  S3: 'Full Semantic Grounding',
};

const MATURITY_CLASSIFICATIONS = {
  LOW: 'Low',
  PARTIAL: 'Partial',
  STABLE: 'Stable',
  STRONG: 'Strong',
};

const GRAVITY_CLASSIFICATIONS = {
  FRAGMENTED: 'Fragmented',
  EMERGING: 'Emerging',
  STABILIZING: 'Stabilizing',
  GRAVITATIONAL: 'Gravitational',
};

const STABILITY_CLASSIFICATIONS = {
  UNSTABLE: 'Unstable',
  CONDITIONAL: 'Conditional',
  STABLE: 'Stable',
  RESILIENT: 'Resilient',
};

const DEBT_SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function formatOverview(loadResult) {
  const qualState = getArtifactData(loadResult, 'qualification_state');
  const maturity = getArtifactData(loadResult, 'semantic_maturity_profile');
  const gravity = getArtifactData(loadResult, 'semantic_gravity_assessment');
  const stability = getArtifactData(loadResult, 'qualification_stability');
  const progression = getArtifactData(loadResult, 'progression_readiness');
  const debt = getArtifactData(loadResult, 'semantic_debt_inventory');

  return {
    s_state: qualState ? {
      state: qualState.qualification_state.s_state,
      label: S_STATE_LABELS[qualState.qualification_state.s_state] || qualState.qualification_state.state_label,
      reason: qualState.qualification_state.state_reason,
      authorization_tier: qualState.qualification_state.authorization_tier,
      q_class: qualState.evidence ? qualState.evidence.q_class : null,
    } : null,
    maturity: maturity ? {
      score: maturity.overall_maturity_score,
      classification: maturity.overall_classification,
      classification_label: MATURITY_CLASSIFICATIONS[maturity.overall_classification] || maturity.overall_classification,
    } : null,
    gravity: gravity ? {
      score: gravity.semantic_gravity_score,
      classification: gravity.classification,
      classification_label: GRAVITY_CLASSIFICATIONS[gravity.classification] || gravity.classification,
    } : null,
    stability: stability ? {
      score: stability.qualification_stability_score,
      classification: stability.classification,
      classification_label: STABILITY_CLASSIFICATIONS[stability.classification] || stability.classification,
    } : null,
    progression: progression ? {
      readiness: progression.progression_readiness,
      current: progression.current_s_state,
      target: progression.next_s_state_target,
      blocking_count: progression.blocking_debt_count,
      total_debt: progression.total_debt_items,
    } : null,
    debt_summary: debt ? {
      total_items: debt.total_debt_items,
      s_state: debt.s_state,
    } : null,
  };
}

function formatDebtSection(loadResult) {
  const debt = getArtifactData(loadResult, 'semantic_debt_inventory');
  if (!debt) return null;

  const items = (debt.debt_items || []).map(item => ({
    id: item.id,
    category: item.category,
    severity: item.severity,
    description: item.description,
    blocks_s_state: item.blocks_s_state || null,
    has_upstream_dependency: item.has_upstream_dependency || false,
    remediation_pathway: item.remediation ? item.remediation.enrichment_pathway : null,
    remediation_action: item.remediation ? item.remediation.action : null,
    source_material_needed: item.remediation ? item.remediation.source_material_needed : null,
    expected_impact: item.remediation ? item.remediation.expected_impact : null,
    priority: item.priority,
    priority_score: item.priority_score,
    evidence: item.evidence ? {
      artifact_key: item.evidence.artifact_key,
      field_path: item.evidence.field_path,
      current_value: item.evidence.current_value,
      required_value: item.evidence.required_value,
    } : null,
  }));

  items.sort((a, b) => (a.priority || 999) - (b.priority || 999));

  const byCategory = {};
  for (const item of items) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }

  const bySeverity = {};
  for (const item of items) {
    if (!bySeverity[item.severity]) bySeverity[item.severity] = [];
    bySeverity[item.severity].push(item);
  }

  return {
    total_items: debt.total_debt_items,
    items,
    by_category: byCategory,
    by_severity: bySeverity,
    blocking_count: items.filter(i => i.blocks_s_state).length,
  };
}

function formatContinuitySection(loadResult) {
  const continuity = getArtifactData(loadResult, 'continuity_assessment');
  if (!continuity) return null;

  return {
    overall_status: continuity.overall_status,
    coverage_ratio: continuity.coverage_ratio,
    label_fidelity_ratio: continuity.label_fidelity_ratio,
    lineage_strength: continuity.lineage_strength,
    metrics: continuity.metrics || null,
    gaps: (continuity.gaps || []).map(gap => ({
      gap_type: gap.gap_type,
      description: gap.description,
      severity: gap.severity,
      remediation_pathway: gap.remediation_pathway,
      structural_reference: gap.structural_reference,
      semantic_reference: gap.semantic_reference,
    })),
  };
}

function formatMaturitySection(loadResult) {
  const maturity = getArtifactData(loadResult, 'semantic_maturity_profile');
  if (!maturity) return null;

  const gravity = getArtifactData(loadResult, 'semantic_gravity_assessment');
  const stability = getArtifactData(loadResult, 'qualification_stability');
  const breakdown = getArtifactData(loadResult, 'maturity_dimension_breakdown');

  const dimensions = {};
  if (maturity.dimensions) {
    for (const [key, dim] of Object.entries(maturity.dimensions)) {
      dimensions[key] = {
        id: dim.id,
        label: dim.label,
        score: dim.score,
        classification: dim.classification,
        classification_label: MATURITY_CLASSIFICATIONS[dim.classification] || dim.classification,
      };
    }
  }

  return {
    overall: {
      score: maturity.overall_maturity_score,
      classification: maturity.overall_classification,
      classification_label: MATURITY_CLASSIFICATIONS[maturity.overall_classification] || maturity.overall_classification,
    },
    dimensions,
    gravity: gravity ? {
      score: gravity.semantic_gravity_score,
      classification: gravity.classification,
      classification_label: GRAVITY_CLASSIFICATIONS[gravity.classification] || gravity.classification,
      contributing_dimensions: gravity.contributing_dimensions,
    } : null,
    stability: stability ? {
      score: stability.qualification_stability_score,
      classification: stability.classification,
      classification_label: STABILITY_CLASSIFICATIONS[stability.classification] || stability.classification,
      contributing_dimensions: stability.contributing_dimensions,
    } : null,
    dimension_breakdown: breakdown || null,
  };
}

function formatProgressionSection(loadResult) {
  const progression = getArtifactData(loadResult, 'progression_readiness');
  if (!progression) return null;

  const debt = getArtifactData(loadResult, 'semantic_debt_inventory');
  const qualState = getArtifactData(loadResult, 'qualification_state');

  return {
    current_s_state: progression.current_s_state,
    target_s_state: progression.next_s_state_target,
    readiness_score: progression.progression_readiness,
    blocking_debt_count: progression.blocking_debt_count,
    total_debt_items: progression.total_debt_items,
    blocking_debts: (progression.blocking_debts || []).map(d => ({
      id: d.id,
      category: d.category,
      severity: d.severity,
      blocks_s_state: d.blocks_s_state,
      remediation_pathway: d.remediation_pathway,
    })),
    missing_artifacts: qualState && qualState.evidence ? qualState.evidence.required_artifacts_missing : [],
    debt_by_pathway: groupDebtByPathway(progression.blocking_debts || []),
  };
}

function groupDebtByPathway(debts) {
  const grouped = {};
  for (const d of debts) {
    const pathway = d.remediation_pathway || 'UNKNOWN';
    if (!grouped[pathway]) grouped[pathway] = [];
    grouped[pathway].push(d);
  }
  return grouped;
}

function formatEvidenceReplaySection(loadResult) {
  const replayKeys = [
    { key: 'maturity_replay_verification', label: 'Maturity Scoring' },
    { key: 'qualification_state_replay_verification', label: 'Qualification State' },
    { key: 'debt_replay_verification', label: 'Debt Inventory' },
  ];

  const certKeys = [
    { key: 'maturity_certification', label: 'Maturity Certification' },
    { key: 'qualification_state_certification', label: 'Qualification State Certification' },
    { key: 'debt_certification', label: 'Debt Certification' },
  ];

  const replays = replayKeys.map(({ key, label }) => {
    const data = getArtifactData(loadResult, key);
    if (!data) return { key, label, available: false, verdict: null, checks: null };
    return {
      key,
      label,
      available: true,
      verdict: data.overall_verdict,
      checks: data.checks ? Object.entries(data.checks).map(([name, check]) => ({
        name,
        pass: check.pass,
        detail: check,
      })) : null,
    };
  });

  const certifications = certKeys.map(({ key, label }) => {
    const data = getArtifactData(loadResult, key);
    if (!data) return { key, label, available: false, status: null, checks: null };

    const cases = data.checks || data.certification_cases || data.cases || [];
    const allPassed = cases.length > 0 && cases.every(c => c.pass);
    const status = data.certification_status || (allPassed ? 'CERTIFIED' : 'NOT_CERTIFIED');

    return {
      key,
      label,
      available: true,
      status,
      checks: cases.map(c => ({ name: c.name || c.case_id || c.label, pass: c.pass })),
    };
  });

  return {
    replays,
    certifications,
    all_replays_passed: replays.filter(r => r.available).every(r => r.verdict === 'PASS'),
    all_certifications_passed: certifications.filter(c => c.available).every(c => c.status === 'CERTIFIED'),
  };
}

function formatHandoffSection(loadResult, handoffStatus) {
  const qualState = getArtifactData(loadResult, 'qualification_state');
  const maturity = getArtifactData(loadResult, 'semantic_maturity_profile');
  const progression = getArtifactData(loadResult, 'progression_readiness');

  return {
    ready: handoffStatus ? handoffStatus.ready : false,
    blocking_conditions: handoffStatus ? handoffStatus.blocking_conditions : [],
    reason: handoffStatus ? handoffStatus.reason : 'STATUS_UNKNOWN',
    package_summary: {
      s_state: qualState ? qualState.qualification_state.s_state : null,
      q_class: qualState && qualState.evidence ? qualState.evidence.q_class : null,
      maturity_score: maturity ? maturity.overall_maturity_score : null,
      maturity_classification: maturity ? maturity.overall_classification : null,
      progression_readiness: progression ? progression.progression_readiness : null,
      blocking_debt_count: progression ? progression.blocking_debt_count : null,
    },
    governance: {
      cockpit_prepares_package: true,
      path_b_decides_acceptance: true,
      no_direct_lens_emission: true,
    },
  };
}

function formatHistorySection(loadResult) {
  const history = getArtifactData(loadResult, 'qualification_history');
  if (!history) return null;

  return {
    current_state: history.current_state,
    prior_state: history.prior_state,
    entries: (history.history_entries || []).map(entry => ({
      timestamp: entry.timestamp,
      s_state: entry.s_state,
      state_label: entry.state_label,
      prior_state: entry.prior_state,
      transition_type: entry.transition_type,
      transition_cause: entry.transition_cause,
      evidence_snapshot: entry.evidence_snapshot || null,
    })),
  };
}

module.exports = {
  S_STATE_LABELS,
  MATURITY_CLASSIFICATIONS,
  GRAVITY_CLASSIFICATIONS,
  STABILITY_CLASSIFICATIONS,
  formatOverview,
  formatDebtSection,
  formatContinuitySection,
  formatMaturitySection,
  formatProgressionSection,
  formatEvidenceReplaySection,
  formatHandoffSection,
  formatHistorySection,
};
