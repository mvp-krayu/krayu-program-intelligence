# STEP 14E-G — Pressure Zone / Focus Domain Canonicalization Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14E-G
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `step14c_reset_full_pipeline_map.md`, `step14d_staged_recovery_plan.md`, `step14e_f_focus_domain_canonicality.md`

---

## Status

**COMPLETE** — Forensic assessment complete. No code modified. No artifacts generated.

---

## Classification

**MIXED: DERIVED RULE + HARDCODED PRECONDITION**

The published concept "pressure zones" maps to `zone_type = "pressure_concentration"` in the implementation. The zone type assignment rule is implemented (derived from focus domain status + signal presence). The precondition that determines which domain is "focus" is hardcoded to `"DOMAIN-10"` (BlueEdge-specific constant). There is no canonical rule governing either the focus domain designation or pressure zone selection. Both concepts are absent from all governed artifact schemas.

---

## Q1 — Concept Mapping: Published "Pressure Zones" → Code Implementation

### What is the published concept?

"Pressure zones" appears in two governed publish-layer surfaces:

| Source | Quote | Context |
|--------|-------|---------|
| `docs/commercial/lens_tier1_assessment.html` | "pressure zones, and confidence bands derived from the evidence set" | Step 02 description of LENS Tier-1 process |
| `docs/commercial/lens_executive_onepager.html` | "pressure zones, and confidence bands derived from the evidence set" | Identical step 02 description |
| `signal-mirror/delivery-risk.md` | "It surfaces pressure zones, dependency concentrations, and predictability conditions" | External-facing product description |

The published concept implies broad applicability across clients — it is presented as a generic product capability, not a BlueEdge-specific feature.

### What is the code implementation?

The code implementation is `zone_type = "pressure_concentration"`, assigned in `_derive_tier2_zones()` (`lens_report_generator.py:2862-2936`).

Assignment rule (lines 2888-2891):
```python
is_focus = did == FOCUS_DOMAIN_T2
if is_focus and domain_sigs:
    zone_type = "pressure_concentration"
```

**Two preconditions both required:**
1. `is_focus` — `domain_id == FOCUS_DOMAIN_T2` (where `FOCUS_DOMAIN_T2 = "DOMAIN-10"`, defined at line 2714)
2. `domain_sigs` — domain has at least one signal bound to it in `signal_registry.json`

**Runtime manifestation of a "pressure zone":**
- Zone renders with `pressure_concentration` type in Tier-2 workspace (`workspace.js:57`: `label: 'pressure concentration'`)
- CSS classes: `.t2-pressure-row`, `.t2-pressure-cell`, `.t2-type-pressure`
- Condition description block (`_build_t2_zone_block()`, line 2979-2987): when `did == FOCUS_DOMAIN_T2`, renders hardcoded narrative referencing "Seven core runtime operational dimensions" and BlueEdge-specific fleet/vehicle/driver metrics

**Concept mapping result:**

| Published concept | Code identifier | Location | Type |
|------------------|-----------------|----------|------|
| "pressure zone" | `zone_type = "pressure_concentration"` | `lens_report_generator.py:2891` | Zone type value |
| (implied: domain under focus pressure) | `is_focus = did == FOCUS_DOMAIN_T2` | `lens_report_generator.py:2888` | Precondition |
| (implied: signal-driven) | `domain_sigs` non-empty | `lens_report_generator.py:2890` | Precondition |

**The mapping is confirmed.** "Pressure zone" = `pressure_concentration` zone type = focus domain with bound signals.

---

## Q2 — BlueEdge Origin Classification

### Is the pressure_concentration zone type signal-driven, topology-driven, or hardcoded?

**MIXED — partially derived, partially hardcoded.**

