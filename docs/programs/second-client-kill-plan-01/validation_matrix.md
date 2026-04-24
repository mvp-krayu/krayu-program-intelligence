# Validation Matrix

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: PLANNING — criteria defined, execution not yet performed

---

## Purpose

Define pass/fail criteria for second-client execution readiness and completion. Each criterion
must be explicitly verified — no assumed pass.

---

## 1. Zero BlueEdge Dependency

Verifies that the second-client run has no dependency on BlueEdge artifacts, paths, or data.

| Check | Pass condition | Fail condition |
|---|---|---|
| No `clients/blueedge/` paths in run scripts | Zero references found by grep | Any hardcoded BlueEdge path |
| No BlueEdge documents in evidence intake | Intake record references new client sources only | Any BlueEdge source document |
| No BlueEdge signal registry reused | Second-client signal registry derived independently | Any carry-forward from BlueEdge |
| `clients/blueedge/` directory unmodified | Git diff shows zero changes to `clients/blueedge/` | Any modification |
| BlueEdge baseline capsule unmodified | `docs/baseline/pios_baseline_v1.0.md` unchanged | Any modification |

**Gate:** ALL must PASS. Any FAIL → execution invalid.

---

## 2. Isolated Client Scaffold

Verifies that the second-client has a complete, isolated directory structure.

| Check | Pass condition | Fail condition |
|---|---|---|
| Client folder exists | `clients/<client-id>/` present | Missing |
| Run folder exists | `clients/<client-id>/psee/runs/<run-id>/` present | Missing |
| Intake record present | `intake_record.json` present and valid | Missing or invalid |
| Coherence record present | `coherence_record.json` present and valid | Missing or invalid |
| BASELINE_LOCK absent at start | Run folder has no BASELINE_LOCK before execution | Pre-existing lock |
| No shared files with BlueEdge | No symlinks or shared references to BlueEdge run | Any shared reference |

**Gate:** ALL must PASS.

---

## 3. Full S0–S4 Execution Readiness

Verifies that the pipeline can execute end-to-end on the second-client environment.

| Stage | Check | Pass condition | Fail condition |
|---|---|---|---|
| S0 | Evidence boundary defined | Ledger Selector produces conforming boundary | No boundary or non-conforming |
| S1 | 40.2 ingestion completes | No ingestion errors | Any ingestion failure |
| S1 | 40.3 classification completes | Classification produces valid output | Classification failure |
| S1 | 40.4 handoff validated | Handoff validation passes | Validation failure |
| S2 | Core navigation completes (L2) | Evidence navigation output present | Missing or empty |
| S2 | Core derivation completes (L3) | Signals, conditions, diagnosis produced | Missing or empty |
| S2 | Semantic shaping completes (L4) | Shaped outputs produced | Missing or empty |
| S3 | Activation completes (43.x/44.x) | Binding and projection outputs present | Missing or empty |
| S4 | GAUGE executes to STEP 12 | GAUGE produces canonical score | GAUGE failure or incomplete |
| S4 | Report generated | LENS report artifact present | Missing |
| S4 | Decision state produced | PROCEED / INVESTIGATE / ESCALATE present | Missing or undefined |

**Gate:** ALL must PASS. Any FAIL at any stage → run invalid.

---

## 4. Evidence Chain Completeness

Verifies that all outputs are traceable to source evidence.

| Check | Pass condition | Fail condition |
|---|---|---|
| Domain count derivable from evidence | Each domain traceable to evidence source | Any domain without evidence trace |
| Signal count derivable from evidence | Each signal has evidence grounding | Any signal without grounding |
| Canonical score derivable | Score computation traceable through derivation chain | Score without traceable basis |
| CEU count derivable | CEU computation traceable | CEU without traceable basis |
| No synthetic data | All evidence from actual client source | Any placeholder or synthetic value |
| Coherence record references valid sources | All source references in coherence_record.json resolvable | Any broken reference |

**Gate:** ALL must PASS.

---

## 5. Deterministic Rerun Readiness

Verifies that the run can be reproduced from the same inputs.

| Check | Pass condition | Fail condition |
|---|---|---|
| Fixed evidence boundary | Evidence boundary locked before execution | Evidence modified during run |
| No stochastic components in derivation | Same input → same output on rerun | Any non-deterministic behavior |
| Code tag recorded | Exact code version recorded in run artifacts | Code version unknown |
| Environment recorded | Python version and dependencies documented | Environment undocumented |
| Command sequence recorded | Full command sequence in execution log | Missing commands |
| Rerun test | Manual rerun produces identical output | Output differs on rerun |

**Gate:** ALL must PASS. Rerun test is mandatory before declaring run authoritative.

---

## 6. Brain Emission Completeness

Verifies that all four brain domains have been populated from run evidence.

| Brain | Check | Pass condition | Fail condition |
|---|---|---|---|
| CANONICAL | Confirmed invariants documented | At least 3 invariants confirmed | Empty or missing |
| CANONICAL | Broken invariants documented | Broken invariants explicitly listed OR "none found" stated | Omitted |
| CANONICAL | New structural definitions documented | New definitions listed OR "none found" stated | Omitted |
| CODE | Command sequence recorded | Full S0–S4 command sequence present | Any gap |
| CODE | Scripts touched documented | All modified scripts listed | Any undocumented modification |
| CODE | Failure modes recorded | All encountered failures documented | Silent failure |
| PRODUCT | Onboarding implications documented | Time-to-first-output evidence recorded | Missing |
| PRODUCT | Client package requirements defined | Minimum evidence set documented | Missing |
| PUBLISH | Safe external claims listed | Claims with activation conditions | Missing |
| PUBLISH | Prohibited claims listed | Confirmed prohibited list | Missing |

**Gate:** ALL brain domains must reach PASS before any external publish claim is activated.

---

## Summary Gate

| Criteria group | Gate |
|---|---|
| 1. Zero BlueEdge dependency | ALL PASS required |
| 2. Isolated client scaffold | ALL PASS required |
| 3. Full S0–S4 execution readiness | ALL PASS required |
| 4. Evidence chain completeness | ALL PASS required |
| 5. Deterministic rerun readiness | ALL PASS required |
| 6. Brain emission completeness | ALL PASS required |

**Overall gate:** ALL six criteria groups must reach ALL PASS.  
Any single FAIL in any group → run is NOT authoritative.  
A non-authoritative run must not be used as a product reference or publish basis.
