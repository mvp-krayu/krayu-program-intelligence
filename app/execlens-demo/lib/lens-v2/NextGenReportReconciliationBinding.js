'use strict';

function buildReportQualificationSection(binding) {
  if (!binding || !binding.available || !binding.trustPosture) return null;
  const tp = binding.trustPosture;
  return {
    trust_level: tp.level,
    trust_label: tp.label,
    trust_color: tp.color,
    s_state: tp.s_state,
    q_class: tp.q_class,
    grounding_ratio: tp.grounding_ratio,
    grounding_pct: tp.grounding_pct,
    maturity_score: tp.maturity_score,
    maturity_classification: tp.maturity_classification,
    gravity_score: tp.gravity_score,
    gravity_classification: tp.gravity_classification,
    stability_score: tp.stability_score,
    stability_classification: tp.stability_classification,
    progression_readiness: tp.progression_readiness,
    progression_target: tp.progression_target,
  };
}

function buildReportReconciliationSection(binding) {
  if (!binding || !binding.available || !binding.structuralBacking) return null;
  const sb = binding.structuralBacking;
  return {
    total_domains: sb.total_domains,
    reconciled: sb.reconciled,
    unreconciled: sb.unreconciled,
    reconciliation_ratio: sb.reconciliation_ratio,
    reconciliation_pct: sb.reconciliation_pct,
    weighted_confidence: sb.weighted_confidence,
    trend: sb.trend,
    unresolved_count: sb.unresolved_count,
  };
}

function buildReportDebtSection(binding) {
  if (!binding || !binding.available || !binding.debtVisibility) return null;
  const dv = binding.debtVisibility;
  return {
    total_items: dv.total_items,
    blocking_count: dv.blocking_count,
    weighted_debt_score: dv.weighted_debt_score,
    operational_exposure: dv.operational_exposure,
    qualification_impact: dv.qualification_impact,
    irreducible_count: dv.irreducible_count,
    reducible_count: dv.reducible_count,
    has_blocking_debt: dv.has_blocking_debt,
    exposure_color: dv.exposure_color,
  };
}

function buildReportStructuralBackingMatrix(binding) {
  if (!binding || !binding.available || !binding.structuralBacking) return null;
  const sb = binding.structuralBacking;
  return {
    total_domains: sb.total_domains,
    reconciled: sb.reconciled,
    unreconciled: sb.unreconciled,
    reconciliation_pct: sb.reconciliation_pct,
    weighted_confidence: sb.weighted_confidence,
    unresolved_domains: sb.unresolved_domains || [],
  };
}

function buildReportTemporalNarrative(binding) {
  if (!binding || !binding.available || !binding.temporalVisibility) return null;
  const tv = binding.temporalVisibility;
  return {
    trend: tv.trend,
    trend_color: tv.trend_color,
    enrichment_grade: tv.enrichment_grade,
    enrichment_lift_pct: tv.enrichment_lift_pct,
    debt_reduction_ratio: tv.debt_reduction_ratio,
    debt_reduction_pct: tv.debt_reduction_pct,
    persistent_unresolved: tv.persistent_unresolved,
    degradation_detected: tv.degradation_detected,
  };
}

function buildReportUnresolvedDisclosure(binding) {
  if (!binding || !binding.available || !binding.structuralBacking) return null;
  const sb = binding.structuralBacking;
  if (!sb.unresolved_domains || sb.unresolved_domains.length === 0) return null;
  return {
    unresolved_count: sb.unresolved_count,
    unresolved_domains: sb.unresolved_domains,
    disclosure_required: true,
  };
}

function buildReportTrustPosture(binding) {
  if (!binding || !binding.available || !binding.trustPosture) return null;
  const tp = binding.trustPosture;
  return {
    level: tp.level,
    tier_level: tp.tier_level,
    label: tp.label,
    color: tp.color,
    s_state: tp.s_state,
    q_class: tp.q_class,
    grounding_pct: tp.grounding_pct,
    maturity_classification: tp.maturity_classification,
  };
}

function buildReportExecutiveDisclosure(binding) {
  if (!binding || !binding.available) {
    return {
      available: false,
      disclosure_items: [
        'Qualification substrate unavailable — report rendered without SQO posture data',
      ],
    };
  }

  const items = [];
  const tp = binding.trustPosture;
  const dv = binding.debtVisibility;
  const sb = binding.structuralBacking;

  if (tp) {
    if (tp.q_class && tp.q_class !== 'Q-01') {
      items.push(`Qualification class ${tp.q_class} — not fully grounded. ${tp.grounding_pct}% structurally grounded.`);
    }
    if (tp.level === 'NONE' || tp.level === 'HYDRATED') {
      items.push(`Trust posture ${tp.label} — structural backing is ${tp.level === 'NONE' ? 'absent' : 'partial'}.`);
    }
  }

  if (dv && dv.has_blocking_debt) {
    items.push(`${dv.blocking_count} blocking debt items prevent qualification advancement.`);
  }

  if (sb && sb.unresolved_count > 0) {
    items.push(`${sb.unresolved_count} semantic domains remain unresolved — disclosed below.`);
  }

  return {
    available: true,
    disclosure_required: items.length > 0,
    disclosure_items: items,
  };
}

