# Report Diff Summary
## PI.LENS.BLUEEDGE-REPORT-DIFF.01

**Generated:** 2026-05-01
**Canonical source:** docs/psee/PI.LENS.BLUEEDGE-CANONICAL-REPORT-PATHS.01/canonical_report_paths.json
**Generated source:** /tmp/blueedge_report_parity_02/

---

## Overall Classification: MIXED

Primary cause: **DATA_DRIFT** — source data artifacts in `run_be_orchestrated_fixup_01/vault/` and `binding/` produce different output than what generated the canonical reports.

Secondary cause: **VOLATILE_METADATA** — `_ACTIVE_VAULT_RUN_ID` differs between canonical and generated.

---

## Per-Report Summary

### TIER1_NARRATIVE — MIXED (DATA_DRIFT + VOLATILE_METADATA)

| Item | Canonical | Generated |
|------|-----------|-----------|
| run_id in nav | `run_blueedge_productized_01_fixed` | `run_blueedge_productized_01_fixed` |
| focus-block count | 10 occurrences | 4 occurrences |
| PZ-001 block | PRESENT | ABSENT |
| DOM anchor | DOM-04 / backend_app_root | EMPTY — `()` |
| Conclusion domain | (DOM-04) | () |
| Body text (gauge/score) | SAME | SAME |

Tier1 narrative run_id in nav links is IDENTICAL — no volatile diff here. The diff is entirely DATA_DRIFT: the binding_envelope/pressure_zone_projection used for generation does not contain PZ-001 with DOM-04 anchor.

---

### TIER1_EVIDENCE — MIXED (DATA_DRIFT + TEMPLATE_DRIFT)

| Item | Canonical | Generated |
|------|-----------|-----------|
| Domain coverage note | "5 of 17 semantic domains" backing | ABSENT |
| Count card: domains | 17 Semantic Domains | 13 Domains |
| Count card: backed | 5 Structurally Backed | 0 Capabilities |
| Count card: semantic-only | 12 Semantic-Only | 35 Components |
| Count card: total | (not shown) | 35 Total Nodes |
| Topology diagram | SVG with domain group rectangles | Different structure |
| File size | 38,145 bytes | 38,803 bytes |

Primary: DATA_DRIFT — domain schema differs. Canonical presents 17 semantic domains with 5 backed. Generated presents 13 structural groups with generic component counts. Different binding/topology data.
Secondary: TEMPLATE_DRIFT — count card labels and structure differ (suggesting different code path for card rendering based on data schema).

---

### TIER2_DIAGNOSTIC — MIXED (DATA_DRIFT + VOLATILE_METADATA)

| Item | Canonical | Generated |
|------|-----------|-----------|
| Run ID field | `run_blueedge_productized_01` | `run_be_orchestrated_fixup_01` |
| Coverage text | "5 of 17 semantic domains have structural backing" | ABSENT |
| Domains backed cell | 5 / 17 | 13 / 13 |
| Diagnostic zones | 1 / 1 (3 active signals) | 0 / 0 (0 active signals) |
| Pressure zones present | 1 | 0 |
| Section 01A Semantic Domain Topology | PRESENT | ABSENT |
| File size | 71,008 bytes | 33,579 bytes |

Volatile: run_id field reads from vault_index.json via `_resolve_vault_index_for_graph()` — not from `_ACTIVE_VAULT_RUN_ID`. At canonical generation time, vault_index showed `run_blueedge_productized_01`. Current vault_index shows `run_be_orchestrated_fixup_01`.
Primary DATA_DRIFT: pressure zones and semantic domain section entirely absent in generated.

---

### DECISION_SURFACE — MIXED (VOLATILE_METADATA + DATA_DRIFT + CONTENT_DRIFT)

| Item | Canonical | Generated |
|------|-----------|-----------|
| Run ID nav links | `run_01_authoritative_generated` | `run_blueedge_productized_01_fixed` |
| Decision | INVESTIGATE | INVESTIGATE |
| Confidence | CONDITIONAL | CONDITIONAL |
| Active signals listed | PSIG-001, PSIG-002, PSIG-004 | PSIG-001–006 |
| Hero rationale | "5/17 semantic domains backed..." | "13 of 13 structural evidence groups..." |
| Status badge | "STRUCTURE: STABLE" | "STRUCTURE: STABLE within structural evidence scope" |
| Truth text | "5/17 domains have structural backing, 12 semantic-only" | "13 of 13 structural groups grounded" |
| Gap item | "2 structural signals not activated" | "Not-activated signals: PSIG-003 · PSIG-005" |
| Graph node coords | Fixed (from prior run) | Different (force sim, 18 nodes, 17 links, 458 ticks) |

Volatile (run_id nav): Canonical was generated WITHOUT `--run-id` (default `run_01_authoritative_generated`). Generated uses `--run-id run_blueedge_productized_01_fixed`.
Primary DATA_DRIFT: hero rationale, truth text, status badge, gap items all differ because binding_envelope pressure zone data differs.

---

## Core Metric Agreement

Despite template and data field differences, these core metrics MATCH:
- Gauge score: **60** (both)
- Decision classification: **INVESTIGATE** (both)
- Confidence band: **CONDITIONAL** (both)

These values come from `gauge_state.json` and `signal_registry.json` which ARE consistent between canonical and generated runs.

---

## Root Cause Summary

The canonical reports were generated from a data context that included:
1. Pressure zone PZ-001 with DOM-04 anchor (missing in `run_be_orchestrated_fixup_01/binding/`)
2. 5/17 semantic domain backing schema (vs 13/13 structural groups schema in current data)
3. `_ACTIVE_VAULT_RUN_ID = "run_01_authoritative_generated"` (default, no `--run-id` flag)
4. vault_index.json showing `run_blueedge_productized_01` (now shows `run_be_orchestrated_fixup_01`)

The `--package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault` points to data that is structurally different from what was used for canonical generation.
