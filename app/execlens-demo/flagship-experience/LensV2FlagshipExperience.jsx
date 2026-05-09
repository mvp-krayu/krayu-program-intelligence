'use client';

import React from 'react';
import { resolveRevealSequence, resolveMotionProfile } from '../components/experiential-realization/MotionSemanticController';
import { resolveExperientialDensityLayout } from '../components/experiential-realization/IntelligenceDensityOrchestrator';
import ExecutiveBoardroomMode from './ExecutiveBoardroomMode';
import OperationalGravitySystem from './OperationalGravitySystem';
import IntelligenceRevealCinema from './IntelligenceRevealCinema';
import StructuralInvestigationFlow from './StructuralInvestigationFlow';
import ExecutiveOperationalCanvas from './ExecutiveOperationalCanvas';
import TopologySafeVisualRealization from './TopologySafeVisualRealization';
import ExecutiveAttentionDirector from './ExecutiveAttentionDirector';
import IntelligencePresenceLayer from './IntelligencePresenceLayer';

/**
 * LensV2FlagshipExperience
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * The first fully integrated LENS v2 Executive Intelligence Experience.
 *
 * Orchestrates the entire cinematic executive intelligence surface by composing:
 *   - readiness systems
 *   - executive narrative
 *   - propagation explainability
 *   - cinematic reveal orchestration
 *   - operational posture
 *   - investigation continuity
 *   - executive presentation mode
 *
 * Integrates all major experiential systems built across PI.LENS streams 1–14.
 *
 * Does NOT:
 *   - compute intelligence
 *   - mutate evidence
 *   - generate narrative
 *   - mutate topology
 *   - introduce AI interaction
 *   - introduce chatbot UX
 *   - introduce prompt surfaces
 *   - animate propagation flow (VIS-PROP-02)
 *
 * All props are pre-resolved by the adaptReport() pipeline (adapters/index.js).
 * This component is pure rendering — it receives governed state and renders it.
 */
