# Intelligence Traceability Map

**Stream:** 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
**Input:** docs/pios/40.7/intelligence_output_set.md, docs/pios/40.7/diagnosis_output_set.md
**Date:** 2026-03-18

---

## Traceability Rule

Every intelligence claim must trace to:
1. A governed diagnosis output from this stream
2. The condition from which that diagnosis was derived (40.6 artifact)
3. The signal from which that condition was derived (40.6 chain)
4. The CKR references at each layer
5. A temporal reference (inherited from diagnosis, inherited from condition, inherited from signal)

Full lineage from intelligence claim to originating 40.6 condition must be preserved end-to-end. No claim may exist without a complete traceability chain.

---

## INTEL-001 — Structural Architecture State Traceability

| Intelligence ID | Source Diagnoses | Condition | Condition CKR | Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| INTEL-001 | DIAG-001, DIAG-002 | COND-001 | CKR-012 | SIG-002 | CKR-007 | static |
| INTEL-001 | DIAG-001, DIAG-002 | COND-002 | CKR-012 | SIG-004 | CKR-009 | static |

**Full lineage chain:**
INTEL-001 → DIAG-001 (Stream 75.2) → COND-001 (CKR-012, condition_output_set.md) → SIG-002 (CKR-007) → ST-012, ST-013, ST-014, ST-015, ST-007 (structural_telemetry.md)
INTEL-001 → DIAG-002 (Stream 75.2) → COND-002 (CKR-012, condition_output_set.md) → SIG-004 (CKR-009) → ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 (structural_telemetry.md)

**Claims with full chain:**
- Dependency load ratio 0.682 → DIAG-001 → COND-001 → SIG-002 → ST-007, ST-012–ST-015
- Edge-to-node ratio 1.273 → DIAG-002 → COND-002 → SIG-004 → ST-010, ST-007
- Containment density 0.545 → DIAG-002 → COND-002 → SIG-004 → ST-011, ST-007
- Responsibility distribution 0.364 → DIAG-002 → COND-002 → SIG-004 → ST-006, ST-007
- Module surface ratio 0.455 → DIAG-002 → COND-002 → SIG-004 → ST-009, ST-007

**Coverage state:** computed — full chain verified

---

## INTEL-002 — Execution Pipeline Readiness Profile Traceability

| Intelligence ID | Source Diagnoses | Condition | Condition CKR | Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| INTEL-002 | DIAG-003 | COND-003 | CKR-012 | SIG-001 | CKR-006 | static |
| INTEL-002 | DIAG-003 | COND-003 | CKR-012 | SIG-001 | CKR-006 | event-based |
| INTEL-002 | DIAG-004 | COND-004 | CKR-012 | SIG-005 | CKR-010 | event-based |

**Full lineage chain:**
INTEL-002 → DIAG-003 (Stream 75.2) → COND-003 (CKR-012, condition_output_set.md) → SIG-001 (CKR-006) → ST-016, ST-012, AT-005[pending], AT-007[pending]
INTEL-002 → DIAG-004 (Stream 75.2) → COND-004 (CKR-012, condition_output_set.md) → SIG-005 (CKR-010) → AT-005, DT-001, DT-003, DT-007[pending], AT-006[pending]

**Claims with full chain:**
- Structural coordination ratio 0.875 → DIAG-003 → COND-003 → SIG-001 → ST-012, ST-016
- Throughput constants (8 stages, 9 artifacts/run) → DIAG-004 → COND-004 → SIG-005 → AT-005, DT-001, DT-003

**Unknown claims (chain traced but telemetry blocked):**
- Runtime coordination events → DIAG-003 → COND-003 → SIG-001 → AT-005, AT-007 [pending]
- Completion-conditioned rate → DIAG-004 → COND-004 → SIG-005 → DT-007 [pending]

**Coverage state:** partial — static components fully traced; event-based components pending

---

## INTEL-003 — Composite Execution Health State Traceability

| Intelligence ID | Source Diagnoses | Condition | Condition CKR | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| INTEL-003 | DIAG-007 | COND-007 | CKR-012 | SIG-007 (via SIG-002) | CKR-014/CKR-007 | static |
| INTEL-003 | DIAG-007 | COND-007 | CKR-012 | SIG-007 (via SIG-005) | CKR-014/CKR-010 | event-based |
| INTEL-003 | DIAG-007 | COND-007 | CKR-012 | SIG-007 (via SIG-006) | CKR-014/CKR-011 | event-based |

**Full lineage chain:**
INTEL-003 → DIAG-007 (Stream 75.2) → COND-007 (CKR-012, condition_output_set.md) → SIG-007 (CKR-014) → [SIG-002 (0.682) + SIG-005 (constants) + SIG-006 (BLOCKED)]

