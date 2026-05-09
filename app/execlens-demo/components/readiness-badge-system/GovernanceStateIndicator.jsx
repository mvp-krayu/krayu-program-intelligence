'use client';

import React from 'react';
import { mapGovernanceState, mapBlockedState, mapDiagnosticState } from './VisualSemanticMapper';

/**
 * GovernanceStateIndicator
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Visually distinguishes governance states: PASS, FAIL, BLOCKED, DIAGNOSTIC.
 * Never silently degrades. Blocked and diagnostic states are always explicit.
 *
 * Props:
 *   governance_verdict  — PASS | FAIL
 *   renderState         — BLOCKED | DIAGNOSTIC_ONLY | EXECUTIVE_READY | ...
 */
export default function GovernanceStateIndicator({ governance_verdict, renderState }) {
  const state = mapGovernanceState(governance_verdict, renderState);

  if (state.blocked_visible) {
    const blocked = mapBlockedState();
    return (
      <div
        data-component="governance-state-indicator"
        data-governance-indicator={state.governance_indicator}
        data-badge-token={blocked.badge_token}
        role="alert"
        aria-live="assertive"
      >
        <span data-field="blocked-indicator" data-token={blocked.badge_token}>
          {blocked.blocked_headline}
        </span>
      </div>
    );
  }

  if (state.diagnostic_visible) {
    const diagnostic = mapDiagnosticState();
    return (
      <div
        data-component="governance-state-indicator"
        data-governance-indicator="DIAGNOSTIC"
        data-badge-token={diagnostic.badge_token}
        role="status"
        aria-live="polite"
      >
        <span data-field="diagnostic-indicator" data-token={diagnostic.badge_token}>
          {diagnostic.banner_text}
        </span>
      </div>
    );
  }

  // PASS — governance indicator present but non-intrusive
  return (
    <div
      data-component="governance-state-indicator"
      data-governance-indicator={state.governance_indicator}
      data-badge-token={state.badge_token}
    >
      <span data-field="governance-pass-indicator" data-token={state.badge_token}>
        Governance: Pass
      </span>
    </div>
  );
}
