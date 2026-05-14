# Enrichment Boundary Consolidation

Stream: PI.PSEE-PIOS.ENRICHMENT-BOUNDARY-CONSOLIDATION.01  
Status: COMPLETE  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Advances Lane D target: YES — resolves terminology ambiguity blocking Step C  

Authoritative inputs:
- BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md (da3f1cb)
- BINDING_ENVELOPE_ENRICHMENT_METADATA.md (af18159)
- PSEE_HANDOFF_ADAPTER_DESIGN.md (e8dc76e)
- CONSOLIDATION_RESTART_PLAN.md (5c4786e)
- psee_enrichment_schema.json (af18159)
- `scripts/pios/psee_handoff/add_psee_enrichment_stubs.py` (af18159)

---

## 1. Purpose

Since the PSEE–PiOS integration stream chain began, five separate contracts and one implementation have each introduced enrichment-adjacent terminology from their own scope. Taken together, these documents now contain overlapping terms — "sidecar," "adapter," "enriched envelope," "enrichment metadata," "handoff" — that refer to different objects in some documents and the same objects in others.

This document resolves that overlap. It produces a single authoritative object model, a canonical terminology table, a precise map of what is implemented versus planned, and a clear next step.

No implementation. No artifact mutation. No schema changes.

---

## 2. Enrichment Terminology Inventory

All enrichment-adjacent terms found across the six authoritative inputs, with source and current meaning.

| Term | Source Document(s) | Intended Meaning | Implementation Status |
|------|--------------------|-----------------|----------------------|
| sidecar | PSEE_HANDOFF_ADAPTER_DESIGN.md, CONSOLIDATION_RESTART_PLAN.md | `artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json` — compact extraction artifact with ST-030..035 for 75.x consumption | NOT IMPLEMENTED — builder script not yet written |
| PSEE handoff sidecar | PSEE_HANDOFF_ADAPTER_DESIGN.md | Same as "sidecar" above | NOT IMPLEMENTED |
| adapter | PSEE_HANDOFF_ADAPTER_DESIGN.md (design title); CONSOLIDATION_RESTART_PLAN.md | The entire PSEE enrichment subsystem in design-era language; in CONSOLIDATION_RESTART_PLAN.md narrowed to refer to the corrected sidecar builder | DESIGN COMPLETE (e8dc76e); implementation not started |
| adapter script | PSEE_HANDOFF_ADAPTER_DESIGN.md (Section 10) | `build_psee_handoff_sidecar.py` — the script that produces psee_40_5_input.json | NOT YET CREATED (planned path: `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py`) |
| handoff | PSEE_HANDOFF_ADAPTER_DESIGN.md; CONSOLIDATION_RESTART_PLAN.md; NAMESPACE_DEBT_MAPPING.md | The PSEE→PiOS boundary transfer process. NOT an artifact name. | N/A — process concept |
| handoff_mode | PSEE_HANDOFF_ADAPTER_DESIGN.md (Section 5) | Field inside `psee_40_5_input.json`: `PSEE_HANDOFF` \| `GENERIC_HANDOFF` | Part of sidecar schema (not yet produced) |
| enrichment | BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md; BINDING_ENVELOPE_ENRICHMENT_METADATA.md; psee_enrichment_schema.json | The process of adding PSEE-specific fields to `binding_envelope.json` additively | SCHEMA DEFINED; stubs produced; no runtime consumer |
| enrichment stubs | BINDING_ENVELOPE_ENRICHMENT_METADATA.md; add_psee_enrichment_stubs.py | The 5 placeholder key values added to `psee_binding_envelope.json` by `add_psee_enrichment_stubs.py` | IMPLEMENTED — `psee_binding_envelope.json` produced |
| enriched envelope | BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md (Section 6); BINDING_ENVELOPE_ENRICHMENT_METADATA.md | `binding/psee_binding_envelope.json` — full binding_envelope PLUS 5 PSEE stub keys; produced by `add_psee_enrichment_stubs.py` | IMPLEMENTED — artifact produced; NOT consumed by any runtime script |
| psee_binding_envelope | BINDING_ENVELOPE_ENRICHMENT_METADATA.md; add_psee_enrichment_stubs.py | Same as "enriched envelope" above | IMPLEMENTED |
| enrichment metadata | BINDING_ENVELOPE_ENRICHMENT_METADATA.md (stream title); psee_enrichment_schema.json | The PSEE-specific key-value stubs defined in psee_enrichment_schema.json that appear in psee_binding_envelope.json | SCHEMA: COMPLETE; RUNTIME CONSUMPTION: NONE |
| reserved PSEE enrichment zone | BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md (Section 6) | The 5 top-level key names reserved in binding_envelope for future PSEE fields: `psee_context`, `ceu_topology`, `structural_overlap`, `selector_context`, `evidence_state` | RESERVED (defined, schema exists); not in active binding_envelope.json |
| enrichment schema | psee_enrichment_schema.json | The JSON schema document at `docs/governance/psee_enrichment_schema.json` defining the 5 reserved keys | IMPLEMENTED |
| pre-75.x enrichment step | CONSOLIDATION_RESTART_PLAN.md (Section 2) | An execution step that runs before `compute_condition_correlation.py` and reads the sidecar; equivalent to "sidecar consumer" | NOT IMPLEMENTED — Step E, blocked by BP-01 |
| sidecar consumer | CONSOLIDATION_RESTART_PLAN.md (Section 2) | `compute_condition_correlation.py` extended with optional sidecar read path | NOT IMPLEMENTED — Step E, blocked by BP-01 |
| stub injector | BINDING_ENVELOPE_ENRICHMENT_METADATA.md | `add_psee_enrichment_stubs.py` — the script that produces psee_binding_envelope.json | IMPLEMENTED |

