# EX.1 — Runtime Conformity Assessment

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** RUNTIME CONFORMITY ASSESSMENT
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. ASSESSMENT SCOPE

This document answers the 10 mandatory verification questions from the EX.1 contract,
based on direct repo inspection of all adapter scripts, components, data structures,
and engine output artifacts.

---

## 2. MANDATORY VERIFICATION QUESTIONS

### Q1: What are the exact current runtime entry points into PiOS?

**Answer:** There are NO direct runtime entry points into PiOS v0.4 at `pios/core/v0.1/engine/`.

The runtime entry points are:
- `/api/execlens?query=GQ-NNN` → `scripts/pios/42.4/execlens_adapter.py` → 41.x artifacts
- `/api/execlens?overview=true` → `scripts/pios/42.6/execlens_overview_adapter.py` → 41.x artifacts
- `/api/execlens?topology=true` → `scripts/pios/42.7/execlens_topology_adapter.py` → 41.x/44.x artifacts
- `/api/execlens?status=true` → `scripts/pios/42.13/demo_activate.py` → **MISSING**
- `/api/execlens?enl=` → `scripts/pios/42.15/enl_console_adapter.py` → **MISSING**
- `/api/execlens?persona=` → `scripts/pios/42.16/persona_view_map.py` → **MISSING**

All existing (non-missing) adapters read from `docs/pios/41.x/` static artifacts via the
`42.1 → 42.2` module chain. None invoke the PiOS engine scripts.

---

### Q2: What data structures cross from PiOS-facing layers into runtime-facing layers?

**Answer:** None. No data structure from the PiOS v0.4 engine layer (40.x) crosses into the
runtime layer (42.x). What crosses is:

From 41.x → 42.x → frontend:
- Signal record: {signal_id, title, statement, evidence_confidence, domain_id, capability_id,
  component_ids, source_refs, trace_links, business_impact, risk} — L3 semantic signals
- Query record: {query_id, query_text, intent_type, aggregate_confidence, semantic_tags}
- Evidence record: {source_object_id, source_layer, source_file, supporting_objects, evidence_chain}
- Navigation record: {link, filename, resolved, path}
- Overview metric: {id, label, signal_id, value, unit, fill_pct, extraction_status}
- WOW record: {node_id, signal_id, signal_state, emphasis, emphasis_render_token}

From PiOS v0.4 engine (40.x) — DOES NOT CROSS:
- CE.4 signal emission state — ABSENT
- CE.5 consumption record — ABSENT
- CE.2 condition_coverage_state — ABSENT
- CE.2 diagnosis_activation_state — ABSENT
- CE.4 partiality_reasons — ABSENT
- CE.5 traceability records — ABSENT

---

### Q3: Where does runtime currently rely on direct governed outputs?

**Answer:** The runtime relies on NO direct governed outputs from the PiOS v0.4 engine.

The 41.4 signal_registry.json is a static pre-computed L3 artifact (run_reference: `run_01_blueedge`,
generated_date: 2026-03-20). It contains narrative signals with evidence_confidence labels
(STRONG/MODERATE/WEAK) — not CE.4 emission states.

The closest indirect reliance: the 42.6 overview adapter extracts numeric metric values from
signal statement text (e.g., "computed at 0.682"), which correspond to the same threshold values
as the PiOS engine binding rules. This is an indirect and text-extraction-based reliance, not
a direct governed output consumption.

---

### Q4: Where does runtime currently transform, flatten, enrich, rename, or reinterpret PiOS outputs?

**Answer:** The runtime does not transform PiOS engine outputs because it does not read them.

Within the 41.x → 42.x path, the following transformations occur:

- **42.6 adapter:** Extracts numeric values from signal statement text via regex
  (e.g., r"computed at (0\.\d+)"). This is text extraction from a narrative field, not
  transformation of a CE.4 output. Extraction failure returns explicit null. This is
  deterministic and auditable.

- **42.23 adapter:** Maps `emphasis` values {high, medium, low, none} to RENDER tokens
  {RENDER_RED, RENDER_AMBER, RENDER_NEUTRAL, RENDER_NONE} per the 51.1 rendering spec.
  The `signal_state: "computed"` in the 42.22 source is passed through — not transformed,
  but a non-governed value.

- **42.7 adapter:** Co-occurrence hierarchy computation from drill-down links. Deterministic,
  traceable, documented (G7 in contract). Reads only L3 navigation artifacts.

No enrichment, synthetic defaults, or semantic reinterpretation of CE.4/CE.5/CE.2
governed outputs exists — because those outputs are not read.

---

### Q5: Are any values shown in runtime not traceable back to governed PiOS output?

**Answer:** YES. Several values shown in runtime are NOT traceable to PiOS v0.4 engine outputs.

- `evidence_confidence` (STRONG/MODERATE/WEAK): from 41.4 signal_registry.json — L3 label,
  not a CE.4 field. No CE.4 provenance.

- `signal_state: "computed"` in 42.22 WOW records: outside CE.4 vocabulary — non-governed.

- Overview metric `fill_pct`: derived from regex extraction of narrative text, not from live
  engine output values.

- Topology hierarchy (domain/capability/component assignments): derived from co-occurrence
  computation over L3 template content — no CE.2/CE.4 provenance.

Values that ARE traceable (via L3 artifacts derived from L2, per the layer contract):
- Signal IDs (SIG-001..SIG-005 in 41.4, corresponding to CE.4 signal set)
- Statement text referencing engine-computed metrics (indirect — embedded in narrative strings)

---

### Q6: Are any values synthetic, fallback-derived, defaulted, inferred, or convenience-generated?

**Answer:** YES, one class of convenience values identified.

