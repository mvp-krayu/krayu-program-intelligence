# Grounding Path Decision
## PI.LENS.GROUNDING-PATH-ALIGNMENT.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Decision

**Canonical path selected:** `ceu/grounding_state_v3.json`

Full template: `clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json`

---

## Rationale

### Why `ceu/` not `binding/provenance/`

| Criterion | `ceu/grounding_state_v3.json` | `binding/provenance/grounding_state_v3.json` |
|-----------|-------------------------------|----------------------------------------------|
| Produced by generic pipeline | YES — `ceu_grounding.py` writes here | NO — BlueEdge-specific path |
| Derived from run root | YES — `run_dir / "ceu" / ...` | NO — hardcoded in source_manifest |
| Client-agnostic | YES | NO |
| Matches CEU grounding contract | YES | NO |
| Matches BlueEdge legacy | NO | YES |

The `binding/provenance/` path is a BlueEdge-specific convention from a prior pipeline contract (PI.CEU.GROUNDING.07.GROUNDING-MATERIALIZATION.V2.01). It is not the correct canonical path for the generic pipeline.

The `ceu/` path is the output of `scripts/pios/ceu_grounding.py` (PI.LENS.CEU-GROUNDING.GENERIC.01). This is the correct path for the generic pipeline.

### Why not change `ceu_grounding.py` to write to `binding/provenance/`

The `binding/provenance/` path requires BlueEdge-specific context that the generic grounding engine does not have. Changing the output path to a BlueEdge path would introduce BlueEdge-specific knowledge into a generic tool. This violates the genericity principle of PI.LENS.CEU-GROUNDING.GENERIC.01.

---

## Implementation Method

**OPTION 1 — Orchestrator patch (PREFERRED)**

The orchestrator Phase 4 was patched to:
1. Try `run_dir / "ceu" / "grounding_state_v3.json"` first (generic, run-derived path)
2. Fall back to `source_manifest["grounding_state_path"]` (BlueEdge legacy path)
3. Accept both `validation_status == "PASS"` (generic schema) and `readiness_gate == "PASS"` (BlueEdge schema)

This preserves BlueEdge backward compatibility while enabling the generic pipeline.

---

## Path Resolution Order (Phase 4 after patch)

```
1. {run_dir}/ceu/grounding_state_v3.json         ← generic pipeline (PREFERRED)
2. REPO_ROOT / source_manifest["grounding_state_path"]  ← legacy/BlueEdge (FALLBACK)
3. FAIL-CLOSED with both paths shown in error
```

---

## Gate Check Compatibility

| Field | Format | Handling |
|-------|--------|----------|
| `validation_status == "PASS"` | Generic (ceu_grounding.py) | Accepted — checked first |
| `readiness_gate == "PASS"` (string) | BlueEdge v3 | Accepted — fallback |
| `readiness_gate.status == "PASS"` (dict) | BlueEdge v3 dict form | Accepted — fallback |
| Anything else | Unknown | FAIL — gate status shown in error |
