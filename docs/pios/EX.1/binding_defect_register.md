# EX.1 — Binding Defect Register

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** BINDING DEFECT REGISTER
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. REGISTER SUMMARY

| Defect ID | Class | Severity | Domain | Correctable in EX.1 | Owner Stream |
|---|---|---|---|---|---|
| BD-001 | BIND-001 | CRITICAL | Architectural | NO | EX.3 |
| BD-002 | BIND-002 | HIGH | Data/Vocabulary | NO | GC-003 + EX.3 |
| BD-003 | BIND-003 | CRITICAL | Traceability | NO | EX.3 |
| BD-004 | BIND-006 | CRITICAL | Propagation | NO | EX.3 |
| BD-005 | BIND-007 | CRITICAL | Adapter contract | NO | EX.3 (×3) |
| BD-006 | BIND-008 | HIGH | Verification | PARTIAL | EX.1 (verifier script) |

**EX.1 corrects: 0 structural defects (BD-001..BD-005 require EX.3 scope)**
**EX.1 partially addresses: BD-006 (creates verification script; cannot enforce RB-006 at runtime)**

---

## 2. DEFECT DETAILS

---

### BD-001 — Runtime Bypass of Governed Engine Output

**Class:** BIND-001
**Severity:** CRITICAL
**Status:** OPEN — requires EX.3

**Description:**
The 42.x runtime adapter chain reads exclusively from `docs/pios/41.x/` static L3 artifacts.
The PiOS v0.4 certified engine (`pios/core/v0.1/engine/compute_signals.py`,
`activate_conditions.py`) is never invoked. The CE.10 validation outputs
(`runs/pios/40.5/ce10_validation/signal_output.json`,
`runs/pios/40.6/ce10_validation/condition_output.json`) are never read.

**Evidence:**
- 42.1 module reads: `docs/pios/41.5/query_signal_map.json`, `docs/pios/41.4/signal_registry.json`,
  `docs/pios/41.4/evidence_mapping_index.json`, `docs/pios/41.5/query_response_templates.md`
- No `import` or `execFile` of any engine script in the 42.x chain
- No reference to `runs/pios/40.5/` or `runs/pios/40.6/` in any adapter

**Governance reference:** EX.H1 RB-001 (only certified engine may be used for compliance claims);
EX.H1 SB-001 (PiOS is authoritative source)

**Impact:**
- All CE.4/CE.5/CE.2 governed outputs are absent from the runtime surface
- Runtime cannot make any PiOS v0.4 compliance claim
- Cascading defects: BD-002, BD-003, BD-004

**Correction path:**
An EX.3 (System Bridge) stream must implement an adapter that reads the certified engine
outputs (or invokes the engine via an EX.1-class run) and exposes CE.4 signal states,
CE.5 consumption records, and CE.2 condition/diagnosis states to the runtime.

**Cannot be corrected within EX.1 scope.**

---

### BD-002 — Non-Governed Signal State Vocabulary in WOW Chain

**Class:** BIND-002
**Severity:** HIGH
**Status:** OPEN — requires GC-003 + EX.3

**Description:**
The 42.22 source artifact (`docs/pios/42.22/sample_runtime_output.json`) contains
`signal_state: "computed"` in each exposure record. This value is outside the CE.4
governed vocabulary {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING}. The 42.23
adapter passes this field through without validation.

Additionally, the 41.4 signal_registry.json has NO emission state field. Signal records
carry `evidence_confidence` (STRONG/MODERATE/WEAK) — not CE.4 vocabulary.

**Evidence:**
- `docs/pios/42.22/sample_runtime_output.json` record sample: `"signal_state": "computed"`
- CE.4 INV-001..INV-007 define the closed emission state set
- 41.4 signal_registry.json fields: `{signal_id, title, statement, evidence_confidence, ...}` —
  no `emission_state` or `signal_state` with CE.4 values

**Governance reference:** EX.H1 Principle P1 (no semantic drift);
CE.4 emission state vocabulary; EX.H1 EV-001

**Impact:**
- `signal_state` shown in the runtime WOW surface does not correspond to any CE.4 state
- A downstream consumer reading `signal_state: "computed"` cannot derive CE.4 compliance status
- The field name matches CE.4 terminology but the value is outside the governed vocabulary

**Correction path:**
1. GC-003 change to update `docs/pios/42.22/sample_runtime_output.json` to use CE.4 emission
   state vocabulary (requires re-running the governed WOW chain with CE.4 states)
2. EX.3 stream to supply CE.4 signal states from engine output to the WOW surface

**Cannot be corrected within EX.1 scope.**

---

### BD-003 — CE.5 Traceability Absent from Runtime Surface

**Class:** BIND-003
**Severity:** CRITICAL
**Status:** OPEN — requires EX.3

**Description:**
CE.5 traceability records (Type 1: consumption records per governed signal; Type 2:
structural gap trace records for absent signals) are produced by the certified engine
and exist in `runs/pios/40.6/ce10_validation/condition_output.json`
(`ce5_consumption_records`: 8, `ce5_traceability_records`: 8). None of these records
are read or exposed by any 42.x runtime adapter.

