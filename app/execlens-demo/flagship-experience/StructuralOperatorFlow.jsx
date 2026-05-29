'use client';

import React from 'react';

/**
 * StructuralOperatorFlow
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Supports guided executive operator with bounded transitions:
 *   SUMMARY → EVIDENCE → PROPAGATION → EXPLAINABILITY → LINEAGE
 *
 * Preserves bounded operator semantics.
 * Does not introduce free-form exploration. Does not introduce prompt interaction.
 * Does not introduce conversational UX.
 */

const OPERATOR_STAGES = ['SUMMARY', 'EVIDENCE', 'PROPAGATION', 'EXPLAINABILITY', 'LINEAGE'];

export function resolveOperatorStage(stage) {
  if (OPERATOR_STAGES.includes(stage)) return stage;
  return 'SUMMARY';
}

export function resolveNextStage(currentStage) {
  const idx = OPERATOR_STAGES.indexOf(currentStage);
  if (idx === -1 || idx === OPERATOR_STAGES.length - 1) return null;
  return OPERATOR_STAGES[idx + 1];
}

export function resolvePreviousStage(currentStage) {
  const idx = OPERATOR_STAGES.indexOf(currentStage);
  if (idx <= 0) return null;
  return OPERATOR_STAGES[idx - 1];
}

export default function StructuralOperatorFlow({
  currentStage,
  renderState,
  densityClass,
  children,
}) {
  const resolvedStage = resolveOperatorStage(currentStage || 'SUMMARY');
  const stageIndex = OPERATOR_STAGES.indexOf(resolvedStage);
  const nextStage = resolveNextStage(resolvedStage);
  const prevStage = resolvePreviousStage(resolvedStage);

  return (
    <div
      data-operator-flow="true"
      data-current-stage={resolvedStage}
      data-stage-index={stageIndex}
      data-stage-total={OPERATOR_STAGES.length}
      data-next-stage={nextStage || 'none'}
      data-prev-stage={prevStage || 'none'}
      data-render-state={renderState}
      data-no-free-form-exploration="true"
      data-no-prompt-interaction="true"
      data-no-conversational-ux="true"
      data-operator-bounded="true"
    >
      {children}
    </div>
  );
}
