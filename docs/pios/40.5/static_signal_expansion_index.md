# Static Signal Expansion Index

**Stream:** PI.SIGNAL-SPACE.EXPANSION.40X.02 / PI.STATIC-TELEMETRY.REGISTRATION.40X.03
**Layer:** 40.5 — Signal Computation Specification (cross-reference: 40.4 Telemetry)
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** COMPLETE — Design, governance, and telemetry field definition. No extraction or signal computation authorized.

---

## Artifact List

| Artifact | Path | Purpose |
|----------|------|---------|
| Telemetry Expansion Registry | `docs/pios/40.4/static_telemetry_expansion_registry.md` | ST-030..035 provisional telemetry field definitions |
| Signal Expansion Registry | `docs/pios/40.5/static_signal_expansion_registry.md` | PSIG-001..PSIG-008 candidate definitions, ST dependencies, computation sketches |
| Selector Specification | `docs/pios/40.5/signal_selector_specification.md` | Selector modes, schema, group definitions, fail-closed rules |
| This Index | `docs/pios/40.5/static_signal_expansion_index.md` | Summary, key decisions, status matrix, downstream dependencies |

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| PSIG namespace for provisional signals | Preserves SIG namespace for CKR-canonical constructs only; PSIG signals are clearly provisional until CKR-registered |
| 6 of 8 PSIG candidates are INPUT_SUPPORTED | PSIG-001..006 are all derivable from existing `binding_envelope.json` topology without new pipeline work |
| PSIG-007 and PSIG-008 marked PROVISIONAL_BLOCKED_INPUT_MISSING | Test artifact mapping and complexity extraction do not exist in 40.4 pipeline; no fabrication |
| Selector as specification layer | Selector governs which signals are attempted per run; it does not compute, define, or override; strictly a filter layer |
| Group `pressure_zone_default` contains 8 signals | SIG-002, SIG-004, PSIG-001..006 — the full static topology-based pressure surface; PSIG-007/008 excluded until inputs are available |
| ST-030..035 defined as PROVISIONAL_TELEMETRY_FIELD | PI.STATIC-TELEMETRY.REGISTRATION.40X.03 registered 6 new ST fields in `docs/pios/40.4/static_telemetry_expansion_registry.md`; ST numbers realigned from prior proposal |
| ST-035 redefined from Isolated Domain Count to STRUCTURAL_CLUSTER_COUNT | Contract authority superseded prior proposal; PSIG-006 formula and pressure meaning updated accordingly; second-client ST-035=10 (10 connected components) |
| `require_ckr: true` for production/governance runs | Ensures evidence chains trace to CKR authority; `allow_provisional: true` appropriate for exploratory runs |

---

## Signal Groups Summary

| Group | Members | Purpose |
|-------|---------|---------|
| `coupling` | SIG-002, PSIG-001, PSIG-002, PSIG-003 | Dependency intake, propagation, cross-domain coupling pressure |
| `structure` | SIG-004, PSIG-004, PSIG-006 | Structural volatility, responsibility overload, domain fragmentation |
| `surface` | PSIG-005 | Interface coordination exposure |
| `test_risk` | PSIG-007 [BLOCKED] | Test coverage gaps on structurally important surfaces |
| `complexity` | PSIG-008 [BLOCKED] | Static complexity concentration |
| `pressure_zone_default` | SIG-002, SIG-004, PSIG-001..PSIG-006 | Full static pressure assessment; recommended default for all client runs |

---

## CKR / Provisional Status Matrix

