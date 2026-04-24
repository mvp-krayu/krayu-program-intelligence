# STEP 12 — LENS Surface Activation Contract (Structural Tier-2)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 12
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — LENS Tier-2 activation contract defined. 13 claims active. 1 claim gated (CLM-25, GAP-01). 1 claim pre-activation flagged (CLM-19, DQGAP-01). Signal layer not activated.

---

## Runtime Inputs

| Input | Value |
|-------|-------|
| `client_id` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `run_id` | `run_01_oss_fastapi` |
| `fragment_base` | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/` |
| `zone` | `ZONE-2` (LENS-only; ZONE-1 is operator-only) |
| `depth` | `L1` |

---

## Fragment Loading Contract

### Path Pattern

```
{fragment_base}/{claim_id}-ZONE-2-L1.json
```

Resolved example:
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/CLM-09-ZONE-2-L1.json
```

### Naming Convention

```
{CLM_ID}-{ZONE}-{DEPTH}.json
```

- `CLM_ID`: uppercase, hyphenated (e.g., `CLM-09`)
- `ZONE`: always `ZONE-2` for LENS consumption
- `DEPTH`: always `L1` for Tier-2 surface

### Zone Selection Logic

1. LENS MUST load `ZONE-2` files only.
2. `ZONE-1` files are available in the same directory but are operator-grade — they contain `source_field` and `transformation_summary` which are internal derivation fields forbidden from LENS surfaces.
3. Zone selection is implicit in the filename. The loader MUST NOT load `ZONE-1` files.
4. Verify at load time: `fragment["zone"] == "ZONE-2"` and `fragment["run_id"] == "run_01_oss_fastapi"`. Any mismatch is a FAIL-STOP.

### Fragment Fields Available for LENS Rendering

| Field | Type | Use |
|-------|------|-----|
| `claim_id` | string | Internal reference only — MUST NOT be rendered in client-facing output |
| `claim_label` | string | Display label (short form) |
| `evidence_class` | enum | `VERIFIED` / `CONDITIONAL` — drives confidence badge |
| `value.narrative` | string | Primary rendered value |
| `value.unit` | string (optional) | Unit qualifier (e.g., "out of 100") |
| `explanation` | string | Expanded explanation for detail-expand surface |
| `caveats[]` | array | Must be rendered if non-empty — not suppressible |
| `trace_available` | bool | Enables "trace" affordance (L2/L3 drill) |
| `trace_depth_available[]` | array | Available trace depths |

**Forbidden from LENS rendering:** `source_field`, `transformation_summary`, `projection_id`, `run_id`, `generated_at`, `persona`.

---

## LENS Component Mapping

### Component 1 — SCORE STRIP

Rendering slot: top-of-page primary strip. All four claims rendered together.

| Slot | Claim ID | Fragment file | evidence_class | value.narrative |
|------|----------|---------------|----------------|-----------------|
| score | CLM-09 | CLM-09-ZONE-2-L1.json | VERIFIED | "Proven: 60/100" |
| coverage | CLM-10 | CLM-10-ZONE-2-L1.json | VERIFIED | "Achievable: 100/100" |
| reconstruction | CLM-11 | CLM-11-ZONE-2-L1.json | VERIFIED | "Floor established, ceiling defined" |
| completion | CLM-12 | CLM-12-ZONE-2-L1.json | VERIFIED | "[60, 100]" |

**Activation state:** ACTIVE — all four claims VERIFIED, no caveats.

### Component 2 — VERDICT PANEL

Rendering slot: execution and structural verdict summary.

| Slot | Claim ID | Fragment file | evidence_class | value.narrative |
|------|----------|---------------|----------------|-----------------|
| verdict | CLM-13 | CLM-13-ZONE-2-L1.json | VERIFIED | "Runtime execution assessment is pending" |
| band | CLM-14 | CLM-14-ZONE-2-L1.json | VERIFIED | "5 functional areas" |
| risk_posture | CLM-15 | CLM-15-ZONE-2-L1.json | VERIFIED | "30 capability surfaces" |

**Activation state:** ACTIVE — all three claims VERIFIED, no caveats.

### Component 3 — STRUCTURAL VIEW

Rendering slot: topology and structural detail panel.