**Claims with full chain:**
- ESI dependency component 0.682 → DIAG-007 → COND-007 → SIG-007 → SIG-002 → ST-007, ST-012–ST-015
- ESI throughput constants → DIAG-007 → COND-007 → SIG-007 → SIG-005 → AT-005, DT-001, DT-003

**Unknown claims (chain traced but source blocked):**
- ESI stability component → DIAG-007 → COND-007 → SIG-007 → SIG-006 [BLOCKED] → DT-007, AT-007, AT-009, DT-008

**Coverage state:** partial — SIG-006 component blocked

---

## INTEL-004 — Risk Profile State Traceability

| Intelligence ID | Source Diagnoses | Condition | Condition CKR | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| INTEL-004 | DIAG-008 | COND-008 | CKR-012 | SIG-008 (via SIG-004) | CKR-015/CKR-009 | static |
| INTEL-004 | DIAG-008 | COND-008 | CKR-012 | SIG-008 (via SIG-001) | CKR-015/CKR-006 | static |
| INTEL-004 | DIAG-008 | COND-008 | CKR-012 | SIG-008 (via SIG-001) | CKR-015/CKR-006 | event-based |
| INTEL-004 | DIAG-008 | COND-008 | CKR-012 | SIG-008 (via SIG-003) | CKR-015/CKR-008 | time-series |

**Full lineage chain:**
INTEL-004 → DIAG-008 (Stream 75.2) → COND-008 (CKR-012, condition_output_set.md) → SIG-008 (CKR-015) → [SIG-004 (ratios) + SIG-001 (structural) + SIG-003 (BLOCKED)]

**Claims with full chain:**
- Structural volatility ratios → DIAG-008 → COND-008 → SIG-008 → SIG-004 → ST-006, ST-007, ST-009, ST-010, ST-011, ST-022
- Structural coordination component → DIAG-008 → COND-008 → SIG-008 → SIG-001 → ST-012, ST-016

**Unknown claims (chain traced but source blocked):**
- Change concentration gradient → DIAG-008 → COND-008 → SIG-008 → SIG-003 [BLOCKED] → AT-001, AT-002

**Coverage state:** partial — SIG-003 component blocked

---

## INTEL-005 — Unknown Space Declaration Traceability

| Intelligence ID | Source Diagnoses | Condition | Condition CKR | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| INTEL-005 | DIAG-005 | COND-005 | CKR-012 | SIG-003 | CKR-008 | time-series |
| INTEL-005 | DIAG-006 | COND-006 | CKR-012 | SIG-006 | CKR-011 | event-based |

**Full lineage chain:**
INTEL-005 → DIAG-005 (Stream 75.2, BLOCKED) → COND-005 (CKR-012) → SIG-003 (CKR-008, BLOCKED) → AT-001, AT-002 [not in static 40.4]
INTEL-005 → DIAG-006 (Stream 75.2, BLOCKED) → COND-006 (CKR-012) → SIG-006 (CKR-011, BLOCKED) → DT-007, AT-007 [requires live pipeline execution]

**Coverage state:** blocked — both source diagnoses blocked; unknown space fully declared with traceability

---

## End-to-End Lineage Summary

| Intelligence | Diagnosis | Condition | Signal(s) | Telemetry (via upstream chain) |
|---|---|---|---|---|
| INTEL-001 | DIAG-001, DIAG-002 | COND-001, COND-002 | SIG-002, SIG-004 | ST-007, ST-009–ST-016, ST-022 |
| INTEL-002 | DIAG-003, DIAG-004 | COND-003, COND-004 | SIG-001, SIG-005 | ST-012, ST-016, AT-005, AT-006[p], DT-001, DT-003, DT-007[p] |
| INTEL-003 | DIAG-007 | COND-007 | SIG-007 (SIG-002, SIG-005, SIG-006[b]) | ST-007, ST-012–ST-015, AT-005, DT-001, DT-003, DT-007[b], AT-007[b] |
| INTEL-004 | DIAG-008 | COND-008 | SIG-008 (SIG-004, SIG-001, SIG-003[b]) | ST-006–ST-012, ST-016, ST-022, AT-001[b], AT-002[b] |
| INTEL-005 | DIAG-005, DIAG-006 | COND-005, COND-006 | SIG-003[b], SIG-006[b] | AT-001[b], AT-002[b], DT-007[b], AT-007[b] |

**Legend:** [p] = pending live telemetry; [b] = blocked (telemetry unavailable)

**Total intelligence claims traced to diagnosis: 5 / 5**
**End-to-end lineage preserved: yes — intelligence → diagnosis → condition → signal → telemetry**
**Unsupported claims: 0**
