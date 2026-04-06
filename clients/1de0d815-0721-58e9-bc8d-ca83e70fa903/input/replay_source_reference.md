# BlueEdge Replay Source Reference

stream: PSEE.RECONCILE.1.WP-15.BLUEEDGE.REPLAY
date: 2026-04-06
status: BLOCKED

---

## Execution Outcome

BLOCKED — AUTHORITATIVE_INPUT_VIOLATION

No admissible BlueEdge intake package exists in the current runtime schema.
The runtime now enforces AUTHORITATIVE_INPUT_ADMISSIBILITY_CHECK before IG_NORMALIZATION.
All inputs lacking valid `admissibility_metadata` are rejected before execution.

---

## Admissibility Requirements (enforced in run_client_runtime.py)

A valid `authoritative_state.json` must contain:

| Field | Requirement |
|-------|-------------|
| `admissibility_metadata.source_class` | Must be `"AUTHORITATIVE_INTAKE"` |
| `admissibility_metadata.source_artifacts` | Non-empty list of client-scoped paths; no docs/pios/, runs/pios/, signal_registry, entity_catalog, dependency_map, signal_computation, signal_traceability, presentation, or historical paths |
| `admissibility_metadata.construction_mode` | `"FIRST_RUN_INTAKE"` or `"REPLAY_BINDING"` |
| `admissibility_metadata.provenance_hash` | Non-empty string |

---

## Rejected Sources

The following source classes are NOT admissible as intake origin for authoritative_state.json:

- docs/pios/ (documentation layer)
- runs/pios/ (historical execution layer)
- signal_registry (presentation artifact)
- entity_catalog (documentation artifact)
- dependency_map (documentation artifact)
- signal_computation_specification (documentation artifact)
- signal_traceability_map (documentation artifact)

Inputs constructed from these sources are classified as RECONSTRUCTED_TRUTH and are rejected
with FORBIDDEN_SOURCE_CLASS / RECONSTRUCTED_TRUTH at the admissibility gate.

---

## Unblocking Condition

WP-15 can proceed only when a real authoritative BlueEdge intake package is available:
- Constructed from a live IG system feed or from a first-run intake of the actual BlueEdge
  system (not documentation reconstruction)
- Contains valid `admissibility_metadata` with client-scoped source_artifacts
- Passes AUTHORITATIVE_INPUT_ADMISSIBILITY_CHECK
