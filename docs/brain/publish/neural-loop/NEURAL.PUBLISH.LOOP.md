---
name: NEURAL.PUBLISH.LOOP
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# NEURAL.PUBLISH.LOOP

## Purpose

Define the governed operating loop of the Publish Brain. Eight stages, each a discrete processing unit with defined entry condition, active modules, exit condition, and failure response.

---

## Stage 1 — DETECT

| Field | Definition |
|---|---|
| Purpose | Observe the environment and surface any publish-relevant signal before any work begins |
| Active modules | TRIGGER.PATTERN.MODEL, AUTOLOAD.SPECIFICATION |
| Entry condition | Any mention of krayu.be, mirror.krayu.be, a route, a pages/ file, route_source_map.yaml, sitemap, or a surface mismatch |
| Exit condition | At least one trigger pattern is matched and labeled (R-xx, C-xx, P-xx, G-xx) OR environment confirmed clean |
| Failure condition | Signal detected but no matching trigger pattern → escalate to CANONICAL CROSS-CHECK before proceeding |

---

## Stage 2 — LOCATE SOURCE

| Field | Definition |
|---|---|
| Purpose | Identify the authoritative source document for the subject of the detected signal |
| Active modules | CONTEXT.INFERENCE.RULES, WEB.SOURCE.ENTRY.PATTERN |
| Entry condition | Trigger pattern labeled in Stage 1 |
| Exit condition | Source located: file path in docs/governance/, docs/brain/, or snapshot confirmed present or absent |
| Failure condition | Source not locatable → record as MISSING SOURCE; do not proceed to classification; escalate |

---

## Stage 3 — CANONICAL CROSS-CHECK

| Field | Definition |
|---|---|
| Purpose | Verify that the subject matter of the signal traces to a CKR definition or CAT artifact. This is the truth boundary check. |
| Active modules | (none — direct read against docs/brain/canonical/ or known CKR registry) |
| Entry condition | Source located in Stage 2 |
| Exit condition | CKR or CAT artifact confirmed for subject matter, OR confirmed absent (subject is not canonical) |
| Failure condition | Subject appears canonical but no CKR exists → ESCALATE TO CANONICAL BRAIN immediately; loop stops here |

---

## Stage 4 — GOVERNANCE VALIDATION

| Field | Definition |
|---|---|
| Purpose | Verify that the operational governance artifacts are consistent with the canonical truth confirmed in Stage 3 |
| Active modules | ENTRY.GATE.RULESET |
| Entry condition | Canonical cross-check completed |
| Exit condition | route_source_map.yaml entry present with correct source_type and verdict:allowed OR entry confirmed absent (triggering Stages 5–6) |
| Failure condition | Entry present but inconsistent with canonical source → GOVERNANCE RECONCILIATION stream required; loop holds until resolved |

---

## Stage 5 — CLASSIFY

| Field | Definition |
|---|---|
| Purpose | Assign exactly one governance class to the route or content signal |
| Active modules | ROUTE.CLASSIFICATION.MODEL, MODULE.APPLICABILITY.MAP |
| Entry condition | Governance validation completed (Stage 4 passed or absence confirmed) |
| Exit condition | Class assigned: CANONICAL / DERIVED / BRIDGE / SNAPSHOT-DERIVED / INVALID |
| Failure condition | Class ambiguous (DERIVED vs BRIDGE, or canonical claim without CKR) → ESCALATE; do not assign provisional class |

---

## Stage 6 — APPLY AT CORRECT LAYER

| Field | Definition |
|---|---|
| Purpose | Execute the stream type appropriate to the classified trigger. Only the permitted scope for that stream type is active. |
| Active modules | EXECUTION.LINKING.MODEL, PIPELINE.HANDOFF.MODEL (if route work), Publish Execution Model (stream type) |
| Entry condition | Class confirmed in Stage 5; stream type inferred from MODULE.APPLICABILITY.MAP |
| Exit condition | Stream scope completed within its type boundary (INTEGRITY / SEMANTIC / AUTHORITY / BRIDGE / DURABILITY / RECONCILIATION) |
| Failure condition | Work proposed outside stream type scope → STOP; reclassify or split stream |

---

## Stage 7 — VERIFY CLOSURE

| Field | Definition |
|---|---|
| Purpose | Confirm that the applied work resolves the original trigger without introducing new triggers |
| Active modules | TRIGGER.PATTERN.MODEL (re-run against post-work state) |
| Entry condition | Stage 6 execution complete |
| Exit condition | All trigger conditions from Stage 1 are no longer active; no new triggers introduced |
| Failure condition | New trigger surfaces post-work → re-enter loop at Stage 1 for the new trigger as a distinct stream |

---

## Stage 8 — PERSIST REFINEMENT

| Field | Definition |
|---|---|
| Purpose | Feed solved cases back into the brain so operating logic improves without requiring regeneration |
| Active modules | (Closure → Brain Persistence Model; see CLOSURE.BRAIN.PERSISTENCE.MODEL) |
| Entry condition | Stage 7 verified clean |
| Exit condition | Brain updated if persistence rules require it; closure record written |
| Failure condition | Refinement would require updating canonical content → blocked; escalate instead |

---

*NEURAL.PUBLISH.LOOP — Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
