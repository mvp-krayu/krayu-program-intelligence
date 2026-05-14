# PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01 — Index

**Stream:** PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01
**Last Updated:** 2026-04-25
**Status:** COMPLETE

---

## Summary

Signal intelligence ontology, construct ownership, and lifecycle placement registry for second-client pipeline execution.

Produced by forensic investigation under CONTRACT PI.SECOND-CLIENT.SIGNAL-OWNERSHIP.FORENSICS.01.
Persisted and CKR-integrated under CONTRACT PI.SIGNAL-INTELLIGENCE.ONTOLOGY.PERSISTENCE.02.

---

## CKR STATUS: LOCATED

CKR (Canonical Knowledge Registry) located via contract-provided governance documents:
- `canonical_knowledge_registry.md` — authoritative construct ontology
- `governance_master_capsule.md` — compliance and naming rules
- `governance_operating_model.md` — stream lifecycle and execution rules

CKR source is external to current repository working set and injected via controlled contract context.

**KEY ADDITION:** CKR integrated as construct authority layer above all PiOS execution layers (40.x and 41.x).

---

## Key Findings

| Finding | Result |
|---------|--------|
| Two SIG-XXX namespaces | CONFIRMED — 40.5 (raw/CKR-governed) vs 41.4 (intelligence/package) |
| Authorized insertion point | 40.5 (`build_signal_artifacts.py`) — CKR-026 Signal Computation Engine |
| Static-derivable signals (second-client) | SIG-002 (CKR-007), SIG-004 (CKR-009) only; SIG-006 (CKR-011) BLOCKED_RUNTIME — requires AT-007/AT-009/DT-007/DT-008 event-based delivery telemetry; never computed for any client |
| Runtime-blocked signals | SIG-001/003/005 (CKR-006/008/010), ESI (CKR-014), RAG (CKR-015) |
| 41.x producer gap | BlueEdge-specific; second-client requires parameterized producers |
| Root gap | `signal_registry.json`: `signals: []` — 40.5→41.4 chain never executed for second-client |
| DRIFT-001 | ESI at L6 (`utils/ssz.js`) instead of authoritative L3 — active drift |
| SSZ/SSI | PROVISIONAL NOT ADMITTED (43.x) |

---

## CKR Pipeline Mapping (Quick Reference)

| CKR | Construct | Pipeline |
|-----|-----------|----------|
| CKR-004 | Execution Telemetry | → 40.4 |
| CKR-005 | Execution Signals | → 40.5 |
| CKR-006..011 | Signal definitions | → 40.5 |
| CKR-012 | Program Conditions | → 40.6 |
| CKR-013 | Program Diagnosis | → 40.7 |
| CKR-014 | ESI | → 40.16 |
| CKR-015/016 | Gradient constructs | → 40.16 |
| CKR-026 | Signal Computation Engine | → 40.5 |
| CKR-027 | Condition & Diagnosis Activation | → 40.6 |
| CKR-028 | Intelligence Synthesis | → 40.7 |

---

## Layer Authority Rule

```
CKR    — defines WHAT (construct authority)
40.x   — defines HOW computed (implementation authority)
41.x   — defines HOW exposed (semantic authority)
```

---

## Pipeline Invariant

```
CKR → 40.x → 41.x → vault → graph → report → LENS
```

---

## Dependency Note

All future signal-related contracts must reference CKR IDs explicitly at first occurrence of any governed construct, in compliance with governance_master_capsule.md — CANONICAL KNOWLEDGE REGISTRY COMPLIANCE.

---

## Contract Naming Correction

`PI.SECOND-CLIENT.SIGNAL-DERIVATION.41X.01` — MISLEADING (41.x does not derive signals)

Recommended:
- `PI.SECOND-CLIENT.SIGNAL-DERIVATION.40X.01` (if scope is 40.5→40.6→40.7 only)
- `PI.SECOND-CLIENT.SIGNAL-INTELLIGENCE.CHAIN.40X-41X.01` (if scope spans full chain)

---

## Unresolved Items Count

| Item | Status |
|------|--------|
| CKR canonical register | RESOLVED — located via contract governance documents |
| 41.x producer gap (second-client) | OPEN — no parameterized producers exist |
| 40.5 execution contract (second-client) | OPEN — no authorized contract issued |
| DRIFT-001 (ESI layer placement) | OPEN — must resolve before second-client ESI derivation |
| AT-XXX telemetry availability (second-client) | OPEN — not confirmed |
| CG-01 focus domain selection | OPEN — no canonical rule |
| CG-02 pressure zone designation | OPEN — downstream of CG-01 |

---

## Artifact Reference

Full document: `docs/pios/PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01.md`
