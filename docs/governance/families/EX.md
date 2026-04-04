# Family: EX — Execution Layer

**Status:** REGISTERED
**Registered:** 2026-04-04
**Authority:** EX.0

---

## PURPOSE

Execution binding, verification, debug, trace, and system bridge work that plugs runtime truth into governed consumption surfaces. EX streams connect the certified PiOS engine to the adapter and demo layers, enforce vocabulary compliance, and expose read-only inspection surfaces.

---

## AUTHORIZED BRANCH

`pios-governance-baseline-v0.4`

EX-family streams are authorized to commit directly to this branch. Feature branch creation is optional for EX streams unless explicitly required by the stream contract. This is a declared exception to CLAUDE.md §7.1 for the EX family.

---

## STANDARD INVARIANTS

- Read-only unless stream delta explicitly authorizes writes
- No recomputation of governed upstream states
- Adapter boundary must remain explicit and documented
- Runtime truth preferred over synthetic narration
- Debug and trace outputs must remain traceable to source run archives
- CE.4 / CE.5 / CE.2 vocabulary must be enforced at every boundary
- No-write constraint must be declared once per stream (execution report §5)

---

## STATE VOCABULARIES

| Layer | States |
|---|---|
| CE.4 (signal emission) | COMPLETE \| PARTIAL \| BLOCKED \| COMPUTABLE_PENDING |
| CE.5 (consumption) | AVAILABLE \| PARTIAL \| BLOCKED |
| CE.2 (condition tier) | BLOCKED \| DEGRADED \| AT_RISK \| STABLE |
| CE.2 (diagnosis) | BLOCKED \| ACTIVE \| INACTIVE |
| Bridge state | READY \| PARTIAL \| BLOCKED |

---

## STANDARD ARTIFACT SLOTS (7-PACK)

| Slot | Function | Example name |
|---|---|---|
| 1 | Map or trace surface | `trace_surface_map.md` |
| 2 | Specification | `debug_payload_spec.md` |
| 3 | Definition | `trace_chain_definition.md` |
| 4 | Exposure surface or mechanism | `run_metadata_exposure.md` |
| 5 | Boundary contract | `debug_endpoint_spec.md` |
| 6 | Validation report | `trace_validation_report.md` |
| 7 | Execution report | `EX.X_EXECUTION_REPORT.md` |

---

## VALIDATION PROFILES

| Profile | Purpose | Machine-readable ref |
|---|---|---|
| `debug_trace` | Verify debug/trace surface completeness | EX.json → `debug_trace` |
| `bridge_binding` | Verify adapter-to-engine bridge binding | EX.json → `bridge_binding` |
| `runtime_bridge` | Verify runtime bridge outputs (EX.1A type) | EX.json → `runtime_bridge` |

---

## HANDOVER EXPECTATIONS

Every EX stream handover must include:
- Resulting adapter/bridge state
- Validation status per profile
- CE.4/CE.5/CE.2 state at close
- Remaining open gaps (IB class if applicable)
- Git hygiene status
- Next EX stream entry point if applicable

---

## KNOWN EXCLUSIONS

- No redefinition of PiOS core engine logic
- No synthetic runtime value generation
- No ungoverned UI interpretation
- No cross-family execution without explicit DELTA declaration

---

## COMPRESSION ELIGIBILITY

REGISTERED. Compressed contracts permitted.

Required contract fields for EX streams:
- `FAMILY RESOLUTION: KNOWN`
- `VALIDATION COVERAGE: FULL | PARTIAL`
- `FALLBACK MODE: REASSESS` (if PARTIAL coverage)
- `FAIL-SAFE RULE`: must be explicit if coverage is PARTIAL

---

## KNOWN STREAMS

| Stream | Purpose | Status |
|---|---|---|
| EX.H1 | Execution handover CE → EX | COMPLETE |
| EX.1 | Runtime binding and verification baseline | COMPLETE |
| EX.1A | Live runtime binding remediation | COMPLETE |
| EX.3 | Runtime integration, default path binding | COMPLETE |
| EX.2 | Debug/trace interface | COMPLETE |
| EX.0 | Operating model hardening | COMPLETE |