---

## 3. Duplicate Concept Analysis

### Analysis 3.1 — Is `psee_binding_envelope.json` already the sidecar?

**Finding: NO. These are architecturally distinct objects.**

| Property | `psee_binding_envelope.json` (enriched envelope) | `psee_40_5_input.json` (sidecar) |
|----------|--------------------------------------------------|----------------------------------|
| Format | Full binding_envelope topology + PSEE stubs | Compact extraction artifact; no topology graph |
| Content | All nodes, edges, capability_surfaces + 5 stub keys | ST-030..035 values, eligibility flags, mode |
| Output path | `binding/psee_binding_envelope.json` | `artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json` |
| Intended consumer | Future 75.x (optional replacement input OR enriched read path) | 75.x sidecar reader (`compute_condition_correlation.py` extended) |
| Current consumer | NONE — 75.x reads `binding_envelope.json`, not this file | NONE — sidecar reader not yet implemented |
| Producer | `add_psee_enrichment_stubs.py` (IMPLEMENTED) | `build_psee_handoff_sidecar.py` (NOT YET IMPLEMENTED) |
| Implementation state | IMPLEMENTED | NOT IMPLEMENTED |
| Runtime active | NO | NO |

These objects serve different future paths. The enriched envelope is the "enriched topology input" path. The sidecar is the "supplementary ST extraction" path. A future Step E contract must explicitly choose which path it uses; both remain defined but unused.

### Analysis 3.2 — Is the "adapter" concept already partially implemented?

**Finding: PARTIALLY, but through a different artifact than the adapter design intended.**

The adapter design (e8dc76e) planned: `build_psee_handoff_sidecar.py` → `psee_40_5_input.json`.  
What was implemented (af18159): `add_psee_enrichment_stubs.py` → `psee_binding_envelope.json`.

These are different scripts producing different outputs. `add_psee_enrichment_stubs.py` is NOT a partial implementation of `build_psee_handoff_sidecar.py`. It is a separate, complete artifact that serves the enrichment namespace purpose described in the binding envelope consumption contract.

`build_psee_handoff_sidecar.py` still needs to be implemented as a separate, new script.

### Analysis 3.3 — Is "handoff" now equivalent to enriched envelope generation?

**Finding: NO. "Handoff" is a process concept, not an artifact name.**