| Component | Type | Source |
|-----------|------|--------|
| Zone type assignment rule (`is_focus AND has_signals → pressure_concentration`) | DERIVED | Implemented logic in `_derive_tier2_zones()` |
| Focus domain selection (`FOCUS_DOMAIN_T2 = "DOMAIN-10"`) | HARDCODED | Static string constant at `lens_report_generator.py:2714` |
| `pressure_concentration` narrative (Section A in zone block) | HARDCODED BlueEdge-specific | `lens_report_generator.py:2980-2986` — mentions "Seven core runtime operational dimensions", fleet/vehicle/driver metrics |
| Candidate domain population (focus domain always first) | DERIVED | `_derive_tier2_zones()` lines 2874-2877: focus domain always leads the zone list |

**BlueEdge origin evidence:**

The narrative at line 2980-2986 is hardcoded to BlueEdge operational semantics:
```python
if did == FOCUS_DOMAIN_T2:
    raw_cond = (
        f"{dname} domain exhibits concentrated structural pressure. "
        "Seven core runtime operational dimensions are unresolvable from available static evidence: "
        "backend service memory usage, cache efficiency, cache availability, event pipeline activity, "
        "fleet connection activity, vehicle alert activity, and driver session performance. "
        ...
    )
```

"Fleet connection activity", "vehicle alert activity", "driver session performance" — these are BlueEdge fleet management domain terms. They are NOT generic product language.

The focus domain precondition (`FOCUS_DOMAIN_T2 = "DOMAIN-10"`) is confirmed hardcoded (from STEP 14E-F forensics). The only documented rationale is the code comment at line 1865:
```python
# DOMAIN-10 is the focus domain (SIG-002 + SIG-004 both domain_id=DOMAIN-10)
```

The motivation (two signals converge on DOMAIN-10) was never lifted to a canonical derivation rule.

---

## Q3 — Canonical Layer: Is there a canonical rule for pressure zone designation?

**NO canonical rule exists.**

**Checked locations:**
- `docs/governance/` — zero occurrences of "pressure_zone", "pressure_concentration", "FOCUS_DOMAIN_T2"
- `docs/pios/` — zero occurrences of canonical pressure zone derivation rule
- All BlueEdge canonical package JSON files — no `pressure_zone`, `focus_domain`, or `pressure_concentration` field in any schema
- All second-client canonical package JSON files — same: absent
- `tier2_data.py` — `FOCUS_DOMAIN = "DOMAIN-10"` module constant; `configure()` accepts override but no canonical derivation rule
- `canonical_topology.json` (both clients) — domain grounding field present, but no zone-type or pressure-zone designation

**CANONICAL GAP DECLARED:** The pressure zone concept (as a designated output) has no authoritative definition in any governed artifact schema. No canonical rule exists for which domain should become a pressure zone. The concept is not derivable from canonical data by any implemented rule beyond the hardcoded focus domain constant.

---

## Q4 — Second-Client Derivation Feasibility

### Can a pressure zone be derived for the second client?

**NO — under current implementation and current artifact state.**

Two preconditions both fail for second-client:

| Precondition | Second-Client State | Result |
|-------------|---------------------|--------|
| `is_focus` (domain_id == FOCUS_DOMAIN_T2 == "DOMAIN-10") | Second-client uses `DOM-01..DOM-05`; "DOMAIN-10" does not exist | FAILS — no domain matches |
| `domain_sigs` non-empty | `signal_registry.json` has `signals: []`, `emission_state: NOT_EVALUATED` | FAILS — no signals bound to any domain |

**Even if focus domain was parameterized** (e.g., `configure(focus_domain="DOM-01")`):
- The signal precondition still fails: `signal_registry.json` has no signals
- `domain_sigs` would be empty for every domain
- `is_focus AND domain_sigs` → False for all domains
- No domain would receive `pressure_concentration`
- No "pressure zone" would appear in output

**Signal derivation (PiOS 41.x) is a prerequisite for any pressure zone to appear for second-client.** This is consistent with STEP 14D Phase 5 dependency.

