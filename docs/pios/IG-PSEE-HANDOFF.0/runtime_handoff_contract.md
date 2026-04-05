# Runtime Handoff Contract — IG → PSEE

**Stream:** IG-PSEE-HANDOFF.0
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-05
**Baseline commit:** 9000f73eb1c88d2f13b19e748f065d8700d9ea72

---

## 1. PURPOSE

This contract defines the Runtime Handoff Package (RHP) as the only authorized input class for PSEE runtime consumption of IG-governed ingestion outputs.

No PSEE runtime stream may consume IG ingestion artifacts directly. All consumption must pass through the RHP boundary defined here.

---

## 2. RUNTIME HANDOFF PACKAGE (RHP)

### 2.1 Definition

The RHP is the set of machine-consumable, deterministic, source-traceable artifacts produced by IG-PSEE-HANDOFF.0 under:

```
docs/pios/IG.RUNTIME/run_01/
```

### 2.2 RHP Elements

| Artifact | Path | Role |
|---|---|---|
| `source_manifest.json` | `docs/pios/IG.RUNTIME/run_01/source_manifest.json` | Source registry with per-layer admission status |
| `evidence_boundary.json` | `docs/pios/IG.RUNTIME/run_01/evidence_boundary.json` | Admitted vs excluded input class definition |
| `admissibility_log.json` | `docs/pios/IG.RUNTIME/run_01/admissibility_log.json` | Per-artifact admission decisions with source paths |
| `layer_index.json` | `docs/pios/IG.RUNTIME/run_01/normalized_intake_structure/layer_index.json` | Normalized layer-artifact index |
| `source_profile.json` | `docs/pios/IG.RUNTIME/run_01/normalized_intake_structure/source_profile.json` | Resolved source profile properties |
| `provenance_chain.json` | `docs/pios/IG.RUNTIME/run_01/normalized_intake_structure/provenance_chain.json` | Full IG pipeline execution chain |

### 2.3 RHP Properties

- Machine-consumable JSON only — no markdown, no narrative inside RHP data artifacts
- Every element includes original source path and ingestion decision
- Deterministic: same IG.7 run → same RHP output
- Traceable: every artifact traces to IG.6 orchestration gate and IG.5 source profile

---

## 3. ADMITTED INPUT CLASS

PSEE runtime may consume:

- All artifacts listed in `admissibility_log.json` with `"decision": "ADMITTED"`
- All elements of `normalized_intake_structure/`
- `source_manifest.json`, `evidence_boundary.json`

Source run: `run_07_source_profiled_ingestion`
Admitted artifact count: 30 (3 root + 4 L40_2 + 6 L40_3 + 17 L40_4)

---

## 4. EXCLUDED INPUT CLASSES

The following are explicitly forbidden as PSEE runtime inputs:

| Class | Paths | Reason |
|---|---|---|
| PSEE validation | `docs/pios/PSEE.3/*`, `docs/pios/PSEE.3B/*`, `docs/pios/PSEE-GAUGE.0/*` | Governance artifacts — not ingestion evidence |
| PSEE UI | `docs/pios/PSEE.UI/*` | L6/L7 rendering outputs — not ingestion evidence |
| Replay artifacts | `*_replay_*` | Debug-mode isolates — not governed runtime inputs |
| Behavioral analysis | `behavioral_case_analysis.md` | Projection output — not ingestion-layer evidence |

---

## 5. FAIL-SAFE RULE

If any PSEE stream consumes a non-RHP artifact as a runtime input:
- Execution must halt
- Emit: `BOUNDARY_VIOLATION — non-RHP input consumed`
- Reference: `docs/pios/IG-PSEE-HANDOFF.0/runtime_handoff_contract.md`

---

## 6. UPSTREAM INTEGRITY

IG.5–IG.7 artifacts are READ-ONLY from this stream forward.

| Constraint | Status |
|---|---|
| IG.5 artifacts unmodified | CONFIRMED |
| IG.6 artifacts unmodified | CONFIRMED |
| IG.7 artifacts unmodified | CONFIRMED |
| PSEE.3 artifacts unmodified | CONFIRMED |
| PSEE-GAUGE.0 artifacts unmodified | CONFIRMED |
| PSEE.UI artifacts unmodified | CONFIRMED |

---

## 7. AUTHORITY

This contract is authoritative for IG → PSEE runtime boundary.

Governed by: IG family (REGISTERED), IG-PSEE-HANDOFF.0 stream.