function buildReportPropagationSection(binding) {
  if (!binding || !binding.available || !binding.propagationVisibility) return null;
  const pv = binding.propagationVisibility;
  return {
    ready: pv.ready,
    gates_met: pv.gates_met,
    gate_count: pv.gate_count,
    blocking_gates: pv.blocking_gates,
    readiness_score: pv.readiness_score,
    readiness_pct: pv.readiness_pct,
    gate_color: pv.gate_color,
  };
}

function buildReportEvidenceIntegritySection(binding) {
  if (!binding || !binding.available || !binding.evidenceVisibility) return null;
  const ev = binding.evidenceVisibility;
  return {
    total_items: ev.total_items,
    accepted: ev.accepted,
    rejected: ev.rejected,
    quarantined: ev.quarantined,
    all_valid: ev.all_valid,
    covered_domains: ev.covered_domains,
    integrity_color: ev.integrity_color,
  };
}

function buildNextGenReportBinding(substrateBinding) {
  if (!substrateBinding || !substrateBinding.available) {
    return {
      available: false,
      reason: substrateBinding ? substrateBinding.reason : 'NO_SUBSTRATE_BINDING',
      sections: null,
      executiveDisclosure: buildReportExecutiveDisclosure(null),
    };
  }

  return {
    available: true,
    sections: {
      qualification: buildReportQualificationSection(substrateBinding),
      reconciliation: buildReportReconciliationSection(substrateBinding),
      debt: buildReportDebtSection(substrateBinding),
      structuralBacking: buildReportStructuralBackingMatrix(substrateBinding),
      temporalNarrative: buildReportTemporalNarrative(substrateBinding),
      unresolvedDisclosure: buildReportUnresolvedDisclosure(substrateBinding),
      trustPosture: buildReportTrustPosture(substrateBinding),
      propagation: buildReportPropagationSection(substrateBinding),
      evidenceIntegrity: buildReportEvidenceIntegritySection(substrateBinding),
    },
    executiveDisclosure: buildReportExecutiveDisclosure(substrateBinding),
  };
}

function validateReportRuntimeParity(reportBinding, substrateBinding) {
  const checks = [];

  if (!reportBinding || !reportBinding.available) {
    checks.push({ check: 'REPORT_BINDING_AVAILABLE', pass: false, detail: 'Report binding unavailable' });
    return { pass: false, checks };
  }
  if (!substrateBinding || !substrateBinding.available) {
    checks.push({ check: 'SUBSTRATE_BINDING_AVAILABLE', pass: false, detail: 'Substrate binding unavailable' });
    return { pass: false, checks };
  }

  const s = reportBinding.sections;
  const rt = substrateBinding;

  if (s.qualification && rt.trustPosture) {
    const match = s.qualification.s_state === rt.trustPosture.s_state
      && s.qualification.q_class === rt.trustPosture.q_class
      && s.qualification.trust_level === rt.trustPosture.level;
    checks.push({ check: 'QUALIFICATION_PARITY', pass: match, detail: match ? 'S-state, Q-class, trust level match' : 'Mismatch detected' });
  }

  if (s.reconciliation && rt.structuralBacking) {
    const match = s.reconciliation.reconciliation_pct === rt.structuralBacking.reconciliation_pct
      && s.reconciliation.total_domains === rt.structuralBacking.total_domains;
    checks.push({ check: 'RECONCILIATION_PARITY', pass: match, detail: match ? 'Reconciliation ratio and domain count match' : 'Mismatch detected' });
  }

  if (s.debt && rt.debtVisibility) {
    const match = s.debt.total_items === rt.debtVisibility.total_items
      && s.debt.blocking_count === rt.debtVisibility.blocking_count;
    checks.push({ check: 'DEBT_PARITY', pass: match, detail: match ? 'Debt total and blocking count match' : 'Mismatch detected' });
  }

  if (s.trustPosture && rt.trustPosture) {
    const match = s.trustPosture.level === rt.trustPosture.level
      && s.trustPosture.grounding_pct === rt.trustPosture.grounding_pct;
    checks.push({ check: 'TRUST_POSTURE_PARITY', pass: match, detail: match ? 'Trust level and grounding match' : 'Mismatch detected' });
  }

  const allPass = checks.every(c => c.pass);
  return { pass: allPass, checks };
}

module.exports = {
  buildReportQualificationSection,
  buildReportReconciliationSection,
  buildReportDebtSection,
  buildReportStructuralBackingMatrix,
  buildReportTemporalNarrative,
  buildReportUnresolvedDisclosure,
  buildReportTrustPosture,
  buildReportExecutiveDisclosure,
  buildReportPropagationSection,
  buildReportEvidenceIntegritySection,
  buildNextGenReportBinding,
  validateReportRuntimeParity,
};
