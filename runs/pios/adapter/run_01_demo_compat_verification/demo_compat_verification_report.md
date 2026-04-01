# Demo Compatibility Verification Report

**run_id:** run_01_demo_compat_verification
**date:** 2026-04-01
**branch:** feature/demo-compat-adapter
**adapter:** pios/core/v0.1/adapters/demo_compat/map_core_to_demo.py
**contract:** pios/core/v0.1/adapters/demo_compat/contract.yaml
**golden_demo_basis:** docs/pios/41.4/signal_registry.json + docs/pios/41.4/evidence_mapping_index.json

---

## Verification Rule

This report verifies that the DEMO_COMPAT adapter (map_core_to_demo.py) preserves Golden Demo
behavior from validated Core outputs, without modifying Core engine scripts, demo assets, or
validated run artifacts.

All 7 verification checks must pass for final status to be PASS.

---

## V1 — Signal Set Verification

Verify adapter emits exactly the demo-facing signal set declared in 41.4 signal_registry.json.

| Sub-check | Result |
|---|---|
| Registry signal count = 5 | PASS |
| Adapter output signal count = 5 | PASS |
| Registry IDs = [SIG-001, SIG-002, SIG-003, SIG-004, SIG-005] | PASS |
| Adapter IDs = [SIG-001, SIG-002, SIG-003, SIG-004, SIG-005] | PASS |
| No missing signal | PASS |
| No extra signal | PASS |
| Output order = canonical DEMO_SIGNAL_ORDER | PASS |

**V1 Result: PASS — 5/5 expected signals present, no missing, no extra**

---

## V2 — Value Invariance Verification

Verify all demo-facing registry fields are carried verbatim from 41.4 signal_registry.json.
Fields checked: title, statement, domain_id, domain_name, capability_id, capability_name,
component_ids, component_names, evidence_confidence, business_impact, risk.

| Signal | Fields Checked | Mismatches |
|---|---|---|
| SIG-001 | 11 | 0 |
| SIG-002 | 11 | 0 |
| SIG-003 | 11 | 0 |
| SIG-004 | 11 | 0 |
| SIG-005 | 11 | 0 |

**Value drift detected: NONE**

**V2 Result: PASS — 55/55 registry field comparisons match verbatim**

---

## V3 — Status / Relevance Verification

Verify synthesis_state propagates correctly from Core INTEL. Verify relevance derived per A6.

| Demo Signal | Core INTEL | Core synthesis_state | Expected adapter state | Adapter state | Expected relevance | Adapter relevance | Correct |
|---|---|---|---|---|---|---|---|
| SIG-001 | INTEL-006 | blocked | blocked | blocked | LOW | LOW | YES |
| SIG-002 | aggregate (A9) | synthesized* | synthesized | synthesized | HIGH | HIGH | YES |
| SIG-003 | INTEL-001 | synthesized | synthesized | synthesized | HIGH | HIGH | YES |
| SIG-004 | INTEL-002 | synthesized | synthesized | synthesized | HIGH | HIGH | YES |
| SIG-005 | INTEL-003 | partial | partial | partial | MEDIUM | MEDIUM | YES |

*SIG-002: Core engine has INTEL-005 (blocked), INTEL-006 (blocked) → A9 rule: blocked INTELs
exist → unknown_space declaration is fully synthesized. synthesis_state=synthesized. ✓

**V3 Result: PASS — 5/5 signals correctly propagate state; relevance derivation matches A6**

---

## V4 — Evidence Visibility Verification

Verify all evidence fields required by demo UI remain present and correctly sourced from
41.4 evidence_mapping_index.json.

Fields checked per signal: source_object_id, source_layer, source_file, evidence_chain,
blocking_point, temporal_reference, supporting_objects.

| Signal | Evidence fields checked | Mismatches | evidence_warning |
|---|---|---|---|
| SIG-001 | 7 | 0 | null |
| SIG-002 | 7 | 0 | null |
| SIG-003 | 7 | 0 | null |
| SIG-004 | 7 | 0 | null |
| SIG-005 | 7 | 0 | null |

**Evidence chains present and non-empty:**
- SIG-001: "40.5 SIG-006 (complete: DIM-PC-002/DIM-PC-001 = 10/30 = 0.333 rec/sec) → ..." ✓
- SIG-002: "40.5 SIG-001..005, SIG-007..008 (all pending: runtime telemetry unavailable) → ..." ✓
- SIG-003: "40.4 ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 (structural telemetry, static) → ..." ✓
- SIG-004: "40.4 ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 (structural telemetry, static) → ..." ✓
- SIG-005: "40.4 ST-016, ST-012 (structural telemetry, static: 7/8 shared interfaces) + AT-005, AT-007 ..." ✓

