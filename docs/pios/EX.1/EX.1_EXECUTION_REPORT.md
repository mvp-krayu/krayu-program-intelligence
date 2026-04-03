# EX.1 — Execution Report

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** EXECUTION REPORT
**Date:** 2026-04-03
**Authority:** EX.1
**Status:** COMPLETE

---

## 1. PRELOAD GATE RESULT

**PRELOAD PARTIAL**

| Check | Result | Detail |
|---|---|---|
| Branch | PASS | `pios-governance-baseline-v0.4` (correct) |
| Staged changes | PASS | None |
| Unstaged changes | PASS | None |
| Untracked files | CAUTION | Prior-stream residue present (see below) |

**Untracked file assessment:**
- `app/execlens-demo/.env` — environment file; MUST NOT be committed
- `docs/governance/runtime/git_structure_contract.md` — prior governance stream artifact
- `docs/governance/runtime/reference_boundary_contract.md` — prior governance stream artifact
- `docs/pios/contracts/40.16/`, `A.5B/`, `A.5C/`, `A.6/`, `A.7/` — prior stream artifacts
- `runs/pios/40.5/ce10_validation/` — CE.10 validation run (untracked)
- `runs/pios/40.6/ce10_validation/` — CE.10 validation run (untracked)

None of these files conflict with EX.1 execution. EX.1 proceeded with explicit caution.

---

## 2. FILES INSPECTED

| File | Purpose |
|---|---|
| `app/execlens-demo/pages/api/execlens.js` | Primary API route — entry point to all adapters |
| `app/execlens-demo/pages/index.js` | Main demo page — component assembly and query flow |
| `app/execlens-demo/components/SignalGaugeCard.js` | Signal display — data structure crossing |
| `scripts/pios/42.4/execlens_adapter.py` | Main query adapter |
| `scripts/pios/42.6/execlens_overview_adapter.py` | Overview metrics adapter |
| `scripts/pios/42.7/execlens_topology_adapter.py` | Topology adapter |
| `scripts/pios/42.23/execlens_wowchain_adapter.py` | WOW chain adapter |
| `scripts/pios/42.1/run_execlens_query.py` | L3 query execution base |
| `docs/pios/41.4/signal_registry.json` | L3 signal registry (static) |
| `docs/pios/41.5/query_signal_map.json` | L3 query-to-signal map |
| `docs/pios/42.22/sample_runtime_output.json` | WOW chain source artifact |
| `runs/pios/40.5/ce10_validation/signal_output.json` | CE.10 engine signal output |
| `runs/pios/40.6/ce10_validation/condition_output.json` | CE.10 engine condition output |
| `docs/governance/runtime/reference_boundary_contract.md` | Layer boundary model |
| `docs/pios/contracts/40.16/execution_contract.md` | 40.16 execution contract |
| `pios/core/v0.1/engine/compute_signals.py` | Certified emission engine |
| `pios/core/v0.1/engine/activate_conditions.py` | Certified activation engine |

---

## 3. BINDING SURFACES IDENTIFIED

| Surface | Components | Governed Output Exposed |
|---|---|---|
| Query execution surface | 42.4 → 42.2 → 42.1 → 41.x | NO (L3 semantic only) |
| Overview metrics surface | 42.6 → 42.2 → 42.1 → 41.4 | NO (extracted from narrative) |
| Topology surface | 42.7 → 42.2 → 42.1 → 41.x | NO (co-occurrence derived) |
| WOW chain surface | 42.23 → 42.22 source | NO (non-CE.4 vocabulary) |
| ENL status surface | 42.13 (MISSING) | DEAD PATH |
| ENL chain surface | 42.15 (MISSING) | DEAD PATH |
| Persona view surface | 42.16 (MISSING) | DEAD PATH |
| EX.1 verifier | Engine → runs/pios/EX.1/ | YES (CE.4/CE.5/CE.2 governed) |

---

## 4. RUNTIME → PIOS FLOW SUMMARY

The runtime (42.x) operates entirely at **L3** (semantic layer). It reads from static
`docs/pios/41.x/` artifacts. The PiOS v0.4 certified engine at `pios/core/v0.1/engine/`
is **not invoked** by the runtime. There is no live path from the runtime to any CE.4,
CE.5, or CE.2 governed output.

The CE.10 validation outputs exist (`runs/pios/40.5/ce10_validation/`,
`runs/pios/40.6/ce10_validation/`) but are not read by any adapter and are currently
untracked.