| Signal | CKR Status | Provisional? | Evidence | Computable Now (Second-Client) |
|--------|-----------|--------------|----------|-------------------------------|
| SIG-002 | CKR-007 CANONICAL | NO | Computed run_01_blueedge | YES — dep_load_ratio=0.044 |
| SIG-004 | CKR-009 CANONICAL | NO | Computed run_01_blueedge | YES — four ratios |
| PSIG-001 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-030 (MAX_FAN_IN) registered |
| PSIG-002 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-031 (MAX_FAN_OUT) registered |
| PSIG-003 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-032 (CROSS_DOMAIN_EDGE_COUNT) registered |
| PSIG-004 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-033 (MAX_RESPONSIBILITY_SURFACE), ST-034 (TOTAL_INTERFACE_SURFACE) registered |
| PSIG-005 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-034 (TOTAL_INTERFACE_SURFACE) registered |
| PSIG-006 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | binding_envelope confirmed | INPUT_DEFINED — ST-035 (STRUCTURAL_CLUSTER_COUNT) registered; second-client ST-035=10 |
| PSIG-007 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | MISSING — no test artifact | BLOCKED — input missing |
| PSIG-008 | candidate_for_new_ckr | YES — PROVISIONAL_CKR_CANDIDATE | MISSING — no complexity artifact | BLOCKED — input missing |

---

## Pressure Family Coverage

| Pressure Family | Covered By | Gap |
|----------------|-----------|-----|
| Coupling pressure | SIG-002, PSIG-001 | — |
| Propagation pressure | PSIG-002 | — |
| Cross-domain coordination | PSIG-003 | — |
| Responsibility concentration | PSIG-004 | — |
| Interface surface pressure | PSIG-005 | — |
| Structural volatility | SIG-004 | — |
| Structural fragmentation | PSIG-006 | — |
| Test-risk pressure | PSIG-007 | BLOCKED — 40.4 test artifact contract required |
| Complexity pressure | PSIG-008 | BLOCKED — 40.4 complexity extraction contract required |

---

## Downstream Dependencies

| Dependency | What Requires It | Current Status |
|-----------|-----------------|----------------|
| ST-030..035 extraction into structural_telemetry.md | PSIG-001..006 canonical computation | DEFINED (PROVISIONAL) — extraction execution requires authorized 40.4 contract |
| CKR registration for PSIG-001..006 | PSIG signals becoming canonical SIG entries | NOT YET ISSUED — requires CKR governance contract |
| 40.5 execution contract with selector config | Actual computation of PSIG signals | NOT YET ISSUED — this document is design only |
| 75.x threshold contract for PSIG signals | Condition activation from PSIG outputs | NOT YET ISSUED — required before 40.6 chain activates |
| 40.4 test artifact contract | PSIG-007 unblock | NOT YET ISSUED |
| 40.4 complexity extraction contract | PSIG-008 unblock | NOT YET ISSUED |

---

## Selector Modes Summary

| Mode | Behavior | Best For |
|------|---------|---------|
| `default_all_static` | All eligible SIG + PSIG signals | New client onboarding |
| `explicit` | Only listed signal IDs | Targeted re-validation |
| `group` | All signals in named groups | Pressure-zone assessment |
| `default_minus_exclusions` | All eligible minus excluded IDs | Suppressing blocked/noisy signals |

---

## Unresolved Items

| Item | Resolution Path |
|------|----------------|
| ST-030..035 — defined (PROVISIONAL) but not yet extracted into structural_telemetry.md | Authorized 40.4 extraction execution contract |
| PSIG-001..006 — provisional, not CKR-registered | Authorized CKR update contract |
| PSIG-007 — test artifact missing | 40.4 contract to extract test path presence per capability surface |
| PSIG-008 — complexity extraction missing | 40.4 contract to specify and produce per-module complexity metrics |
| 75.x threshold rules for PSIG outputs | Stream 75.x authority contract before any PSIG activates conditions |
| Focus-domain selection rule (CG-01) | Canonical rule required; currently no governed derivation logic (from STEP 14E-F) |
| Pressure-zone designation rule (CG-02) | Downstream of CG-01; canonical rule required (from STEP 14E-G) |

---

## Invariants Preserved

- No PSIG signal is treated as canonical. All are PROVISIONAL_CKR_CANDIDATE.
- No thresholds or condition rules are defined in this specification.
- No signals are computed by this document.
- No code files are modified.
- No client run outputs are written.
- No 41.x, vault, graph, report, or LENS artifacts are touched.
- All PSIG signals that cannot be supported by current artifacts are marked PROVISIONAL_BLOCKED_INPUT_MISSING.
- The selector does not compute or reinterpret signals.
- Canonical CKR signals (SIG-XXX) and provisional PSIG candidates are clearly distinguished throughout.
