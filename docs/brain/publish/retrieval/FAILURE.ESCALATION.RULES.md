---
name: FAILURE.ESCALATION.RULES
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# FAILURE.ESCALATION.RULES

## Purpose

Define when the publish brain must STOP and escalate to a higher authority. Escalation occurs when classification, authority, or claim validation cannot be resolved within the pipeline.

---

## Escalation Rules

```
ESCALATION CONDITION 1: No canonical source found
  TRIGGER: ROUTE.CLASSIFICATION.MODEL cannot find a CKR reference or CAT artifact
           for a route that appears to claim canonical authority
  ACTION:  STOP classification
  ESCALATE TO: Canonical Brain (docs/brain/canonical/)
  REASON:  A route claiming canonical status without CKR backing is an
           unverified assertion. Canonical Brain must issue or confirm the CKR.
  PIPELINE EFFECT: Route receives INVALID/UNAUTHORIZED class until escalation resolves.

ESCALATION CONDITION 2: Classification ambiguity
  TRIGGER: A route satisfies criteria for both DERIVED and BRIDGE
           (contains derivative explanation AND commercial/product reference)
  ACTION:  STOP classification
  ESCALATE TO: Governance decision (explicit stream contract required)
  REASON:  A route cannot carry two classes. The ambiguity must be resolved
           by deciding which purpose is primary. This is not a classification
           decision — it is a scope decision.
  PIPELINE EFFECT: Route is held as UNGOVERNED until class is confirmed.

ESCALATION CONDITION 3: Route duplicates canonical construct
  TRIGGER: A proposed new route covers the same subject matter as an existing
           CANONICAL route in route_source_map.yaml
  ACTION:  STOP gate check
  ESCALATE TO: Canonical Brain + Governance decision
  REASON:  Two canonical routes for the same construct create SEO canonical
           conflicts and authority fragmentation. The question of which route
           is authoritative cannot be resolved at the pipeline level.
  PIPELINE EFFECT: New route receives verdict:blocked until escalation resolves.

ESCALATION CONDITION 4: Conflicting authority sources
  TRIGGER: route_source_map.yaml declares source_type:canonical_kpi with a
           source_path that does not match the CKR definition in docs/brain/canonical/
  ACTION:  STOP gate check
  ESCALATE TO: Canonical Brain
  REASON:  The route authority map must agree with canonical brain truth.
           The discrepancy cannot be resolved by updating either in isolation.
  PIPELINE EFFECT: Route is held with verdict:provisional until resolved.

ESCALATION CONDITION 5: Bridge page with unverified claims
  TRIGGER: A BRIDGE class route contains claims not present in the Publish Brain
           controlled claims table
  ACTION:  STOP gate check
  ESCALATE TO: Publish Brain (docs/brain/publish/02_UPDATE_RULES.md promotion path)
  REASON:  Bridge pages may not introduce uncontrolled claims. The claim must
           first be promoted through Product Brain → Publish Brain before the
           route may enter the pipeline.
  PIPELINE EFFECT: Route is held at Stage 0 until controlled claims table is complete.
```

---

*FAILURE.ESCALATION.RULES — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
