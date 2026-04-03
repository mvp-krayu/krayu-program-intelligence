# CE.6 — Consumption Compliance Report

**Stream:** CE.6 — Engine Compliance & Executable Validation
**Artifact type:** COMPLIANCE REPORT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.6
**Contract under evaluation:** CE.5 Signal Consumption & Propagation Contract
**Engine under evaluation:** `pios/core/v0.1/engine/activate_conditions.py`

---

## 1. PURPOSE

This report evaluates whether the PiOS v0.1 engine implementation at `activate_conditions.py`
complies with the CE.5 consumption contract as defined in:

- `docs/pios/CE.5/consumption_state_model.md`
- `docs/pios/CE.5/single_signal_consumption_rules.md`
- `docs/pios/CE.5/propagation_boundary_enforcement.md`

CE.5 defines a passive consumption layer between 40.5 (compute_signals) and 40.6
(activate_conditions). This layer must apply the CE.5 consumption state vocabulary
(AVAILABLE / PARTIAL / BLOCKED) and consumption rules (C-001 through C-005).

---

## 2. CE.5 CONSUMPTION REQUIREMENTS

| Requirement | Source |
|---|---|
| CSM-1: Consumption state vocabulary is AVAILABLE / PARTIAL / BLOCKED (closed set) | consumption_state_model.md §2 |
| CSM-2: COMPLETE → AVAILABLE; PARTIAL → PARTIAL; BLOCKED → BLOCKED | consumption_state_model.md §3 |
| CSM-3: CE.5 MUST NOT invent a state for a signal absent from CE.4 packet | consumption_state_model.md §5 |
| C-001: COMPLETE signal → consumption_state=AVAILABLE; extract output; do not modify | single_signal_consumption_rules.md |
| C-002: PARTIAL signal → consumption_state=PARTIAL; null fields remain null; no substitution | single_signal_consumption_rules.md |
| C-003: BLOCKED signal → consumption_state=BLOCKED; do not attempt field extraction | single_signal_consumption_rules.md |
| C-004: COMPUTABLE_PENDING → apply C-002 | single_signal_consumption_rules.md |
| C-005: Signal absent from packet → structural error; no consumption state assigned | single_signal_consumption_rules.md |
| PBE-1: CE.5 does not modify signal records | propagation_boundary_enforcement.md §2 |
| PBE-2: Downstream receives: signal_id, consumption_state, output_ref, origin | propagation_boundary_enforcement.md §3 |
| PBE-3: Downstream does NOT receive: blocking metadata, partiality_reasons, traceability | propagation_boundary_enforcement.md §3 |

---

## 3. ENGINE IMPLEMENTATION ASSESSMENT

### 3.1 CE.5 consumption state vocabulary

The engine (`activate_conditions.py`) implements the following mapping:

```python
SIGNAL_TO_CONDITION_STATE = {
    "COMPLETE": "complete",
    "PARTIAL":  "partial",
    "BLOCKED":  "blocked",
}
```

This mapping uses lowercase strings: `"complete"`, `"partial"`, `"blocked"`.

**CE.5 requirement:** Consumption states are `AVAILABLE`, `PARTIAL`, `BLOCKED` (uppercase;
`COMPLETE` maps to `AVAILABLE`).

**Assessment:**
- The engine does NOT apply the CE.5 consumption state vocabulary
- The engine maps `COMPLETE` → `"complete"` (not `AVAILABLE`)
- The engine retains lowercase CE.4 emission state names, not CE.5 consumption state names
- No `AVAILABLE` state is produced anywhere in the engine

**Violation:** CSM-1 — CE.5 consumption state vocabulary not implemented
**Violation:** CSM-2 — COMPLETE → AVAILABLE mapping not applied; engine produces `"complete"` instead
**Violation:** C-001 — COMPLETE signals are not mapped to `consumption_state=AVAILABLE`

---

### 3.2 CE.5 consumption rules (C-001 through C-005)

