# Adapter Execution Manifest

**run_id:** run_01_demo_compat_verification
**adapter:** demo_compat/map_core_to_demo.py
**contract:** pios/core/v0.1/adapters/demo_compat/contract.yaml
**date:** 2026-04-01
**branch:** feature/demo-compat-adapter
**verification_contract:** DEMO_COMPAT VERIFICATION — STRICT / AGAINST GOLDEN DEMO EXPECTATIONS

---

## Execution Identity

| Field | Value |
|---|---|
| Run ID | run_01_demo_compat_verification |
| Adapter | pios/core/v0.1/adapters/demo_compat/map_core_to_demo.py |
| Adapter Contract | pios/core/v0.1/adapters/demo_compat/contract.yaml |
| Execution mode | Claude Code — VERIFICATION ONLY |
| Branch | feature/demo-compat-adapter |
| CWD | /Users/khorrix/Projects/k-pi-core |
| Output root | runs/pios/adapter/run_01_demo_compat_verification/ |

---

## Pre-Flight

| Check | Result |
|---|---|
| CLAUDE.md read | PASS |
| git_structure_contract.md read | PASS |
| CWD = /Users/khorrix/Projects/k-pi-core | PASS |
| Branch = feature/demo-compat-adapter | PASS |
| No tracked dirty state | PASS |
| Output path clear (did not pre-exist) | PASS |

**Pre-Flight: PASS**

---

## Input Boundary

| Input | Path | Access | Authorized |
|---|---|---|---|
| compute_signals.py | pios/core/v0.1/engine/compute_signals.py | read | yes |
| activate_conditions.py | pios/core/v0.1/engine/activate_conditions.py | read | yes |
| synthesize_intelligence.py | pios/core/v0.1/engine/synthesize_intelligence.py | read | yes |
| map_core_to_demo.py | pios/core/v0.1/adapters/demo_compat/map_core_to_demo.py | read | yes |
| contract.yaml | pios/core/v0.1/adapters/demo_compat/contract.yaml | read | yes |
| signal_registry.json | docs/pios/41.4/signal_registry.json | read | yes (A2) |
| evidence_mapping_index.json | docs/pios/41.4/evidence_mapping_index.json | read | yes (A3) |

---

## Pipeline Execution

Full pipeline executed to produce Core intelligence output consumed by adapter:

| Step | Script | Output Path | Status |
|---|---|---|---|
| 1 | compute_signals.py | _pipeline/signal_output.json | PARTIAL (SIG-002, SIG-004 COMPLETE; SIG-001, SIG-005, SIG-007, SIG-008 PARTIAL; SIG-003, SIG-006 BLOCKED) |
| 2 | activate_conditions.py | _pipeline/condition_output.json | PARTIAL (COND-001, COND-002 complete; COND-003..004,007..008 partial; COND-005..006 blocked) |
| 3 | synthesize_intelligence.py | _pipeline/intelligence_output.json | PARTIAL (INTEL-001..002 synthesized; INTEL-003..004,007..008 partial; INTEL-005..006 blocked) |
| 4 | map_core_to_demo.py | demo_compat_output.json | COMPLETE (5/5 demo signals emitted) |

---

## Output Artifacts

| Artifact | Path |
|---|---|
| Adapter Output | runs/pios/adapter/run_01_demo_compat_verification/demo_compat_output.json |
| Execution Manifest | runs/pios/adapter/run_01_demo_compat_verification/adapter_execution_manifest.md |
| Verification Report | runs/pios/adapter/run_01_demo_compat_verification/demo_compat_verification_report.md |
| Golden Demo Expectation Matrix | runs/pios/adapter/run_01_demo_compat_verification/golden_demo_expectation_matrix.md |
| Adapter Traceability Report | runs/pios/adapter/run_01_demo_compat_verification/adapter_traceability_report.md |

---

## Scope Compliance

| Check | Result |
|---|---|
| All writes to runs/pios/adapter/run_01_demo_compat_verification/ | PASS |
| docs/ not written | PASS |
| app/execlens-demo/ not written | PASS |
| Core engine scripts not modified | PASS |
| Adapter source files not modified | PASS |
| Validated run artifacts not modified | PASS |
| Golden Demo artifacts (41.4) not modified | PASS |
| No tracked git dirty state | PASS |

---

## Final Execution Status

| Dimension | Status |
|---|---|
| Pre-flight | PASS |
| Pipeline execution | COMPLETE |
| Adapter output produced | PASS (5/5 demo signals) |
| Scope compliance | PASS |
| Golden Demo verification | PASS (all V1–V7 checks) |

**EXECUTION STATUS: PASS**