The layer boundary (L2 Core → L3 Semantic) is structurally correct per the
`reference_boundary_contract.md`: L3 reads from L2 outputs. The defect is that
this reading is not live — it reads static pre-computed L3 artifacts, not the
current engine output.

---

## 5. DEFECTS FOUND

| Defect ID | BIND Class | Severity | Description |
|---|---|---|---|
| BD-001 | BIND-001 | CRITICAL | Runtime does not invoke PiOS v0.4 engine |
| BD-002 | BIND-002 | HIGH | 42.22 uses signal_state: "computed" (non-CE.4) |
| BD-003 | BIND-003 | CRITICAL | CE.5 consumption records absent from runtime |
| BD-004 | BIND-006 | CRITICAL | condition_coverage_state and diagnosis_activation_state absent |
| BD-005 | BIND-007 | CRITICAL | Three missing adapters (42.13, 42.15, 42.16) |
| BD-006 | BIND-008 | HIGH | No programmatic compliance verification before this stream |

**Compliant behaviors (preserved):**
- No synthetic data in any adapter (R3) ✓
- Fail-closed on invalid inputs (R4) ✓
- Input sanitization in API route ✓
- Deterministic extraction rules in 42.6/42.7 ✓
- Fail-closed in 42.23 on unknown emphasis values ✓

---

## 6. CHANGES APPLIED

| Change | File | Type | Addresses |
|---|---|---|---|
| Created runtime binding verifier | `scripts/pios/EX.1/runtime_binding_verifier.py` | New file | BD-006 (partial) |
| Created EX.1 artifact directory | `docs/pios/EX.1/` | Structure | EX.1 contract |
| Ran baseline verification | `runs/pios/EX.1/EX1_baseline_20260403/` | Run archive | RB-005..RB-007 |

**No existing files modified.**
**No engine files modified.**
**No adapter scripts modified.**

---

## 7. VERIFICATION EXECUTED

**Script:** `scripts/pios/EX.1/runtime_binding_verifier.py`
**Run ID:** `EX1_baseline_20260403`
**Date:** 2026-04-03

| Domain | Result | Violations |
|---|---|---|
| Emission | PASS | 0 |
| Consumption | PASS | 0 |
| Propagation | PASS | 0 |
| Traceability | PASS | 0 |
| Regression | PASS | 0 |

**Output:** `runs/pios/EX.1/EX1_baseline_20260403/validation_result.json`
**Verdict:** COMPLIANT

---

## 8. RESULT: PARTIAL

The PiOS v0.4 engine is EXECUTABLE-PROVEN and produces fully compliant outputs
(verified by EX.1 baseline run). The engine itself is correctly bound.

The runtime (42.x → 41.x) is NOT bound to the live PiOS engine outputs. It reads
static L3 semantic artifacts that do not expose CE.4/CE.5/CE.2 governed states.
Four CRITICAL binding defects (BD-001, BD-003, BD-004, BD-005) require EX.3 stream
work to close.

**Result: PARTIAL**

Rationale: The engine binding is verified (EX.1 core objective met). The runtime-to-engine
binding is structurally absent (EX.3 scope required). EX.1 cannot close this gap
without redesigning the demo surface — which is explicitly prohibited by the EX.1
contract.

---

## 9. READINESS FOR EX.2: YES

EX.2 (Debug/Trace Interface) can proceed. The EX.1 baseline verification run
provides the governed output artifacts that EX.2 would inspect:
- `runs/pios/40.5/EX1_baseline_20260403/signal_output.json`
- `runs/pios/40.6/EX1_baseline_20260403/condition_output.json`
- `runs/pios/EX.1/EX1_baseline_20260403/validation_result.json`

The verification protocol (`verification_protocol.md`) defines the format and
semantics of these outputs.

---

## 10. GIT HYGIENE NOTE

- Branch: `pios-governance-baseline-v0.4` ✓
- EX.1 artifacts committed to this branch
- `app/execlens-demo/.env` NOT committed (environment file)
- Prior-stream untracked residue (A.5B, A.5C, A.6, A.7, CE.10 validation runs)
  left as-is — these are pre-existing and outside EX.1 scope
- EX.1 run outputs (`runs/pios/EX.1/EX1_baseline_20260403/`,
  `runs/pios/40.5/EX1_baseline_20260403/`, `runs/pios/40.6/EX1_baseline_20260403/`)
  committed as run archive evidence (RB-005)