- **42.6 extraction failure → null:** When regex extraction fails, the adapter returns
  `value: null, extraction_status: "extraction_failed"`. This is a correct fail-open behavior
  (not a synthetic default). Compliant.

- **42.7 topology — "no domain co-occurrence" → entity omitted:** Entities with no co-occurrence
  data are simply omitted. This is correct (no synthetic placement). Compliant.

- **evidence_confidence:** This field's values (STRONG/MODERATE/WEAK) are assigned in the
  41.4 signal registry at the time of its generation. They are static L3 assessments, not live
  CE.4 outputs. These are pre-committed judgments embedded in a static artifact, not
  convenience-generated at runtime. However, they have no live PiOS provenance.

No runtime adapters generate synthetic values. The 42.4 adapter explicitly states: "missing
data → explicit null" (R3). The 42.6 adapter explicitly returns `extraction_status: "unavailable"`
on signal absence.

---

### Q7: Is traceability preserved end-to-end?

**Answer:** NO. CE.5 traceability is not preserved or exposed anywhere in the runtime.

The CE.10 validation run produced 8 CE.5 consumption records and 8 CE.5 traceability records
in `runs/pios/40.6/ce10_validation/condition_output.json`. None of these are read by, or
accessible from, the 42.x runtime layer.

The 42.x layer provides internal L3 traceability:
- Evidence chains traced from signal → evidence_mapping_index.json via 42.1 (R4, R5)
- Navigation links resolved via 42.1 bind_navigation() from pie_vault

This is L3 traceability (program intelligence artifact traceability), not CE.4/CE.5 governed
signal traceability. They are different chains.

---

### Q8: Is propagation state preserved where required?

**Answer:** NO. CE.2 propagation state is completely absent from the runtime.

`condition_coverage_state` (8 values: 6×STABLE, 2×BLOCKED) exists in the CE.10 validation
condition output but is not read or exposed by the runtime.

`diagnosis_activation_state` (8 values: 6×INACTIVE, 2×BLOCKED) exists in the CE.10 validation
condition output but is not read or exposed by the runtime.

---

### Q9: Is ledger/state exposure structurally possible now, even if not fully surfaced yet?

**Answer:** YES — structurally possible with targeted additions; not currently wired.

The CE.10 validation outputs exist in the repo (currently untracked):
- `runs/pios/40.5/ce10_validation/signal_output.json` — CE.4 states, outputs, traceability
- `runs/pios/40.6/ce10_validation/condition_output.json` — CE.5 records, conditions, diagnoses

A new adapter (EX.3 stream scope) could read these files and expose:
- CE.4 emission states per signal
- CE.5 consumption_state per signal
- CE.2 condition_coverage_state per condition
- CE.2 diagnosis_activation_state per diagnosis

No structural barrier prevents this. The CE.10 validation run data is in the expected format.
The API route could be extended with new query parameters routing to an EX.3-class adapter.

---

### Q10: What exact binding defects or conformity gaps currently exist?

**Answer:** 6 binding defects confirmed. Detailed in `binding_defect_register.md`.

| BIND ID | Class | Severity |
|---|---|---|
| BIND-001 | Runtime bypass of governed output | CRITICAL |
| BIND-002 | Semantic reinterpretation downstream | HIGH |
| BIND-003 | Traceability broken or dropped | CRITICAL |
| BIND-006 | Propagation/ledger state not preserved structurally | CRITICAL |
| BIND-007 | Adapter/binding contract incomplete | CRITICAL |
| BIND-008 | Verification absent or insufficient | HIGH |

---

## 3. CONFORMITY SCORES BY EXECUTION PRINCIPLE

### P1 — No Semantic Drift

**Score: PARTIAL**

- CE.4 signal state vocabulary: NOT used in runtime (not available — BIND-001)
- CE.5 consumption state vocabulary: NOT used in runtime (not available — BIND-003)
- CE.2 tier vocabulary: NOT used in runtime (not available — BIND-006)
- 42.22 `signal_state: "computed"`: USES non-governed vocabulary (BIND-002)
- 41.4 `evidence_confidence` {STRONG, MODERATE, WEAK}: L3 vocabulary — not a CE.4 synonym

The existing adapters do not reinterpret CE.4/CE.5 values because they don't read them.
The BIND-002 vocabulary issue is in source data, not adapter logic.

### P2 — No Implicit Logic

**Score: PASS (within L3 scope)**

All adapter logic is explicit and traceable:
- 42.6 extraction rules are documented inline
- 42.7 co-occurrence hierarchy is documented (G7 in contract)
- 42.23 rendering map is a closed set with fail-closed on unknown values
- 42.4 follows strict R1..R6 rules

No implicit logic found in the L3 adapter chain.

### P3 — Full Traceability

**Score: FAIL**

CE.4/CE.5 traceability chain (signal → consumption → propagation → diagnosis) is not
preserved or accessible in the runtime. See Q7/Q8.

### P4 — No Partial Compliance

**Score: FAIL**

The runtime is not CE.4/CE.5/CE.2 compliant at any layer. No compliance claim is made by
the runtime itself, but compliance is also not verified (BIND-008). The runtime operates
at L3 semantic layer; CE.4/CE.5 compliance is an L2 property not surfaced to L3.

---

## 4. OVERALL CONFORMITY VERDICT

**Conformity status: PARTIAL — L3 runtime is internally consistent but not bound to L2 PiOS governed outputs.**

The L3 adapter chain (41.x → 42.x) is internally correct:
- No synthetic data
- Explicit, deterministic rules
- Fail-closed on errors
- No implicit logic

The binding gap is architectural: L3 does not read L2 governed outputs.
This is a BIND-001/003/006 structural defect requiring EX.3 bridge scope to close.

The missing adapters (BIND-007) are hard failures on three API paths.
