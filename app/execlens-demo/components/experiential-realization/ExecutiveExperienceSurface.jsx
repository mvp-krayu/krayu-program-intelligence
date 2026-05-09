'use client';

import React from 'react';
import { resolveRevealSequence, resolveMotionProfile } from './MotionSemanticController';
import { resolveExperientialDensityLayout } from './IntelligenceDensityOrchestrator';
import StructuralAuthorityFrame from './StructuralAuthorityFrame';
import IntelligenceRevealOrchestrator from './IntelligenceRevealOrchestrator';
import ExecutiveRevealPanel from './ExecutiveRevealPanel';
import ExecutivePresentationMode from './ExecutivePresentationMode';
import TopologySafeVisualSurface from './TopologySafeVisualSurface';

/**
 * ExecutiveExperienceSurface
 *
 * Orchestrates the cinematic executive intelligence experience.
 * Composes all major executive regions.
 * Manages reveal sequencing via MotionSemanticController.
 * Manages density via IntelligenceDensityOrchestrator.
 *
 * Does not compute intelligence. Does not mutate evidence.
 * Does not generate narrative. Does not infer propagation. Does not mutate topology.
 */
export default function ExecutiveExperienceSurface({
  adaptedProps,
  renderState,
  qualifierClass,
  densityClass,
  presentationMode,
}) {
  const revealSequence = resolveRevealSequence(renderState);
  const motionProfile = resolveMotionProfile(renderState);
  const densityLayout = resolveExperientialDensityLayout(
    densityClass || 'EXECUTIVE_DENSE',
    renderState,
    adaptedProps || {}
  );

  const props = adaptedProps || {};
  const isBlocked = renderState === 'BLOCKED';
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY';

  return (
    <StructuralAuthorityFrame
      renderState={renderState}
      densityClass={densityClass}
      qualifierClass={qualifierClass}
    >
      <ExecutivePresentationMode
        active={!!presentationMode}
        densityClass={densityClass}
        renderState={renderState}
      >
        <IntelligenceRevealOrchestrator
          renderState={renderState}
          qualifierClass={qualifierClass}
        >
          {/* Blocked state: assertive notice replaces all content */}
          {isBlocked && (
            <ExecutiveRevealPanel phase="BLOCKED_ESCALATION" renderState={renderState} label="Blocked">
              <div
                data-blocked-notice="true"
                role="alert"
                aria-live="assertive"
              >
                {props.blocked_headline || 'Readiness classification unavailable'}
              </div>
            </ExecutiveRevealPanel>
          )}

          {/* Diagnostic escalation — always before content */}
          {isDiagnostic && (
            <ExecutiveRevealPanel phase="DIAGNOSTIC_ESCALATION" renderState={renderState} label="Diagnostic Notice">
              <div
                data-diagnostic-notice="true"
                role="status"
                aria-live="polite"
              >
                This report contains content under advisory review. Advisory confirmation recommended.
              </div>
            </ExecutiveRevealPanel>
          )}

          {/* Readiness badge region */}
          {!isBlocked && revealSequence.phases.includes('READINESS_BADGE') && (
            <ExecutiveRevealPanel phase="READINESS_BADGE" renderState={renderState} label="Readiness">
              <div data-readiness-region="true" data-render-state={renderState} />
            </ExecutiveRevealPanel>
          )}

          {/* Qualifier notice — immediately follows READINESS_BADGE when Q-01..Q-03 */}
          {!isBlocked && densityLayout.qualifier_notice_visible && (
            <ExecutiveRevealPanel phase="QUALIFIER_NOTICE" renderState={renderState} label="Qualifier">
              <div data-qualifier-notice="true" data-qualifier-class={qualifierClass} />
            </ExecutiveRevealPanel>
          )}

          {/* Q-04 absence notice — always explicit, never silent */}
          {!isBlocked && densityLayout.q04_absence_notice_visible && (
            <div data-q04-absence-notice="true" role="note">
              Signal intelligence withheld from this view.
            </div>
          )}

          {/* Executive narrative region */}
          {densityLayout.show_executive_summary && (
            <ExecutiveRevealPanel phase="EXECUTIVE_NARRATIVE" renderState={renderState} label="Executive Summary">
              <div data-executive-summary="true">{props.executive_summary}</div>
            </ExecutiveRevealPanel>
          )}

          {/* WHY narrative — within EXECUTIVE_NARRATIVE phase */}
          {densityLayout.show_why_statement && props.why_primary_statement && (
            <ExecutiveRevealPanel phase="EXECUTIVE_NARRATIVE" renderState={renderState} label="Why">
              <div data-why-statement="true">{props.why_primary_statement}</div>
            </ExecutiveRevealPanel>
          )}

          {/* Propagation posture region */}
          {densityLayout.show_propagation_posture && (
            <ExecutiveRevealPanel phase="PROPAGATION_POSTURE" renderState={renderState} label="Propagation">
              <TopologySafeVisualSurface
                propagation_chains={props.propagation_chains || []}
                renderState={renderState}
                densityClass={densityClass}
              />
            </ExecutiveRevealPanel>
          )}

          {/* Evidence posture region */}
          {densityLayout.show_evidence_posture && (
            <ExecutiveRevealPanel phase="EVIDENCE_POSTURE" renderState={renderState} label="Evidence">
              <div
                data-evidence-posture="true"
                data-evidence-references-preserved="true"
              />
            </ExecutiveRevealPanel>
          )}
        </IntelligenceRevealOrchestrator>
      </ExecutivePresentationMode>
    </StructuralAuthorityFrame>
  );
}
