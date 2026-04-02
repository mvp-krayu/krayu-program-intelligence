# CE.2 — Core Output Contract Surface

**Stream:** CE.2 — PiOS Core Engine Internal Contract
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** canonical-layer-model.md (00.2), CE.2_CORE_EXECUTION_MODEL.md

---

## 1. Output Contract Purpose

This document defines the output surface of the PiOS Core Engine — what exits the Core (post-40.11) toward downstream consumers, and the constraints that govern it.

Downstream consumers include:
- 41.x (Semantic Elevation / ENL Navigation) — L4/L5 consumers
- 43.x (Signal-to-Structure Binding) — L5 consumers
- 44.x (Structural Overlay Projection) — L5 consumers

Core output must not be modified, re-derived, or re-interpreted by consumers. Consumers receive the output as-is.

---

## 2. Authorized Output Artifacts

The following artifacts exit the Core upon successful 40.11 loop closure:

| Artifact | Producing Layer | Format | Content |
|---|---|---|---|
| ESI manifest | 40.5 | JSON | Run ID, window count, NF values, PES values, ESI value+mode+warnings, TC observations, program constants |
| ESI output set | 40.5 | Markdown | Human-readable ESI derivation record |
| RAG output set | 40.5 | Markdown | RAG component values and window status |
| Derivation execution manifest | 40.5 | Markdown | Full 9-section execution record |
| Condition activation record | 40.6 | JSON/Markdown | Condition states per signal, threshold references, PARTIAL flags |
| Diagnosis structure | 40.7 | JSON/Markdown | Evidence-bound diagnosis, intelligence packet, gap declarations |
| Delivery package | 40.8 | JSON/Markdown | Packaged 40.7 outputs with manifest and lineage metadata |
| Feedback registration record | 40.9 | JSON/Markdown | Recurrence log, unknown space log, coverage pressure log, gap log |
| Orchestration directives | 40.10 | JSON/Markdown | Control directives, triggering feedback record, rule references |
| Loop closure assertion | 40.11 | JSON/Markdown | Closure status, integrity validation, scope adherence, traceability report |

---

## 3. Output Constraints

### OC-01 — No Semantic Expansion at Output Boundary

Core outputs must not contain:
- Narrative prose
- Investor language
- Causal explanations not derived from governed rules
- Rankings or prioritizations

### OC-02 — PARTIAL and UNDEFINED Flags Must Be Preserved

Every output artifact must explicitly carry PARTIAL/UNDEFINED/INSUFFICIENT_WINDOWS flags for all fields where applicable. Downstream consumers must receive the complete state, including gap declarations.

### OC-03 — Evidence Lineage Must Be Present

Every output artifact must carry traceable references to:
- The 40.4 source metrics it derived from
- The computation rules applied
- The layer chain from which it originates

Outputs without lineage declarations are invalid and must not exit the Core.

### OC-04 — Run Identity Must Be Consistent

All output artifacts from a single Core run must carry the same `run_id`. Cross-artifact consistency is validated at 40.11. Inconsistent run IDs indicate a composition error.

### OC-05 — Input Contract Identity Must Be Declared

Every output artifact must reference the input contract ID under which it was produced:
- `input_contract_id: pios_core_40.16_input_contract_0.1` (or successor)

This allows downstream consumers and auditors to verify that outputs were produced from the correct frozen input set.

### OC-06 — Semantic Interpretation Is Not a Core Output

Core does not produce:
- SSZ/SSI values (these are pending L3 formal specification — see DRIFT-001)
- Executive interpretation text
- ENL navigation structures
- Presentation payloads
- Demo sequences

These are downstream responsibilities.

---

## 4. Downstream Consumption Rules

| Downstream Consumer | Allowed to Use | Forbidden from Doing |
|---|---|---|
| 41.x (Semantic Elevation) | 40.7 diagnosis structures, 40.8 delivery packages | Recomputing signals, altering evidence bindings |
| 43.x (Signal-to-Structure Binding) | 40.5 ESI/RAG outputs, 40.6 condition records | Modifying derivation values, introducing new signals |
| 44.x (Structural Overlay Projection) | 40.5 ESI/RAG, 40.6 conditions, 40.7 diagnosis | Reinterpreting diagnosis, altering PARTIAL flags |
| 42.x (Runtime Rendering) | L5 assembled payloads only (not Core outputs directly) | Bypassing L5 to directly consume Core outputs |

---

## 5. Core Output Validity Conditions

A Core output set is valid if and only if:

1. 40.11 loop closure assertion is COMPLETE or PARTIAL (not FAIL)
2. All output artifacts are present and carry required fields
3. Run IDs are consistent across all artifacts
4. Input contract identity is declared and matches frozen lock
5. No output artifact contains non-traceable values
6. All UNDEFINED/PARTIAL states are explicitly declared — none are suppressed

If any condition is not met, the output set is INVALID and must not be consumed downstream.