| Slot | Claim ID | Fragment file | evidence_class | value.narrative |
|------|----------|---------------|----------------|-----------------|
| topology_summary | CLM-16 | CLM-16-ZONE-2-L1.json | VERIFIED | "10 components mapped" |
| domain_distribution | CLM-17 | CLM-17-ZONE-2-L1.json | VERIFIED | "1 cross-domain overlaps" |
| interdependency | CLM-18 | CLM-18-ZONE-2-L1.json | VERIFIED | "0" |
| structural_condition | CLM-19 | CLM-19-ZONE-2-L1.json | VERIFIED | ⚠ DQGAP-01 (see below) |

**Activation state:** PARTIAL — CLM-16, CLM-17, CLM-18 ACTIVE. CLM-19 BLOCKED pending DQGAP-01 resolution.

### Component 4 — CONTEXT / BASELINE

Rendering slot: foundational evidence and system-level context.

| Slot | Claim ID | Fragment file | evidence_class | value.narrative |
|------|----------|---------------|----------------|-----------------|
| system_identity | CLM-01 | CLM-01-ZONE-2-L1.json | VERIFIED | "100.0% — all structural evidence present" |
| scope_definition | CLM-03 | CLM-03-ZONE-2-L1.json | VERIFIED | "Structural consistency confirmed" |
| execution_context | CLM-27 | CLM-27-ZONE-2-L1.json | VERIFIED | "45 total nodes" |

**Activation state:** ACTIVE — all three claims VERIFIED, no caveats.

### Component 5 — GATED SLOT (CLM-25)

Rendering slot: executive three-axis verdict panel.

| Slot | Claim ID | Fragment file | evidence_class | Activation state |
|------|----------|---------------|----------------|-----------------|
| executive_verdict | CLM-25 | CLM-25-ZONE-2-L1.json | CONDITIONAL | **GATED — GAP-01** |

**Gating behavior:**
- CLM-25 fragment EXISTS and is structurally valid (BC-01 caveat applied, narrative sanitized).
- LENS surface activation is BLOCKED until GAP-01 (CONCEPT-06 predicate mismatch) is resolved.
- Until activation, the slot MUST render placeholder: `"Conceptual coherence not yet evaluated"`.
- The CLM-25 fragment MUST NOT be loaded or rendered in the GATED state.
- No partial or conditional rendering of CLM-25 content is permitted.

---

## Activated Claims

**13 claims ACTIVE (surface-ready):**

| Claim ID | Label | Component | evidence_class |
|----------|-------|-----------|----------------|
| CLM-09 | Proven Structural Score | SCORE STRIP | VERIFIED |
| CLM-10 | Achievable Score Projected | SCORE STRIP | VERIFIED |
| CLM-11 | Score Band Classification | SCORE STRIP | VERIFIED |
| CLM-12 | Score Confidence Range | SCORE STRIP | VERIFIED |
| CLM-13 | Execution Layer Status | VERDICT PANEL | VERIFIED |
| CLM-14 | Structural Domain Count | VERDICT PANEL | VERIFIED |
| CLM-15 | Structural Capability Count | VERDICT PANEL | VERIFIED |
| CLM-16 | Structural Component Count | STRUCTURAL VIEW | VERIFIED |
| CLM-17 | Cross-Domain Structural Overlaps | STRUCTURAL VIEW | VERIFIED |
| CLM-18 | Governed Signal Count | STRUCTURAL VIEW | VERIFIED |
| CLM-01 | Structural Coverage Completeness | CONTEXT / BASELINE | VERIFIED |
| CLM-03 | Structural Reconstruction Pass-Fail | CONTEXT / BASELINE | VERIFIED |
| CLM-27 | Full Node Inventory | CONTEXT / BASELINE | VERIFIED |

---

## Gated Claims

| Claim ID | Label | Gate | Condition to activate |
|----------|-------|------|-----------------------|
| CLM-25 | Executive Three-Axis Verdict | GAP-01 | CONCEPT-06 predicate in `concepts.json` updated to include `NOT_EVALUATED`; BC-01 caveat disposition confirmed |

---

## Pre-Activation Flagged Claims

| ID | Claim | Issue | Description |
|----|-------|-------|-------------|
| DQGAP-01 | CLM-19 | Malformed value.narrative | `value.narrative = "## Source Fields"` — markdown rendering artifact from `conf_dist_str()` returning empty string when `total_signals=0`. Explanation field contains correct text but value.narrative is not renderable as a client-facing narrative. CLM-19 slot in STRUCTURAL VIEW must hold a placeholder pending fragment regeneration. |

