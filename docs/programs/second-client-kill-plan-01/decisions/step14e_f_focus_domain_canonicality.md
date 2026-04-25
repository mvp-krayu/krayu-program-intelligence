# STEP 14E-F — Focus Domain Canonicality Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14E-F
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `step14c_reset_full_pipeline_map.md`, `step14d_staged_recovery_plan.md`

---

## Status

**COMPLETE** — Forensic assessment complete. No code modified. No artifacts generated.

---

## Classification

**HARD-CODED (BlueEdge-specific) + CANONICAL GAP**

The "focus domain" concept is a static BlueEdge-specific string constant with no canonical definition, no derivation rule, and no presence in any artifact schema for either client.

---

## Q1 — BlueEdge: Where is DOMAIN-10 selected as focus domain?

### Is it defined in canonical_topology.json, signal_registry.json, gauge_state.json, or elsewhere?

**All three canonical package files inspected.**

| File | `focus_domain` key present | Result |
|------|---------------------------|--------|
| `canonical_topology.json` | NO | ABSENT |
| `signal_registry.json` | NO | ABSENT |
| `gauge_state.json` | NO | ABSENT |
| `evidence_mapping_index.json` | NO | ABSENT (DOMAIN-10 appears as a domain reference but no focus designation) |

No canonical artifact designates any domain as a focus domain. The string "DOMAIN-10" appears as a `domain_id` value in the topology and as `domain_id` on SIG-002 and SIG-004 in the signal registry — but no field named `focus_domain` or equivalent exists in any schema.

### Is it derived or hardcoded?

**HARDCODED.**

The only documented rationale is a code comment in `lens_report_generator.py:1865`:
```python
# DOMAIN-10 is the focus domain (SIG-002 + SIG-004 both domain_id=DOMAIN-10)
FOCUS_DOMAIN = "DOMAIN-10"
```

This comment describes the *observation* that motivated the choice (two signals map to DOMAIN-10) but the choice is encoded as a static string literal, not computed. No function exists that reads signal_registry.json and derives a focus domain by counting signal-to-domain mappings.

---

## Q2 — Second-Client: Does any artifact define a focus domain?

**NO. Focus domain concept is entirely absent from all second-client artifacts.**

| File | `focus_domain` key | Result |
|------|-------------------|--------|
| `canonical_topology.json` | NO | ABSENT |
| `signal_registry.json` | NO | ABSENT |
| `gauge_state.json` | NO | ABSENT |

Second-client domain IDs:
```
DOM-01   GROUNDED   documentation_root
DOM-02   GROUNDED   extraction_analysis
DOM-03   GROUNDED   backend_isolated
DOM-04   GROUNDED   frontend_isolated
DOM-05   GROUNDED   platform_monorepo
```

The naming convention is `DOM-XX` (not `DOMAIN-XX`). `DOMAIN-10` does not exist. No domain maps to the hardcoded constant under either naming convention.

Additionally: second-client `signal_registry.json` has `signals: []`, `emission_state: NOT_EVALUATED`. Even if a signal-convergence derivation rule were applied, it would produce no result — no signals exist to map to any domain.

---

## Q3 — Canonical Layer: Is there any documented rule for focus domain selection?

**NO canonical rule exists.**

**Checked locations:**
- `docs/governance/` — zero occurrences of "focus_domain" or "FOCUS_DOMAIN"
- `docs/pios/` — zero occurrences
- All three BlueEdge canonical package JSON files — no `focus_domain` schema field
- All second-client canonical package JSON files — no `focus_domain` schema field

**Only documented rationale found:**
1. `lens_report_generator.py:1865` (code comment, not a rule):
   > `# DOMAIN-10 is the focus domain (SIG-002 + SIG-004 both domain_id=DOMAIN-10)`
2. `docs/programs/second-client-kill-plan-01/gap_assessment_report.md` (identifies as a parameter, not a rule):
   > "optionally `focus_domain` as constructor arguments"
3. `docs/programs/second-client-kill-plan-01/decisions/step4_tier2_parameterization.md` (design intent):
   > `_focus = focus_domain if focus_domain is not None else "DOMAIN-10"`
   This confirms the pattern: focus domain is expected to be supplied externally; "DOMAIN-10" is the BlueEdge default, not a universal rule.

**CANONICAL GAP DECLARED:** The focus domain concept has no authoritative definition in any governed artifact schema. It is not derivable from canonical data by any implemented rule. It is a BlueEdge-specific constant that was never lifted to a portable canonical concept.

---

## Q4 — Dependency Analysis

### All locations where focus domain is referenced in the generator