**Supporting objects counts:** SIG-001=3, SIG-002=7, SIG-003=2, SIG-004=2, SIG-005=2 — all match 41.4 index.

**V4 Result: PASS — 35/35 evidence field comparisons match; all evidence chains present**

---

## V5 — Namespace Conflict Containment Verification

The adapter contract declares a namespace conflict: 41.4 evidence_mapping_index records
`source_object_id: "INTEL-001"` for Demo SIG-001, but the Core engine v0.1 INTEL-001 refers
to Dependency Load Elevation — not the hasi_bridge signal. The correct Core engine identifier
for hasi_bridge is INTEL-006.

Verify the conflict is resolved only through documented COND cross-reference and does not
leak into demo-facing interpretation.

| Sub-check | Result |
|---|---|
| SIG-001 evidence.source_object_id = "INTEL-001" (41.4 namespace, verbatim) | PASS |
| SIG-001 core_intel_id = "INTEL-006" (Core engine namespace, traceability) | PASS |
| "INTEL-006" not present in SIG-001 demo-facing evidence fields | PASS |
| "INTEL-001" not interpreted as Core engine INTEL-001 anywhere in demo output | PASS |
| COND-006 cross-reference documented in contract.yaml | PASS |
| No ambiguous or conflicting INTEL identifier in demo signal payload | PASS |

**V5 Result: PASS — namespace conflict contained; no leakage into demo-facing interpretation**

---

## V6 — No-Drift Contract Verification

Verify adapter output is backward-compatible with current Golden Demo expectation surface.

| Sub-check | Result |
|---|---|
| All 15 required demo-facing fields present for all 5 signals | PASS |
| No demo-facing field removal relative to 42.4 adapter output schema | PASS |
| No demo-facing field relabeling | PASS |
| synthesis_state declared as governed extension field in contract.yaml | PASS |
| core_intel_id declared as governed traceability extension in contract.yaml | PASS |
| No unauthorized new field in demo_compat_output.json | PASS |

Required demo-facing fields verified: signal_id, relevance, title, evidence_confidence,
domain_id, domain_name, capability_id, capability_name, component_ids, component_names,
statement, business_impact, risk, evidence (with sub-fields), evidence_warning.

Extension fields (governed by contract.yaml): synthesis_state, core_intel_id.
These are additive and do not replace or rename any field expected by the demo UI.

**V6 Result: PASS — no backward-incompatible contract drift; all required fields present**

---

## V7 — Determinism Verification

Verify repeated execution on identical inputs produces identical output ordering and values.

| Sub-check | Result |
|---|---|
| DEMO_SIGNAL_ORDER is a fixed Python constant | PASS |
| Output order matches DEMO_SIGNAL_ORDER | PASS |
| No random seed or random call in adapter | PASS |
| No ISO datetime or timestamp value in output payload | PASS (verified: 0 regex matches) |
| All field values derived from static mappings or registry lookups | PASS |
| load_signal_registry() and load_evidence_index() produce deterministic dicts | PASS |

**V7 Result: PASS — output is fully deterministic; no randomization, no timestamp drift**

---

## Boundary / Scope Verification

| Check | Result |
|---|---|
| No write to docs/ | PASS |
| No write to app/execlens-demo/ | PASS |
| No write to pios/core/v0.1/engine/ | PASS |
| No write to pios/core/v0.1/adapters/demo_compat/ (adapter source) | PASS |
| No write to runs/pios/40.5/run_02_ce_validation/ | PASS |
| No write to runs/pios/40.6/run_01_condition_activation/ | PASS |
| No write to runs/pios/40.7/run_01_intelligence_synthesis/ | PASS |
| No tracked git dirty state | PASS |
| All verification writes under runs/pios/adapter/run_01_demo_compat_verification/ | PASS |

---

## Verification Summary

| Check | Result |
|---|---|
| V1 — Signal Set | PASS |
| V2 — Value Invariance | PASS |
| V3 — Status / Relevance | PASS |
| V4 — Evidence Visibility | PASS |
| V5 — Namespace Conflict Containment | PASS |
| V6 — No-Drift Contract | PASS |
| V7 — Determinism | PASS |

**Final Verification Status: PASS — all 7 checks pass**

---

## Governance Note

The adapter preserves Golden Demo behavior from validated Core outputs. All 41.4 signal registry
fields are carried verbatim. All 41.4 evidence mapping fields are carried verbatim. Synthesis
state is derived from Core engine output exactly (no elevation). Relevance is derived per
contract rule A6 (no override). The declared namespace conflict (41.4 evidence_mapping_index
INTEL numbering vs Core engine v0.1 INTEL numbering) is contained by the COND cross-reference
mechanism documented in the adapter contract and does not leak into demo-facing output.

No values fabricated. No fields synthesized. No demo semantics reinterpreted.