**CLM-19 placeholder text:** `"Signal registry present — distribution data pending"`

---

## Gating Behavior

### Signal Layer (CLM-20..24)

- No fragment files exist for CLM-20..24 in the fragment directory.
- LENS MUST NOT render any signal-layer sections.
- No signal count, signal list, signal confidence distribution, or individual signal narrative may appear.
- CLM-18 value "0" and CLM-19 (pending DQGAP-01) are the only signal-related surfaces.
- No section titled "Signals", "Signal Intelligence", "Runtime Intelligence", or equivalent may appear in the Tier-2 surface.

### CLM-25 Gated Slot

- LENS renders placeholder text: `"Conceptual coherence not yet evaluated"` in the Executive Verdict slot.
- The placeholder MUST be clearly differentiated from active verdict content (e.g., dimmed, labeled as pending).
- CLM-25 fragment content MUST NOT be partially revealed — no axis values, no narrative text from the fragment.
- Activation gate: GAP-01 resolved + explicit program authority re-authorization.

### CONDITIONAL evidence_class

- Claims with `evidence_class: CONDITIONAL` (if any activated claims carry this) MUST render a confidence qualifier.
- All 13 active claims are `VERIFIED` — no CONDITIONAL badge is required in the current activation set.
- CLM-25 (CONDITIONAL) is gated — its evidence class badge is not rendered.

---

## Rendering Order

```
SCORE STRIP → VERDICT PANEL → STRUCTURAL VIEW → CONTEXT / BASELINE → GATED SLOT
```

1. **SCORE STRIP** — CLM-09, CLM-10, CLM-11, CLM-12
2. **VERDICT PANEL** — CLM-13, CLM-14, CLM-15
3. **STRUCTURAL VIEW** — CLM-16, CLM-17, CLM-18, CLM-19 (placeholder)
4. **CONTEXT / BASELINE** — CLM-01, CLM-03, CLM-27
5. **GATED SLOT** — CLM-25 placeholder

---

## Constraints

1. **ZONE-2 only.** LENS loader MUST use `ZONE-2` files. No `ZONE-1` file may be loaded.
2. **No signal sections.** No signal intelligence surface, signal count badge, or signal list renders.
3. **No CLM-25 content.** Executive verdict slot renders placeholder only. No axis values. No fragment narrative.
4. **No internal identifiers exposed.** `claim_id` (e.g., "CLM-09"), `run_id`, `projection_id`, `source_field`, `transformation_summary` MUST NOT appear in rendered LENS output.
5. **Caveats are mandatory.** If a fragment `caveats[]` array is non-empty, caveats MUST be rendered. They are not suppressible.
6. **Evidence class badge.** `evidence_class` from the fragment drives the confidence badge. `VERIFIED` → full badge. `CONDITIONAL` → qualified badge. No synthetic override.
7. **CLM-19 placeholder.** Until DQGAP-01 is resolved (fragment regenerated), render `"Signal registry present — distribution data pending"` in the structural_condition slot.
8. **run_id must be verified at load time.** Any fragment with `run_id != "run_01_oss_fastapi"` MUST be rejected.

---

## 4-BRAIN Assessment

### CANONICAL

**Fragment set accurately reflects second-client evidence state:** CONFIRMED

- 13 active claims are all `VERIFIED` — no unresolved evidence gaps in active set.
- CLM-25 is `CONDITIONAL` — gated correctly. Fragment truth (BC-01 caveat, sanitized narrative) is preserved and not exposed until gate is cleared.
- CLM-19 `value.narrative` anomaly ("## Source Fields") is a projection runtime artifact from `conf_dist_str()` returning empty string for zero signals. The underlying evidence (0 signals, empty distribution) is correct. The fragment output is malformed for the LENS surface only.
- CLM-18 value "0" is correct — 0 governed signals in `signal_registry.json`.
- CLM-27 "45 total nodes" is the second-client topology count (5 domains, 30 capabilities, 10 components), not the BlueEdge canonical count (17/42/89/148). This is correct.
- No fabricated claims. No BlueEdge contamination.

### CODE

**Fragment loading implementation requirements:**