| Location | Context | Crash Risk | Phase Scope |
|----------|---------|------------|-------------|
| `lens_report_generator.py:1865-1866` | `_build_tier1_topology_svg()` — SVG highlight for focus node | NO — `if domain_id == FOCUS_DOMAIN:` comparison only | Phase 1 (called from evidence brief) |
| `lens_report_generator.py:1895` | `_build_tier1_topology_svg()` — same function, second reference | NO — comparison only | Phase 1 |
| `lens_report_generator.py:2105` | `_build_tier1_evidence_brief()` — local constant | NO — declaration only | Phase 1 / EXEC |
| `lens_report_generator.py:2119` | `_build_tier1_evidence_brief()` — domain card CSS class | NO — comparison only | Phase 1 / EXEC |
| **`lens_report_generator.py:2222`** | **`_build_tier1_evidence_brief()` — `next()` call with no default** | **YES — `StopIteration` when DOMAIN-10 absent** | **Phase 1 / EXEC — CRASH POINT** |
| `lens_report_generator.py:2223-2224` | `_build_tier1_evidence_brief()` — uses `focus_domain` object | UNREACHABLE after 2222 crash | Phase 1 / EXEC |
| `lens_report_generator.py:2714` | `FOCUS_DOMAIN_T2 = "DOMAIN-10"` — module-level constant | NO — declaration only | Phase 4 / DIAGNOSTIC |
| `lens_report_generator.py:2875` | `_derive_tier2_zones()` | NO — comparison only | Phase 4 |
| `lens_report_generator.py:2888` | `_derive_tier2_zones()` | NO — comparison only | Phase 4 |
| `lens_report_generator.py:2979, 3026, 3056, 3111, 3153` | Tier-2 diagnostic functions | NO — comparisons only | Phase 4 |
| `lens_report_generator.py:1072` | `compose_focus_domain()` — hardcoded BlueEdge HTML | NO — called only from legacy path (line 1770) | LEGACY only |
| `tier2_data.py:24` | Module constant `FOCUS_DOMAIN = "DOMAIN-10"` | NO — `configure()` allows override | Phase 4 / Tier-2 runtime |
| `tier2_data.py:36,38` | `configure()` — accepts optional `focus_domain` param | NO — override path | Phase 4 |
| `tier2_data.py:72, 85` | Zone derivation comparisons | NO — comparisons only | Phase 4 |

### Is Phase 1 execution dependent on this concept?

**YES — partially.** `_build_tier1_evidence_brief()` (EXEC) crashes at line 2222. This blocks EXEC generation entirely.

`_build_tier1_narrative_brief()` (LENS) has **NO focus domain references** (confirmed by inspection of lines 2441–2670). LENS is not independently blocked by focus domain. However, since `generate_tier1_reports()` calls the evidence brief builder first (line 2693 before 2695), and the evidence brief crashes, LENS is never reached in the current execution order.

### Additional hardcoding in `_build_tier1_evidence_brief()` (non-crashing)

`lens_report_generator.py:2090`:
```python
client_name = "Client Environment" if publish_safe else "BlueEdge Fleet Management Platform"
```
When `publish_safe=False`, the internal report hardcodes "BlueEdge Fleet Management Platform" regardless of client. This does NOT crash but produces incorrect client identification in the internal (non-publish) EXEC report for second-client.

---

## Section 4 — 4-BRAIN Analysis

### CANONICAL

Authoritative artifact state across both clients:

| Artifact | `focus_domain` field | BlueEdge DOMAIN-10 present | Second-client match |
|----------|---------------------|---------------------------|---------------------|
| `canonical_topology.json` | ABSENT from schema | YES (as domain_id only) | NO (`DOM-XX` naming) |
| `signal_registry.json` | ABSENT from schema | YES (SIG-002, SIG-004 domain_id) | NO (signals: []) |
| `gauge_state.json` | ABSENT from schema | — | — |
| `evidence_mapping_index.json` | ABSENT | Referenced in text only | ABSENT (file missing for second-client) |

**Truth statement:** No canonical artifact schema defines focus domain. The concept does not exist at the canonical layer. It exists only as a hardcoded constant in the generator.

**CANONICAL GAP:** Focus domain selection has no canonical rule, no schema field, no governed derivation logic.

---

### CODE

**All exact locations (generator):**

