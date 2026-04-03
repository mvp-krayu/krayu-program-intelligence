# CE.6 — Propagation Compliance Report

**Stream:** CE.6 — Engine Compliance & Executable Validation
**Artifact type:** COMPLIANCE REPORT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.6
**Contract under evaluation:** CE.5 Propagation Semantics + CE.2 DEC-009/DEC-014
**Engine under evaluation:** `pios/core/v0.1/engine/activate_conditions.py`

---

## 1. PURPOSE

This report evaluates whether the PiOS v0.1 engine propagates signal consumption state
to the condition activation layer in compliance with:

1. **CE.5 propagation rules** (P-001 through P-005, `propagation_semantics.md`)
2. **CE.2 DEC-009** — governed tier vocabulary at 40.6
3. **CE.2 DEC-014** — diagnosis state mapping from tier

---

## 2. CE.5 PROPAGATION REQUIREMENTS

| Rule | Description |
|---|---|
| P-001 | Propagated record carries: signal_id, origin="CE.4", consumption_state, output_ref |
| P-002 | consumption_state is derived exclusively from CE.4 emission state via CE.5 mapping |
| P-003 | output_ref references the CE.4 output object unchanged |
| P-004 | CE.5 does not modify, aggregate, or derive new fields during propagation |
| P-005 | No new propagation records created beyond those from CE.4 packet signals |

---

## 3. CE.2 PROPAGATION REQUIREMENTS

**DEC-009 — Tier vocabulary (CE.2 §9):**
Exactly four tiers at 40.6: `BLOCKED`, `DEGRADED`, `AT_RISK`, `STABLE`.
No other tier value is valid.

**DEC-014 — Diagnosis state mapping (CE.2):**
| Tier | Diagnosis state |
|---|---|
| BLOCKED | BLOCKED |
| DEGRADED | ACTIVE |
| AT_RISK | ACTIVE |
| STABLE | INACTIVE |

---

## 4. ENGINE PROPAGATION IMPLEMENTATION ASSESSMENT

### 4.1 CE.5 propagation record structure (P-001)

The engine does not produce CE.5-structured propagation records.
No record with `{signal_id, origin, consumption_state, output_ref}` is produced.
Signal state passes through `SIGNAL_TO_CONDITION_STATE` directly into condition evaluation.

**Status: FAIL (P-001 not satisfied)**

---

### 4.2 CE.5 consumption state derivation (P-002)

The engine derives condition state from signal emission state via:

```python
SIGNAL_TO_CONDITION_STATE = {
    "COMPLETE": "complete",
    "PARTIAL":  "partial",
    "BLOCKED":  "blocked",
}
```

This mapping does not apply CE.5 consumption state names (AVAILABLE / PARTIAL / BLOCKED).
The derived values (`"complete"`, `"partial"`, `"blocked"`) do not match CE.5 or CE.2 vocabulary.

**Status: FAIL (P-002 not satisfied — wrong vocabulary)**

---

### 4.3 Output reference pass-through (P-003)

The engine reads signal output fields for condition evaluation. The signal output object
is referenced directly from the CE.4 packet, not copied or modified before use.

**Status: PASS (behavioral) — P-003 not violated at the behavioral level**

---

### 4.4 No new field derivation (P-004)

No new fields are derived or injected during propagation. The engine does not create
aggregated or cross-signal derived values within the propagation path.

**Status: PASS (behavioral) — P-004 not violated**

---

### 4.5 No fabricated propagation records (P-005)

No propagation records are fabricated for signals absent from the CE.4 packet.
No structural gap trace records are produced (these are traceability-only and do not
enter propagation — CE.5 T-001/T-002).

**Status: PASS (behavioral) — P-005 not violated**

---

### 4.6 CE.2 DEC-009 tier vocabulary

The engine produces condition states using the vocabulary:
`"complete"`, `"partial"`, `"blocked"`

CE.2 DEC-009 requires: `BLOCKED`, `DEGRADED`, `AT_RISK`, `STABLE`

**Assessment:**
- `"blocked"` is a case mismatch of `BLOCKED` — vocabulary violation
- `"complete"` has no equivalent in CE.2 tier vocabulary
- `"partial"` has no equivalent in CE.2 tier vocabulary
- `DEGRADED`, `AT_RISK`, `STABLE` are never produced by the engine

**Status: FAIL — CE.2 DEC-009 tier vocabulary not used**

---

### 4.7 CE.2 DEC-014 diagnosis state mapping

The engine implements:

```python
CONDITION_TO_DIAGNOSIS_STATE = {
    "complete": "active",
    "partial":  "partial",
    "blocked":  "blocked",
}
```

CE.2 DEC-014 requires:
- `BLOCKED` → `BLOCKED`
- `DEGRADED` → `ACTIVE`
- `AT_RISK` → `ACTIVE`
- `STABLE` → `INACTIVE`

**Assessment:**
- `"partial"` → `"partial"` has no CE.2 DEC-014 basis — `"partial"` is not a governed tier
- `"complete"` → `"active"` has no CE.2 DEC-014 basis — `"complete"` is not a governed tier
- `DEGRADED` → `ACTIVE` is not implemented (tier not produced by engine)
- `AT_RISK` → `ACTIVE` is not implemented (tier not produced by engine)
- `STABLE` → `INACTIVE` is not implemented (tier not produced by engine)
- `"blocked"` → `"blocked"` approximates `BLOCKED` → `BLOCKED` but uses wrong case

**Status: FAIL — CE.2 DEC-014 mapping not applied**

---

## 5. PROPAGATION COMPLIANCE SUMMARY

| Requirement | Engine status |
|---|---|
| P-001: CE.5 propagation record structure | **FAIL** |
| P-002: CE.5 consumption state vocabulary | **FAIL** |
| P-003: output_ref pass-through | PASS (behavioral) |
| P-004: no new field derivation | PASS (behavioral) |
| P-005: no fabricated propagation records | PASS (behavioral) |
| CE.2 DEC-009: governed tier vocabulary | **FAIL** |
| CE.2 DEC-014: diagnosis state mapping | **FAIL** |

---

## 6. VIOLATION CATALOG

| ID | Rule | Description |
|---|---|---|
| V-P-001 | CE.5 P-001 | No CE.5 propagation record structure produced |
| V-P-002 | CE.5 P-002 | Engine uses complete/partial/blocked; CE.5 requires AVAILABLE/PARTIAL/BLOCKED |
| V-P-003 | CE.2 DEC-009 | Tier vocabulary BLOCKED/DEGRADED/AT_RISK/STABLE not used; engine produces complete/partial/blocked |
| V-P-004 | CE.2 DEC-014 | Diagnosis state mapping does not reflect governed DEC-014 table; partial/complete are not governed tiers |

---

## 7. PROPAGATION COMPLIANCE VERDICT

The PiOS v0.1 engine does NOT comply with CE.5 propagation semantics or CE.2 DEC-009/DEC-014
propagation requirements.

The engine bypasses the CE.5 propagation layer entirely and applies a non-governed internal
vocabulary that does not match either CE.5 or CE.2 tier definitions.

Behavioral propagation (pass-through of output reference, no fabrication) is partially correct
at a structural level. The vocabulary and record structure are non-compliant.

**CE.5 propagation compliance status: FAIL**
**CE.2 DEC-009/DEC-014 compliance status: FAIL**
