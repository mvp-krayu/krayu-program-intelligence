# SQO Cockpit Governance Rules

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Rule 1: Read-only artifact consumption

The cockpit reads SQO artifacts. It never mutates them. All SQO artifact changes come from engine re-runs, not from cockpit actions.

## Rule 2: No direct SQO→LENS rendering

The cockpit never emits directly into the LENS projection surface. All LENS rendering goes through PATH B governed projection objects.

## Rule 3: No AI interpretation

The cockpit displays deterministic, evidence-linked data from SQO artifacts. No AI-generated summaries, no probabilistic assessments, no "intelligent" recommendations beyond documented remediation pathways.

## Rule 4: No semantic fabrication

The cockpit never fabricates source material, domain labels, crosswalk entries, or validation results. These must come from the semantic pipeline processing authentic client-provided source material.

## Rule 5: Deterministic display

Same artifacts → same cockpit display. No session-dependent rendering. No user-preference-influenced data interpretation. Display logic is deterministic.

## Rule 6: Fail-visible

Missing or corrupt artifacts → explicit absence notice. The cockpit never appears "complete" when data is missing. Every section has a defined empty/degraded state.

## Rule 7: Governance-classified rendering

Every cockpit element is classified by its governance layer:
- L4 (qualification) — SQO-specific data
- L3 (executive) — authorization and gating
- No layer mixing without explicit classification

## Rule 8: No chatbot behavior

The cockpit is a structured operational workbench. No conversational interfaces. No natural language query surfaces. No "ask about your qualification state" patterns.

## Rule 9: PATH B handoff authority

The cockpit prepares handoff packages. PATH B decides whether to accept them. The cockpit cannot override PATH B decisions. Handoff rejection must be respected.

## Rule 10: Additive-only cockpit artifacts

Any artifacts the cockpit creates (tracking records, checklists, package exports) are additive-only. They never overwrite SQO engine artifacts. They have no authority over engine computation.

## Rule 11: No S-state override

S-state is deterministically detected by the qualification state engine. No manual override from the cockpit. S-state changes only through artifact evidence changes.

## Rule 12: No Q-class override

Q-class is a deterministic pure function. The cockpit displays it but cannot modify it. Q-class changes through grounding evidence changes, not cockpit actions.

## Rule 13: Forbidden language

All cockpit text must comply with governance language rules:
- No "probabilistic", "AI confidence", "estimated likelihood", "model thinks"
- No "percentage complete" framing for maturity
- No "technical debt" framing for semantic debt
- No "health score" synthesis beyond documented metrics
- No "predicted" or "estimated" timelines

## Rule 14: Evidence-linked display

Every data point displayed in the cockpit must be traceable to a specific artifact and field path. No derived metrics that cannot be traced back to source evidence.