| File | Line | Identifier | Type | Crash? |
|------|------|-----------|------|--------|
| `lens_report_generator.py` | 1866 | `FOCUS_DOMAIN = "DOMAIN-10"` | local constant | NO |
| `lens_report_generator.py` | 1895 | `if domain_id == FOCUS_DOMAIN:` | comparison | NO |
| `lens_report_generator.py` | 2105 | `FOCUS_DOMAIN = "DOMAIN-10"` | local constant | NO |
| `lens_report_generator.py` | 2119 | `if did == FOCUS_DOMAIN:` | comparison | NO |
| `lens_report_generator.py` | **2222** | `next(d for d in domains if d["domain_id"] == FOCUS_DOMAIN)` | **next() no default** | **YES — StopIteration** |
| `lens_report_generator.py` | 2223-2224 | `focus_domain.get(...)` | attribute access | UNREACHABLE |
| `lens_report_generator.py` | 2714 | `FOCUS_DOMAIN_T2 = "DOMAIN-10"` | module constant | NO |
| `lens_report_generator.py` | 2875-3153 | 6× `if did == FOCUS_DOMAIN_T2:` | comparisons | NO |
| `tier2_data.py` | 24 | `FOCUS_DOMAIN = "DOMAIN-10"` | module constant | NO |
| `tier2_data.py` | 72, 85 | `if d["domain_id"] == FOCUS_DOMAIN` | comparisons | NO |

**The sole crash point is `lens_report_generator.py:2222`.** All other references are safe comparisons that produce no output when unmatched.

**Dependency points for Phase 1:**
- `_build_tier1_evidence_brief()` calls `_build_tier1_topology_svg()` at line 2102 (safe), then crashes at line 2222 (fatal)
- `_build_tier1_narrative_brief()` has no focus domain dependency

---

### PRODUCT

| Deliverable | Focus Domain Dependency | Status Without Resolution |
|-------------|------------------------|--------------------------|
| EXEC (`lens_tier1_evidence_brief.html`) | YES — `next()` crash at line 2222 | BLOCKED |
| LENS (`lens_tier1_narrative_brief.html`) | NO — no focus domain references in builder | NOT INDEPENDENTLY BLOCKED — but unreachable because EXEC crashes first in `generate_tier1_reports()` |
| DIAGNOSTIC (`lens_tier2_diagnostic_narrative.html`) | NO crash — `FOCUS_DOMAIN_T2` used in comparisons only; no domain gets focus treatment if DOMAIN-10 absent | NOT BLOCKED by focus domain |
| Tier-2 workspace (live) | NO crash — `tier2_data.py` uses comparisons only | NOT BLOCKED by focus domain |

**Phase 1 is blocked.** GAP-CODE-03 (line 2222 crash) must be resolved before EXEC can be generated. LENS is co-blocked by execution order, not by its own dependency.

---

### PUBLISH

**Impact on EXEC if focus domain is absent (after resolution of line 2222 crash):**

1. Domain grid: `DOM-01..DOM-05` will all render with `grounded` CSS class — no domain will receive the `focus` CSS class (line 2119). The "Focus Domain — Investigate" tag label will not appear on any domain card. This is evidence-correct behavior (no focus domain designated).

2. Focus domain stats block (lines 2223-2228): `focus_caps` and `focus_comps` will be 0 (no matching domain). The focus block will render with zero counts. This is degraded but not fabricated.

3. SVG topology (line 1895): No domain node will receive focus highlighting. The SVG renders without a focus-designated node. Evidence-correct.

4. Client name (line 2090): Internal report will say "BlueEdge Fleet Management Platform" instead of a second-client name. This is a cosmetic defect producing incorrect client identification — misleading if shown without correction.

**The EXEC + LENS reports are safe to show (after line 2222 fix) for structural claims with the following disclosures:**
- No focus domain is designated for this client (evidence-correct)
- Internal (non-publish) variant contains "BlueEdge Fleet Management Platform" label — must not be used as client-facing without publish_safe=True

---

## Blocker Statement

**Phase 1 is blocked by GAP-CODE-03.**

**Root:** `lens_report_generator.py:2222` — `next(d for d in domains if d["domain_id"] == FOCUS_DOMAIN)` has no default argument. When DOMAIN-10 is absent (all non-BlueEdge clients), `StopIteration` is raised. This propagates as an unhandled exception from `generate_tier1_reports()`.

**Classification:** HARD-CODED (BlueEdge-specific). Focus domain is not canonical. No derivation rule exists for second-client. The concept is absent from all canonical artifact schemas.

**Resolution scope:** Single-line fix at line 2222 (`next(..., None)`) plus two guard lines at 2223-2224. No architectural change required. No canonical rule needs to be defined to unblock Phase 1 — `None` focus domain is evidence-correct behavior for a client with no designated focus domain.