"Handoff" refers to the PSEE→PiOS boundary transfer process — the process by which PSEE topology data becomes available for PiOS signal computation. This process has multiple physical implementations:
- The enriched envelope (`psee_binding_envelope.json`) is one artifact in the handoff preparation chain
- The sidecar (`psee_40_5_input.json`) is the operational handoff artifact
- `add_psee_enrichment_stubs.py` performs enrichment preparation
- `build_psee_handoff_sidecar.py` performs the actual handoff extraction

"Handoff" must not be used as an artifact name. Use the specific artifact name (`psee_40_5_input.json`, `psee_binding_envelope.json`) in all future contracts.

### Analysis 3.4 — Which concepts are still future-only?

| Concept | Status |
|---------|--------|
| `psee_40_5_input.json` sidecar | FUTURE — builder not implemented |
| `build_psee_handoff_sidecar.py` | FUTURE — not yet created |
| ST-030..035 value extraction | FUTURE — depends on sidecar builder |
| Extended `compute_condition_correlation.py` with sidecar read path | FUTURE — Step E, blocked by BP-01 |
| PSIG derivation from sidecar | FUTURE — blocked by BP-01 |
| Lane D PSIG activation | FUTURE — blocked by BP-01 |

---

## 4. Canonical Boundary Object Model

Five canonical objects govern the PSEE–PiOS enrichment boundary. Each is a distinct architectural role with no overlap.

---

**Object A — ACTIVE_RUNTIME_ENVELOPE**

| Property | Value |
|----------|-------|
| Canonical artifact | `binding/binding_envelope.json` |
| Purpose | Structural topology input for 75.x condition activation |
| Owner layer | Lane A — active runtime boundary |
| Runtime status | ACTIVE — consumed by 3 Lane A scripts |
| Consumer scripts | `compute_condition_correlation.py`, `compute_pressure_candidates.py`, `compute_signal_projection.py` |
| Implementation state | COMPLETE — unchanged from productized baseline (93098cb) |
| Protection | Consumption contract (da3f1cb); Section 3.1 REQUIRED fields locked |

---

**Object B — ENRICHMENT_PREPARATION_ARTIFACT**

| Property | Value |
|----------|-------|
| Canonical artifact | `binding/psee_binding_envelope.json` |
| Purpose | Governance preparation artifact establishing PSEE enrichment namespace in the binding envelope format; contains full topology + 5 PSEE stub keys |
| Owner layer | Lane D preparation — not yet a runtime object |
| Runtime status | NOT CONSUMED — 75.x ignores PSEE stub keys (Guarantee G-02) |
| Consumer scripts | None currently; potential future: enriched 75.x execution path |
| Producer | `scripts/pios/psee_handoff/add_psee_enrichment_stubs.py` |
| Implementation state | PRODUCED — file generated; no runtime consumer exists |
| Schema reference | `docs/governance/psee_enrichment_schema.json` |

---

**Object C — ENRICHMENT_SCHEMA**

| Property | Value |
|----------|-------|
| Canonical artifact | `docs/governance/psee_enrichment_schema.json` |
| Purpose | Authoritative schema defining the 5 reserved PSEE enrichment keys and their field-level contracts |
| Owner layer | Governance — cross-lane reference document |
| Runtime status | NOT a runtime artifact — governance reference only |
| Consumer | All future Lane D enrichment implementation contracts |
| Implementation state | COMPLETE |

---

**Object D — OPERATIONAL_SIDECAR**

| Property | Value |
|----------|-------|
| Canonical artifact | `artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json` |
| Purpose | Compact extraction artifact containing ST-030..035 values and eligibility flags for 75.x optional supplementary consumption |
| Owner layer | Lane D — PSEE handoff extraction |
| Runtime status | NOT YET PRODUCED — builder not implemented |
| Consumer (planned) | Extended `compute_condition_correlation.py` (Step E) |
| Producer (planned) | `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py` |
| Implementation state | DESIGN COMPLETE (e8dc76e, corrected by 5c4786e); BUILDER NOT IMPLEMENTED |
| Schema | PSEE_HANDOFF_ADAPTER_DESIGN.md Section 5 |
| Blocking | Step C implementation; Step E blocked by BP-01 |

---

**Object E — FUTURE_CONDITION_ACTIVATION_EXTENSION**

