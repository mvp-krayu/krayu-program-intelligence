# DemoFlow Traversal Mapping — 51.6

Stream: 51.6 — ENL Traversal Runtime Engine
Date: 2026-03-26

---

## Flow Definitions

### executive_insight

- Label: Executive Insight
- Description: Answer-first · signals · evidence
- Sequence: ANSWER → SIGNAL → EVIDENCE
- Panel sequence: narrative → signals → evidence
- Use case: Audience is an executive; lead with the answer, reveal signals, expose evidence chain

### structural_analysis

- Label: Structural Analysis
- Description: Answer · structure · signals · evidence
- Sequence: ANSWER → STRUCTURE → SIGNAL → EVIDENCE
- Panel sequence: narrative → situation → signals → evidence
- Use case: Audience needs structural context; answer first, then topology baseline, then signals, then chain

### evidence_audit

- Label: Evidence Audit
- Description: Evidence-first · structure · signals · answer
- Sequence: EVIDENCE → STRUCTURE → SIGNAL → ANSWER
- Panel sequence: evidence → situation → signals → narrative
- Use case: Analyst / auditor; start with evidence chain, confirm structure, verify signals, conclude with answer

---

## Rule

Flows REORDER panel visibility ONLY.
They NEVER alter content.
All flows expose the same evidence set.
Order is deterministic. No computation.

---

## Single-Focus-Node Enforcement

| Node Index | executive_insight | structural_analysis | evidence_audit |
|---|---|---|---|
| 0 (entry) | narrative | narrative | evidence |
| 1 | signals | situation | situation |
| 2 | evidence | signals | signals |
| 3 (final) | — | evidence | narrative |

At each step, exactly one panel is open.
Advancing replaces the open panel with the next in sequence.