```
loader(claim_id: str) -> dict:
    path = f"{FRAGMENT_BASE}/{claim_id}-ZONE-2-L1.json"
    fragment = json.load(path)
    assert fragment["zone"] == "ZONE-2"
    assert fragment["run_id"] == RUN_ID
    return fragment
```

**LENS renderer inputs per claim:**
- `display_label` ← `fragment["claim_label"]`
- `primary_value` ← `fragment["value"]["narrative"]`
- `unit` ← `fragment["value"].get("unit", "")`
- `confidence_badge` ← `fragment["evidence_class"]`
- `explanation_text` ← `fragment["explanation"]`
- `caveats` ← `fragment["caveats"]`
- `trace_enabled` ← `fragment["trace_available"]`

**CLM-25 gated path:** fragment is NOT loaded. Renderer substitutes static placeholder string. Gate state is resolved from program authority (GAP-01 resolution record), not from fragment content.

**CLM-19 flagged path:** fragment IS loaded, but `value.narrative` is not used for rendering. Renderer substitutes `"Signal registry present — distribution data pending"` until fragment is regenerated.

### PRODUCT

**LENS Tier-2 structural surface is activatable with 13 claims and 1 gated slot.**

The score strip (CLM-09, 10, 11, 12) provides the primary commercial anchor: proven floor 60, ceiling 100, confidence range [60, 100], band CONDITIONAL. All four VERIFIED.

The verdict panel (CLM-13, 14, 15) provides execution context and structural scale: execution assessment pending, 5 domains, 30 capability surfaces.

The structural view (CLM-16, 17, 18) provides topology detail: 10 components, 1 cross-domain overlap, 0 signals. CLM-19 is placeholder-only pending DQGAP-01.

The context / baseline (CLM-01, 03, 27) provides the evidentiary foundation: 100% structural coverage, reconstruction PASS, 45 nodes total.

The gated slot (CLM-25) renders the activation placeholder only.

**Signal layer is correctly absent.** No signal intelligence, no SIG- references, no signal confidence distribution rendered.

### PUBLISH

**ZONE-2 compliance enforced at fragment level:** All loaded fragments are ZONE-2. Internal field names (`source_field`, `transformation_summary`) are stripped by the projection runtime before fragment generation. They do not exist in the ZONE-2 files.

**No internal identifiers in rendered output:** `claim_id`, `run_id`, `projection_id` are internal reference fields only. They are not rendered.

**CLM-25 BC-01 caveat handling:** Caveat text in CLM-25 fragment ("CONCEPT-06 predicate mismatch — see [[Known Gaps]]") is not rendered because CLM-25 fragment is not loaded in the gated state. The caveat does not appear in LENS output.

**No synthetic claims or aggregations:** The activation contract defines only direct fragment-to-component mappings. No derived summaries, no cross-claim aggregations, no synthetic scores are introduced.

---

## Activation Summary

| Component | Active Claims | Gated | Flagged | Status |
|-----------|--------------|-------|---------|--------|
| SCORE STRIP | 4 | 0 | 0 | ACTIVE |
| VERDICT PANEL | 3 | 0 | 0 | ACTIVE |
| STRUCTURAL VIEW | 3 | 0 | 1 (CLM-19) | PARTIAL |
| CONTEXT / BASELINE | 3 | 0 | 0 | ACTIVE |
| GATED SLOT | 0 | 1 (CLM-25) | 0 | GATED |
| **TOTAL** | **13** | **1** | **1** | — |

---

## Gaps

| ID | Type | Description | Gate |
|----|------|-------------|------|
| GAP-01 | Semantic | CONCEPT-06 predicate mismatch — EXECUTION verdict requires `NOT_EVALUATED` support | CLM-25 surface activation |
| DQGAP-01 | Data quality | CLM-19 `value.narrative = "## Source Fields"` — malformed projection artifact | CLM-19 surface activation |

---

## Next Step Recommendation

**STEP 13 — LENS Tier-2 Surface Build**

Authorized scope:
- Implement LENS Tier-2 renderer consuming fragment files per this contract
- Load ZONE-2 fragments for the 13 active claims
- Render placeholder for CLM-25 and CLM-19
- No signal sections

Pre-requisite for full activation:
- DQGAP-01: Regenerate CLM-19 fragment (zero-signal `conf_dist_str()` output fix) before structural_condition slot activates with real data
- GAP-01: CONCEPT-06 predicate fix before CLM-25 executive verdict slot activates