export default function LensV2FlagshipExperience({
  adaptedProps,
  renderState,
  qualifierClass,
  densityClass,
  boardroomMode,
  presentationMode,
  investigationStage,
}) {
  const resolvedDensity = densityClass || 'EXECUTIVE_DENSE';
  const resolvedStage = investigationStage || 'SUMMARY';

  const revealSequence = resolveRevealSequence(renderState);
  const motionProfile = resolveMotionProfile(renderState);
  const densityLayout = resolveExperientialDensityLayout(
    resolvedDensity,
    renderState,
    adaptedProps || {}
  );

  const props = adaptedProps || {};
  const isBlocked = renderState === 'BLOCKED';
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY';
  const hasQualifier = qualifierClass && qualifierClass !== 'Q-00';

  return (
    <IntelligencePresenceLayer renderState={renderState} qualifierClass={qualifierClass}>
      <OperationalGravitySystem renderState={renderState} densityClass={resolvedDensity}>
        <ExecutiveBoardroomMode
          active={!!boardroomMode}
          renderState={renderState}
          densityClass={resolvedDensity}
        >
          <ExecutiveAttentionDirector renderState={renderState} qualifierClass={qualifierClass}>
            <ExecutiveOperationalCanvas
              renderState={renderState}
              densityClass={resolvedDensity}
              qualifierClass={qualifierClass}
            >
              <IntelligenceRevealCinema renderState={renderState} qualifierClass={qualifierClass}>
                <StructuralInvestigationFlow
                  currentStage={resolvedStage}
                  renderState={renderState}
                  densityClass={resolvedDensity}
                >

                  {/* BLOCKED STATE — assertive, non-degradable, sole content */}
                  {isBlocked && (
                    <div
                      data-blocked-escalation="true"
                      role="alert"
                      aria-live="assertive"
                      data-motion-profile={motionProfile.profile}
                      data-topology-interactive="false"
                      data-topology-editable="false"
                      data-topology-animated="false"
                    >
                      <div data-blocked-headline="true">
                        {props.blocked_headline || 'Readiness classification unavailable'}
                      </div>
                      {props.blocked_reason && (
                        <div data-blocked-reason="true">
                          {props.blocked_reason}
                        </div>
                      )}
                      <div data-evidence-references-preserved="true" aria-hidden="true" />
                    </div>
                  )}

                  {/* DIAGNOSTIC ESCALATION — always before content */}
                  {isDiagnostic && (
                    <div
                      data-diagnostic-escalation="true"
                      role="status"
                      aria-live="polite"
                    >
                      <div data-diagnostic-headline="true">
                        {props.diagnostic_headline || 'Structural assessment is under advisory review.'}
                      </div>
                      {props.diagnostic_detail && (
                        <div data-diagnostic-detail="true">{props.diagnostic_detail}</div>
                      )}
                    </div>
                  )}

                  {/* READINESS COMMAND — always present for non-blocked states */}
                  {!isBlocked && revealSequence.phases.includes('READINESS_BADGE') && (
                    <div
                      data-readiness-command="true"
                      data-render-state={renderState}
                      data-motion-profile={motionProfile.profile}
                    >
                      {props.readiness_state_label && (
                        <div data-readiness-badge="true">{props.readiness_state_label}</div>
                      )}
                    </div>
                  )}

                  {/* QUALIFIER NOTICE — globally persistent for Q-01..Q-03 */}
                  {!isBlocked && densityLayout.qualifier_notice_visible && (
                    <div
                      data-qualifier-notice="true"
                      data-qualifier-class={qualifierClass}
                      data-qualifier-cannot-be-suppressed="true"
                      role="note"
                    >
                      {props.qualifier_notice_text || 'Advisory qualification applies. Confirmation recommended before executive action.'}
                    </div>
                  )}

                  {/* Q-04 ABSENCE NOTICE — always explicit, never silent */}
                  {!isBlocked && densityLayout.q04_absence_notice_visible && (
                    <div
                      data-q04-absence-notice="true"
                      data-qualifier-class="Q-04"
                      role="note"
                    >
                      Signal intelligence withheld from this view.
                    </div>
                  )}

                  {/* INTELLIGENCE NARRATIVE — executive summary + WHY */}
                  {densityLayout.show_executive_summary && (
                    <div data-intelligence-narrative="true">
                      <div data-executive-summary="true">
                        {props.executive_summary}
                      </div>
                      {densityLayout.show_why_statement && props.why_primary_statement && (
                        <div data-why-statement="true">
                          {props.why_primary_statement}
                        </div>
                      )}
                      {densityLayout.show_structural_findings && props.structural_summary && (
                        <div data-structural-findings="true">
                          {props.structural_summary}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PROPAGATION ZONE — topology-safe, static, non-animated */}
                  {densityLayout.show_propagation_posture && (
                    <div data-propagation-zone="true">
                      <TopologySafeVisualRealization
                        propagation_chains={props.propagation_chains || []}
                        renderState={renderState}
                        densityClass={resolvedDensity}
                      />
                    </div>
                  )}

                  {/* EVIDENCE LAYER — always accessible; references always preserved */}
                  {densityLayout.show_evidence_posture && (
                    <div
                      data-evidence-layer="true"
                      data-evidence-references-preserved="true"
                    >
                      {props.evidence_blocks && props.evidence_blocks.length > 0 ? (
                        props.evidence_blocks.map((block, i) => (
                          <div key={i} data-evidence-block={i} data-domain-alias={block.domain_alias}>
                            <div data-propagation-role={block.propagation_role} />
                            <div data-grounding-status={block.grounding_status} />
                          </div>
                        ))
                      ) : (
                        <div data-no-evidence-blocks="true">No evidence blocks available.</div>
                      )}
                    </div>
                  )}

                </StructuralInvestigationFlow>
              </IntelligenceRevealCinema>
            </ExecutiveOperationalCanvas>
          </ExecutiveAttentionDirector>
        </ExecutiveBoardroomMode>
      </OperationalGravitySystem>
    </IntelligencePresenceLayer>
  );
}