**Additionally:** Even with signals and a parameterized focus domain, the zone block narrative (lines 2980-2986) is hardcoded BlueEdge text. It would need to be replaced with evidence-derived or generic text for second-client use. This is a separate cosmetic/accuracy defect.

---

## Q5 — Dependency on Focus Domain

### Is "pressure zone" independently canonical, or strictly dependent on "focus domain"?

**STRICTLY DEPENDENT.** Pressure zone is not independently canonical.

The dependency chain is:
```
FOCUS_DOMAIN_T2 = "DOMAIN-10"   (hardcoded constant)
        ↓
is_focus = (domain_id == FOCUS_DOMAIN_T2)   (comparison)
        ↓
is_focus AND domain_sigs → zone_type = "pressure_concentration"   (rule)
        ↓
"pressure zone" in published product output
```

There is no path to a `pressure_concentration` zone that does not go through `FOCUS_DOMAIN_T2`. The focus domain constant is the **sole** upstream dependency for the pressure zone concept.

**Implication for second-client:** Resolving GAP-CODE-03 (the `next()` crash at line 2222) is a prerequisite for Phase 1. But resolving the pressure zone gap requires additionally:
1. A canonical or parameterized focus domain designation for second-client
2. Signals derived by PiOS 41.x (Phase 5)
3. Replacement of hardcoded BlueEdge narrative in zone block

None of these are in scope for Phase 1. Phase 4 (DIAGNOSTIC generation) requires all three.

---

## Section 5 — 4-BRAIN Analysis

### CANONICAL

| Concept | Schema field | Canonical rule | Second-client present |
|---------|-------------|---------------|----------------------|
| `focus_domain` | ABSENT (all canonical packages) | ABSENT | ABSENT |
| `pressure_zone` | ABSENT (all canonical packages) | ABSENT | ABSENT |
| `pressure_concentration` | ABSENT (all canonical packages) | ABSENT | ABSENT |

**Truth statement:** Neither "focus domain" nor "pressure zone" exists at the canonical artifact layer. Both are implementation-only concepts anchored to BlueEdge-specific hardcoded constants. No canonical derivation rule exists for either.

**CANONICAL GAP:** Two canonical gaps are active:
- CG-01: Focus domain selection (from STEP 14E-F)
- CG-02: Pressure zone designation (this assessment)

Both gaps are inter-dependent: CG-02 is downstream of CG-01.

---

### CODE

| File | Line | Identifier | Type | BlueEdge-specific |
|------|------|-----------|------|------------------|
| `lens_report_generator.py` | 2714 | `FOCUS_DOMAIN_T2 = "DOMAIN-10"` | module constant | YES |
| `lens_report_generator.py` | 2875 | `if d["domain_id"] == FOCUS_DOMAIN_T2` | comparison — candidate selection | YES (indirectly) |
| `lens_report_generator.py` | 2888 | `is_focus = did == FOCUS_DOMAIN_T2` | boolean flag | YES |
| `lens_report_generator.py` | 2890-2891 | `if is_focus and domain_sigs: zone_type = "pressure_concentration"` | zone type assignment | YES |
| `lens_report_generator.py` | 2979-2986 | BlueEdge fleet narrative in `_build_t2_zone_block()` | hardcoded string | YES — explicit BlueEdge operational language |
| `lens_report_generator.py` | 3026-3029 | Dependency description in Section B | hardcoded string | YES |
| `tier2_data.py` | 24 | `FOCUS_DOMAIN = "DOMAIN-10"` | module constant | YES |
| `tier2_data.py` | 72, 85 | zone derivation comparisons | comparisons | YES (indirectly) |

**For second-client:** No crash from Phase 4 focus domain comparisons (all comparisons simply produce no match). But no pressure_concentration zone ever appears, and the zone block narrative would contain BlueEdge-specific text if the focus domain path were ever reached.

---

### PRODUCT

