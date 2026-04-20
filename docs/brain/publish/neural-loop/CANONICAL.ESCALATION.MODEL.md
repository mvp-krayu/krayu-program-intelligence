---
name: CANONICAL.ESCALATION.MODEL
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# CANONICAL.ESCALATION.MODEL

## Purpose

Define exactly when the neural loop must STOP and escalate to a higher authority. Covers triggers, escalation targets, and the universal loop stop condition.

---

## Escalation Triggers

```
ESCALATION TRIGGER 1: MISSING CANONICAL SOURCE
  Condition: Stage 3 (Canonical Cross-check) cannot find a CKR or CAT artifact
             for a route or claim that asserts canonical authority
  Loop stop: At Stage 3 — do not proceed to Stage 4
  Escalation target: Canonical Brain (docs/brain/canonical/)
  Resolution: Canonical Brain must issue or confirm the CKR before the loop resumes

ESCALATION TRIGGER 2: AMBIGUOUS CLASSIFICATION AFFECTING MEANING
  Condition: Stage 5 cannot distinguish DERIVED from BRIDGE because the route's
             content contains both construct explanation and commercial product reference,
             and the distinction determines which claim rules apply
  Loop stop: At Stage 5 — do not proceed to Stage 6
  Escalation target: Governance decision (explicit stream contract required)
  Resolution: A formal stream contract must declare the primary class

ESCALATION TRIGGER 3: UNGROUNDED CLAIM
  Condition: A claim on a governed page cannot be traced to any CKR or CAT artifact
             and the page carries a classification (CANONICAL or DERIVED) that
             requires full traceability
  Loop stop: At Stage 4 (Governance Validation) — the claim blocks gate pass
  Escalation target: Canonical Brain (to issue the authority) or Publish Brain
                     promotion path (to reclassify as BRIDGE with controlled claim)
  Resolution: Claim must either receive CKR backing or be removed

ESCALATION TRIGGER 4: ROUTE DUPLICATES CANONICAL SUBJECT
  Condition: A proposed route covers subject matter already owned by an existing
             CANONICAL route in route_source_map.yaml
  Loop stop: At Stage 4 — gate check is blocked; proposed route receives verdict:blocked
  Escalation target: Canonical Brain + Governance decision (scope arbitration required)
  Resolution: One route must be designated authoritative; the other reclassified
              or removed

ESCALATION TRIGGER 5: CONFLICT BETWEEN CANONICAL AND PUBLISH LOGIC
  Condition: A route_source_map.yaml entry declares canonical_kpi but the
             source_path does not match the current canonical definition in
             docs/brain/canonical/
  Loop stop: At Stage 4 — governance validation fails
  Escalation target: Canonical Brain
  Resolution: route_source_map.yaml must be corrected to match current canonical truth
```

---

## Universal Loop Stop Condition

> When any escalation trigger fires, the neural loop stops at the stage where the trigger was detected. No subsequent stage executes. The loop may only resume after the escalation is resolved externally and the resolution is recorded in the relevant stream closure record.

---

*CANONICAL.ESCALATION.MODEL — Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