**Evidence:**
- `condition_output.json` fields confirmed: `ce5_consumption_records`, `ce5_traceability_records`
- No 42.x adapter references these fields
- No API route surfaces consumption or traceability records
- `SignalGaugeCard.js` shows signal data but no CE.5 consumption state

**Governance reference:** EX.H1 SB-007 (mandatory inspection surface includes
"CE.5 consumption records"); CE.5 T-001/T-002; EX.H1 Principle P3 (full traceability)

**Impact:**
- The runtime cannot satisfy EX.H1 SB-007 mandatory inspection requirement
- Signal → consumption → propagation → diagnosis chain cannot be reconstructed from runtime

**Correction path:**
EX.3 (System Bridge) stream must add a consumption record exposure endpoint and surface
CE.5 consumption and traceability records per signal.

---

### BD-004 — Propagation and Diagnosis States Absent from Runtime

**Class:** BIND-006
**Severity:** CRITICAL
**Status:** OPEN — requires EX.3

**Description:**
`condition_coverage_state` (CE.2 DEC-009 tier values: 6×STABLE, 2×BLOCKED) and
`diagnosis_activation_state` (CE.2 DEC-014 values: 6×INACTIVE, 2×BLOCKED) exist in
the CE.10 validation condition output but are not accessible from any 42.x adapter or
runtime component.

**Evidence:**
- `condition_output.json` confirmed conditions: COND-001..COND-008 with condition_coverage_state
- `condition_output.json` confirmed diagnoses: DIAG-001..DIAG-008 with diagnosis_activation_state
- No 42.x adapter or API route reads `condition_output.json`
- No frontend component displays condition tiers or diagnosis activation states

**Governance reference:** EX.H1 SB-007 (mandatory inspection surface includes
"propagation states" and "diagnosis states"); CE.2 DEC-009, DEC-014;
EX.H1 Principle P3

**Impact:**
- The runtime provides no visibility into program health classification
- Downstream consumers cannot determine whether conditions are BLOCKED/DEGRADED/AT_RISK/STABLE
- Diagnosis states (which drive intervention recommendations) are hidden

**Correction path:**
EX.3 stream must implement a propagation state endpoint exposing condition tiers and
diagnosis states from the certified engine output.

---

### BD-005 — Three Missing Adapter Scripts

**Class:** BIND-007
**Severity:** CRITICAL
**Status:** OPEN — requires EX.3 (×3)

**Description:**
The API route `pages/api/execlens.js` explicitly references three adapter scripts that
do not exist on the filesystem:

| Reference | Path | Effect |
|---|---|---|
| ADAPTER_42_13 | `scripts/pios/42.13/demo_activate.py` | MISSING |
| ADAPTER_42_15 | `scripts/pios/42.15/enl_console_adapter.py` | MISSING |
| ADAPTER_42_16 | `scripts/pios/42.16/persona_view_map.py` | MISSING |

Any request hitting `?status=true`, `?enl=GQ-NNN`, or `?persona=X&query=GQ-NNN` will fail
with a 400 error (execFile fails to launch non-existent script).

**Evidence:**
- `pages/api/execlens.js` lines 31-33: ADAPTER_42_13, ADAPTER_42_15, ADAPTER_42_16 defined
- `scripts/pios/42.13/`, `scripts/pios/42.15/`, `scripts/pios/42.16/` directories: do not exist

**Governance reference:** EX.H1 RB-001 (only certified engine); EX.H1_STREAM_DEFINITION.md;
CE.11 BIND-007 classification

**Impact:**
- Three demo paths (ENL status, ENL chain reveal, persona projection) are non-functional
- The runtime API contract (`pages/api/execlens.js`) is incomplete
- Error response is fail-closed (400), not silent — this is compliant behavior, but the
  feature is absent

**Correction path:**
Three separate EX.3 or EX.2 stream instances must implement the missing adapters.
Each requires a governing stream definition before implementation.

---

### BD-006 — Runtime Compliance Verification Absent

**Class:** BIND-008
**Severity:** HIGH
**Status:** PARTIALLY ADDRESSED (EX.1 creates verifier; runtime invocation not enforced)

**Description:**
No programmatic compliance validation exists in the runtime invocation path.
EX.H1 RB-006 requires that every runtime invocation supporting a compliance claim must
be followed by programmatic validation of all 4 compliance domains. EX.H1 RB-007 requires
a `validation_result.json` in the run archive. Neither exists.

The CE.10 validation run produced validation evidence but this is static — it was run once
and stored. There is no mechanism to re-run validation on runtime invocation.

**Evidence:**
- No `validation_result.json` in any `runs/pios/` directory
- No adapter calls any compliance validation script
- No API route triggers engine execution + validation

**Governance reference:** EX.H1 RB-006, RB-007, RB-009..RB-012

**EX.1 correction (partial):**
A bounded verification script `scripts/pios/EX.1/runtime_binding_verifier.py` is
created by this stream. It can be run standalone to:
1. Invoke the PiOS v0.4 engine
2. Validate compliance across all 4 domains
3. Produce `validation_result.json` in the run archive
4. Check regression against the certified baseline

This does NOT enforce RB-006 at runtime invocation (that requires EX.3 integration).
It establishes the verification capability as a standalone EX.1-class artifact.