| Deliverable | Pressure Zone Dependency | Status for Second-Client |
|-------------|-------------------------|--------------------------|
| EXEC (`lens_tier1_evidence_brief.html`) | NONE — no pressure zone rendering in Tier-1 EXEC | NOT BLOCKED by this gap |
| LENS (`lens_tier1_narrative_brief.html`) | NONE — no pressure zone rendering in Tier-1 LENS | NOT BLOCKED by this gap |
| DIAGNOSTIC (`lens_tier2_diagnostic_narrative.html`) | YES — pressure zone is a Tier-2 feature | NO pressure zone rendered (evidence-correct: no signals, no focus domain) |

**Phase 1 is NOT blocked by the pressure zone / focus domain gap.** GAP-CODE-03 (line 2222 crash) is the Phase 1 blocker, not the pressure zone concept itself.

**Phase 4 (DIAGNOSTIC):** Pressure zone will be absent for second-client. This is evidence-correct behavior given:
- `signals: []` (no signals)
- `DOM-01..DOM-05` naming (no DOMAIN-10 match)

The DIAGNOSTIC will render without a pressure_concentration zone. All second-client domains without signals will receive `evidence_gap` zone type. This is not a blocker for Phase 4 — it is the expected output given the evidence state.

---

### PUBLISH

**Published concept vs. implementation gap:**

The commercial materials (`lens_tier1_assessment.html`, `lens_executive_onepager.html`, `signal-mirror/delivery-risk.md`) describe "pressure zones" as a generic product capability. The implementation is BlueEdge-specific (hardcoded DOMAIN-10, BlueEdge fleet narrative). This is a product-to-publish alignment gap — the publish layer overstates generality.

**For second-client deliverables:**
- EXEC + LENS: pressure zone concept does not appear — no disclosure needed
- DIAGNOSTIC: pressure zone absent from output — evidence-correct; rendered output accurately reflects the evidence state (no signals, no focus domain)
- The absence of a pressure zone in second-client output does NOT constitute a publish-layer defect — it is an evidence-correct non-appearance

**If DIAGNOSTIC is shown to a client:**
- No domain will show a "pressure concentration" label
- All domains without signals will show "evidence_gap"
- This is accurate representation of second-client evidence state

---

## Blocker Statement

**Phase 4 (DIAGNOSTIC) is not blocked by the pressure zone gap.** The absence of pressure zone is evidence-correct behavior for second-client and will render without crash.

**Phase 1 (EXEC + LENS) remains blocked by GAP-CODE-03** (from STEP 14E-F and STEP 14E-CONT), not by the pressure zone gap.

**Resolution scope for pressure zone (if full parity is required in Phase 4):**
1. Parameterize `FOCUS_DOMAIN_T2` via `tier2_data.configure()` — minimal code change
2. Derive focus domain from signal convergence in second-client `signal_registry.json` — requires PiOS 41.x first (Phase 5)
3. Replace hardcoded BlueEdge fleet narrative in `_build_t2_zone_block()` (lines 2980-2986) — cosmetic fix, requires evidence-derived or generic text
4. None of the above are required to unblock Phase 4 — absence of pressure zone is valid output

---

## Summary

| Finding | Result |
|---------|--------|
| "Pressure zone" maps to code | YES — `zone_type = "pressure_concentration"` |
| Canonical rule exists | NO — absent from all governed schemas |
| BlueEdge origin classification | MIXED: derived rule + hardcoded precondition |
| Focus domain is precondition | YES — pressure_concentration requires is_focus AND domain_sigs |
| Second-client derivation possible now | NO — no signals, no focus domain designation |
| Phase 1 blocked by this gap | NO — Phase 1 blocked by GAP-CODE-03 (line 2222) only |
| Phase 4 blocked by this gap | NO — absent pressure zone is evidence-correct output |
| Hardcoded BlueEdge narrative present | YES — lines 2980-2986 contain fleet/vehicle/driver terms |
