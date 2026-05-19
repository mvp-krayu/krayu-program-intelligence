'use strict';

const POSTURE = {
  STRUCTURAL_ONLY: 'STRUCTURAL_ONLY',
  SEMANTIC_INTAKE: 'SEMANTIC_INTAKE',
  QUALIFICATION_PENDING: 'QUALIFICATION_PENDING',
  CROSSWALK_ACTIVE: 'CROSSWALK_ACTIVE',
  RECONCILIATION_ACTIVE: 'RECONCILIATION_ACTIVE',
  QUALIFIED: 'QUALIFIED',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
  PERMANENTLY_UNQUALIFIABLE: 'PERMANENTLY_UNQUALIFIABLE',
};

const POSTURE_LABELS = {
  [POSTURE.STRUCTURAL_ONLY]: 'Structural Only',
  [POSTURE.SEMANTIC_INTAKE]: 'Semantic Intake',
  [POSTURE.QUALIFICATION_PENDING]: 'Qualification Pending',
  [POSTURE.CROSSWALK_ACTIVE]: 'Crosswalk Active',
  [POSTURE.RECONCILIATION_ACTIVE]: 'Reconciliation Active',
  [POSTURE.QUALIFIED]: 'Qualified',
  [POSTURE.INSUFFICIENT_EVIDENCE]: 'Insufficient Evidence',
  [POSTURE.PERMANENTLY_UNQUALIFIABLE]: 'Permanently Unqualifiable',
};

function resolveQualificationPosture(promotionState, qualificationBlockers, runtimeCapabilities) {
  if (!promotionState && !runtimeCapabilities) {
    return { posture: POSTURE.STRUCTURAL_ONLY, postureLabel: POSTURE_LABELS[POSTURE.STRUCTURAL_ONLY], s_level: null, summary: 'No qualification data available.' };
  }

  const sLevel = promotionState ? promotionState.s_level : null;
  const caps = runtimeCapabilities || {};

  if (promotionState && promotionState.insufficiency_permanent) {
    return {
      posture: POSTURE.PERMANENTLY_UNQUALIFIABLE,
      postureLabel: POSTURE_LABELS[POSTURE.PERMANENTLY_UNQUALIFIABLE],
      s_level: sLevel,
      summary: 'Permanent insufficiency acknowledged. Evidence does not support further qualification progression.',
    };
  }

  if (promotionState && promotionState.insufficiency_acknowledged && !promotionState.insufficiency_permanent) {
    return {
      posture: POSTURE.INSUFFICIENT_EVIDENCE,
      postureLabel: POSTURE_LABELS[POSTURE.INSUFFICIENT_EVIDENCE],
      s_level: sLevel,
      summary: 'Insufficient evidence for qualification progression. Determination may be revisited.',
    };
  }

  if (sLevel === 'S2' || sLevel === 'S3') {
    return {
      posture: POSTURE.QUALIFIED,
      postureLabel: POSTURE_LABELS[POSTURE.QUALIFIED],
      s_level: sLevel,
      summary: sLevel === 'S3' ? 'Authority-ready qualification.' : 'Qualified with potential debt.',
    };
  }

  if (caps.static_reconciliation || caps.static_reconciliation_loop) {
    return {
      posture: POSTURE.RECONCILIATION_ACTIVE,
      postureLabel: POSTURE_LABELS[POSTURE.RECONCILIATION_ACTIVE],
      s_level: sLevel,
      summary: 'Reconciliation in progress. PATH A and PATH B correspondence under assessment.',
    };
  }

  const blockers = qualificationBlockers ? qualificationBlockers.blockers || [] : [];
  const hasCrosswalkBlocker = blockers.some(b => b.lane === 'crosswalk');
  if (hasCrosswalkBlocker && caps.semantic_candidates) {
    return {
      posture: POSTURE.CROSSWALK_ACTIVE,
      postureLabel: POSTURE_LABELS[POSTURE.CROSSWALK_ACTIVE],
      s_level: sLevel,
      summary: 'Semantic intake complete. Crosswalk construction required for qualification advancement.',
    };
  }

  if (caps.review_obligations) {
    return {
      posture: POSTURE.QUALIFICATION_PENDING,
      postureLabel: POSTURE_LABELS[POSTURE.QUALIFICATION_PENDING],
      s_level: sLevel,
      summary: 'Review obligations exist. Qualification pending operator review actions.',
    };
  }

  if (caps.semantic_candidates) {
    return {
      posture: POSTURE.SEMANTIC_INTAKE,
      postureLabel: POSTURE_LABELS[POSTURE.SEMANTIC_INTAKE],
      s_level: sLevel,
      summary: 'Semantic candidate intake available. Structural onboarding complete.',
    };
  }

  if (caps.structural_topology) {
    return {
      posture: POSTURE.STRUCTURAL_ONLY,
      postureLabel: POSTURE_LABELS[POSTURE.STRUCTURAL_ONLY],
      s_level: sLevel,
      summary: 'Structural topology available. No semantic authority yet.',
    };
  }

  return {
    posture: POSTURE.STRUCTURAL_ONLY,
    postureLabel: POSTURE_LABELS[POSTURE.STRUCTURAL_ONLY],
    s_level: sLevel,
    summary: 'Minimal qualification data.',
  };
}

module.exports = { POSTURE, POSTURE_LABELS, resolveQualificationPosture };
