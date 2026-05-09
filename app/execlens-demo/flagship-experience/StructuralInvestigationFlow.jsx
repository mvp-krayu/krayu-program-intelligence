'use client';

import React from 'react';

/**
 * StructuralInvestigationFlow
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Supports guided executive investigation with bounded transitions:
 *   SUMMARY → EVIDENCE → PROPAGATION → EXPLAINABILITY → LINEAGE
 *
 * Preserves bounded investigation semantics.
 * Does not introduce free-form exploration. Does not introduce prompt interaction.
 * Does not introduce conversational UX.
 */

const INVESTIGATION_STAGES = ['SUMMARY', 'EVIDENCE', 'PROPAGATION', 'EXPLAINABILITY', 'LINEAGE'];

export function resolveInvestigationStage(stage) {
  if (INVESTIGATION_STAGES.includes(stage)) return stage;
  return 'SUMMARY';
}

export function resolveNextStage(currentStage) {
  const idx = INVESTIGATION_STAGES.indexOf(currentStage);
  if (idx === -1 || idx === INVESTIGATION_STAGES.length - 1) return null;
  return INVESTIGATION_STAGES[idx + 1];
}

export function resolvePreviousStage(currentStage) {
  const idx = INVESTIGATION_STAGES.indexOf(currentStage);
  if (idx <= 0) return null;
  return INVESTIGATION_STAGES[idx - 1];
}

export default function StructuralInvestigationFlow({
  currentStage,
  renderState,
  densityClass,
  children,
}) {
  const resolvedStage = resolveInvestigationStage(currentStage || 'SUMMARY');
  const stageIndex = INVESTIGATION_STAGES.indexOf(resolvedStage);
  const nextStage = resolveNextStage(resolvedStage);
  const prevStage = resolvePreviousStage(resolvedStage);

  return (
    <div
      data-investigation-flow="true"
      data-current-stage={resolvedStage}
      data-stage-index={stageIndex}
      data-stage-total={INVESTIGATION_STAGES.length}
      data-next-stage={nextStage || 'none'}
      data-prev-stage={prevStage || 'none'}
      data-render-state={renderState}
      data-no-free-form-exploration="true"
      data-no-prompt-interaction="true"
      data-no-conversational-ux="true"
      data-investigation-bounded="true"
    >
      {children}
    </div>
  );
}