| Property | Value |
|----------|-------|
| Canonical artifact | `scripts/pios/75x/compute_condition_correlation.py` (extended, not yet modified) |
| Purpose | Optional sidecar read path within 75.x that consumes Object D when present and READY, enabling PSEE-specific PSIG derivation alongside generic DPSIG derivation |
| Owner layer | Lane A (extension) — additive code path only |
| Runtime status | NOT YET IMPLEMENTED |
| Consumer (when active) | Sidecar (Object D) |
| Implementation state | STEP E — blocked by BP-01 + requires Step C complete |
| Blocking | BP-01: `psig_computation.json` authorization not issued |

---

## 5. Consolidated Terminology Rules

The following table defines canonical terms for all future contracts. Deprecated terms must not appear in new stream contracts or implementation documents.

### Canonical Terms

| Canonical Term | Definition | Artifact Reference |
|---------------|-----------|-------------------|
| **sidecar** | ONLY `psee_40_5_input.json` — the compact ST-030..035 extraction artifact produced by the sidecar builder | Object D |
| **sidecar builder** | ONLY `build_psee_handoff_sidecar.py` — the script that produces the sidecar | Object D producer |
| **enriched envelope** | ONLY `psee_binding_envelope.json` — the full binding_envelope with PSEE stub keys; a governance preparation artifact | Object B |
| **enrichment schema** | ONLY `docs/governance/psee_enrichment_schema.json` — the schema defining the 5 reserved enrichment keys | Object C |
| **stub injector** | ONLY `add_psee_enrichment_stubs.py` — the script that produces the enriched envelope | Object B producer |
| **condition activation extension** | The future optional sidecar read path in `compute_condition_correlation.py` (Step E) | Object E |
| **enrichment preparation** | The set of governance artifacts establishing the PSEE enrichment namespace (Objects B + C together) | Objects B + C |
| **handoff** | The PSEE→PiOS boundary transfer PROCESS — not an artifact name | Process concept |
| **handoff_mode** | The field inside `psee_40_5_input.json`: `PSEE_HANDOFF` \| `GENERIC_HANDOFF` | Object D field |

### Deprecated Terms

| Deprecated Term | Reason | Replacement |
|----------------|--------|-------------|
| **adapter** (as artifact name) | Design-era umbrella term; ambiguous across documents; maps to multiple objects | Use "sidecar builder" (script) or "sidecar" (artifact) |
| **PSEE handoff sidecar** (full phrase) | Redundant — "sidecar" alone is sufficient after this consolidation | "sidecar" |
| **pre-75.x enrichment step** | Ambiguous — could mean Object B producer, Object D builder, or Object E | Use "sidecar builder" (build step) or "condition activation extension" (runtime step) |
| **enrichment** alone (as artifact reference) | Refers to a process, not a specific artifact | Use "enriched envelope," "enrichment schema," or "sidecar" per the specific object |

### Collision Rules

1. "sidecar" and "enriched envelope" MUST NOT be used interchangeably. They are different objects (see Section 3.1).
2. "adapter" MUST NOT appear in future contracts as an artifact name.
3. "handoff" MUST NOT be used as an artifact name in any future contract.
4. Object B (enriched envelope) and Object D (sidecar) MUST NOT be merged into a single implementation — their consumers, formats, and purposes are distinct.

---

## 6. Remaining Implementation Gap

After consolidation, the following items are truly missing from the implementation chain.

### Already Implemented (no further work needed)

| Item | Artifact | Status |
|------|----------|--------|
| Enrichment preparation | `add_psee_enrichment_stubs.py` + `psee_binding_envelope.json` | COMPLETE |
| Enrichment schema | `docs/governance/psee_enrichment_schema.json` | COMPLETE |
| Namespace alias registry | `docs/governance/signal_namespace_alias_registry.json` | COMPLETE |
| Binding envelope consumption contract | BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md | COMPLETE |
| Namespace debt mapping | NAMESPACE_DEBT_MAPPING.md | COMPLETE |
| Lane governance lock | LANE_GOVERNANCE_LOCK.md | COMPLETE |
| Consolidation restart plan | CONSOLIDATION_RESTART_PLAN.md | COMPLETE |
| PSEE handoff adapter design | PSEE_HANDOFF_ADAPTER_DESIGN.md (corrected by restart plan) | DESIGN COMPLETE |