The engine processes signal state through `SIGNAL_TO_CONDITION_STATE` and then applies
condition activation logic. There is no identifiable CE.5 consumption layer between signal
receipt and condition evaluation.

| Rule | Description | Engine implementation | Status |
|---|---|---|---|
| C-001 | COMPLETE → AVAILABLE, extract output, do not modify | Maps COMPLETE → "complete" (wrong vocabulary) | FAIL |
| C-002 | PARTIAL → PARTIAL, null fields unchanged | Maps PARTIAL → "partial" (wrong vocabulary); no explicit null-preservation enforcement | FAIL |
| C-003 | BLOCKED → BLOCKED, no field extraction | Maps BLOCKED → "blocked" (wrong vocabulary); does not attempt extraction | PARTIAL PASS* |
| C-004 | COMPUTABLE_PENDING → apply C-002 | No COMPUTABLE_PENDING handling | N/A (reserved) |
| C-005 | Absent signal → structural error, no state | No absent signal handling present | NOT VERIFIED |

*C-003 is partially satisfied at the behavioral level (no extraction on BLOCKED) but uses
incorrect vocabulary. Behavioral correctness does not satisfy vocabulary compliance.

---

### 3.3 Propagation boundary enforcement

**PBE-1 (no modification):** The engine reads signal output fields but does not modify the
signal records themselves. This is consistent with CE.5 PBE-1 at the behavioral level.

**PBE-2 (downstream delivery fields):** The engine does not produce a CE.5-compliant
consumption record with `{signal_id, consumption_state, output_ref, origin}`. Instead it
passes signal state directly through the `SIGNAL_TO_CONDITION_STATE` mapping into condition
logic. No `origin` field. No `output_ref`. No explicit `consumption_state` field.

**PBE-3 (prohibited downstream fields):** The engine does not explicitly forward `blocking_reason`,
`partiality_reasons`, or `traceability` fields to downstream condition logic. This is consistent
with PBE-3 at the behavioral level.

---

## 4. CONSUMPTION COMPLIANCE SUMMARY

| Requirement | Engine behavior | Status |
|---|---|---|
| CSM-1: AVAILABLE/PARTIAL/BLOCKED vocabulary | Uses complete/partial/blocked | **FAIL** |
| CSM-2: COMPLETE → AVAILABLE mapping | Maps COMPLETE → "complete" | **FAIL** |
| CSM-3: No invented states for absent signals | No present handling for absent signals | NOT VERIFIED |
| C-001: AVAILABLE from COMPLETE | Produces "complete" not "AVAILABLE" | **FAIL** |
| C-002: PARTIAL unchanged, no substitution | Behavioral: no substitution observed | PARTIAL |
| C-003: BLOCKED, no extraction | Behavioral: no extraction on blocked | PARTIAL |
| PBE-1: No signal record modification | Reads without modifying | PASS |
| PBE-2: Consumption record structure | No compliant record structure produced | **FAIL** |
| PBE-3: No prohibited fields downstream | CE.4 metadata not forwarded | PASS |

---

## 5. VIOLATION CATALOG

| ID | Rule | Description |
|---|---|---|
| V-C-001 | CSM-1 | CE.5 consumption state vocabulary not used; engine uses lowercase CE.4 emission state names |
| V-C-002 | CSM-2 / C-001 | COMPLETE → AVAILABLE mapping not applied; engine produces "complete" instead of "AVAILABLE" |
| V-C-003 | PBE-2 | CE.5 consumption record structure not produced; no signal_id/consumption_state/output_ref/origin envelope |

---

## 6. CONSUMPTION COMPLIANCE VERDICT

The PiOS v0.1 engine at `activate_conditions.py` does NOT comply with the CE.5 consumption
contract.

The CE.5 consumption layer is not implemented as a distinct governed layer. Signal state is
passed from compute_signals output into condition activation logic through an internal mapping
that does not use CE.5 vocabulary and does not produce CE.5 consumption records.

**CE.5 consumption compliance status: FAIL**