### Governance-Only (no runtime implementation)

| Item | Artifact | Gap |
|------|----------|-----|
| Condition activation gate design | None yet — handoff target of this stream | NEEDS PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01 |

### Future Runtime (not yet implemented)

| Item | Missing Artifact | Blocking Conditions |
|------|----------------|---------------------|
| **Step C — Sidecar Builder** | `build_psee_handoff_sidecar.py` + `psee_40_5_input.json` | UNBLOCKED — Step B (binding contract) now complete; can proceed |
| **Step E — Condition Activation Extension** | Extended `compute_condition_correlation.py` | BLOCKED: BP-01 (psig_computation.json not issued) |
| BP-01 resolution | `psig_computation.json` authorization contract (40x.04) | Governance decision — not a code gap |

### Key Finding: BP-02 Is Resolved

The productized baseline run (`run_02_oss_fastapi_pipeline`) has `canonical_topology.cluster_count = 19`. BP-02 (`cluster_count > 0`) is met for this run. Only BP-01 now blocks Lane D PSIG derivation (Step E).

---

## 7. Safe Next Implementation Step

**Contract:** PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01 (handoff target of this stream)

**Rationale:** Before implementing the sidecar builder (Step C), the condition activation gate design must establish how `compute_condition_correlation.py` will safely consume the sidecar. This prevents implementing Step C against an undefined consumer interface, which was the original error that caused the restart plan (the prior adapter design targeted Lane B, not Lane A, because the Lane A consumer interface was never formally specified).

**What the gate design must define:**
1. Exactly where in `compute_condition_correlation.py` the sidecar is checked for
2. The sidecar path resolution logic (from `--run-dir` argument)
3. The opt-in condition: sidecar present AND `readiness = READY` AND `handoff_mode = PSEE_HANDOFF`
4. The fail-open rule: if sidecar absent or NOT_READY, execution proceeds on generic path without error
5. Which sidecar fields trigger which additional computation branches (ST-030/031/032/033/034/035 → PSIG)
6. That no existing DPSIG computation paths are altered

**Why before Step C (sidecar builder):**  
Step C builds the sidecar to satisfy its consumer. Without a formal consumer interface (the gate design), Step C cannot guarantee compatibility. Implementing the gate design first means Step C has a target specification to satisfy.

**Why not implement Step C now:**  
Step C implementation is unblocked. But implementing a producer without a defined consumer interface repeats the exact error in the original adapter design (e8dc76e targeted Lane B because the active consumer was not specified). The gate design closes this gap permanently.

---

## 8. Validation

PASS criteria:

- [x] All enrichment terms inventoried from all six authoritative inputs (Section 2 — 16 terms, each with source, meaning, and status)
- [x] Duplicate concept analysis completed — `psee_binding_envelope.json` proven NOT to be `psee_40_5_input.json`; "adapter" proven NOT partially implemented by stub injector (Section 3)
- [x] Five canonical boundary objects defined with distinct roles, artifacts, owner layers, and implementation states (Section 4)
- [x] Canonical terminology table produced with replacement rules and collision constraints (Section 5)
- [x] Deprecated terms explicitly listed with replacements (Section 5)
- [x] Implementation gap separated into: already implemented, governance-only, future runtime (Section 6)
- [x] BP-02 resolution finding documented (Section 6 — cluster_count=19 confirmed)
- [x] Safe next step identified — gate design before sidecar builder to prevent consumer mismatch (Section 7)
- [x] No implementation performed
- [x] No scripts modified
- [x] No schema changed
- [x] No artifact deleted or renamed
- [x] Multiple competing sidecar concepts resolved (Section 3.1 — two objects confirmed distinct)
- [x] Active vs future runtime objects separated (Section 4 — Objects A/B/C implemented; D/E future)
- [x] Artifact ownership unambiguous (Section 4 — each object has one canonical artifact and one owner layer)

Status: PASS
