# Governance Trace — 41.x Pressure Zone Narrative Binding
## PI.41X.PRESSURE-ZONE.NARRATIVE-BINDING.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.PRESSURE-ZONE.NARRATIVE-BINDING.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Fields Inspected

### Sources read

| Artifact | Key fields consumed |
|---|---|
| `41.x/pressure_zone_projection.json` | zone_id, zone_type, zone_class, anchor_id, anchor_name, attribution_profile, condition_count, conditions[], signals[], embedded_pair_rules[], member_entity_ids[], candidate_ids[] |
| `41.x/signal_projection.json` | condition_id, signal_id, activation_state, signal_value, activation_method, threshold, primary_attribution_entity, primary_attribution_domain, secondary_attribution_entities[], domain_attribution_scope[], combination_signature, statistical_note, signal_authority |
| `41.x/projection_manifest.json` | focus_domain_selected, ranking_applied, projection_status, source_contracts |
| `docs/pios/75.x/pressure_zone_and_focus_domain_concept.md` | Class 1–6 pressure zone definitions; PSIG-001/002/004 signal meanings; COMPOUND_ZONE definition |
| `docs/pios/PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01.md` | PSIG namespace authority (PROVISIONAL_CKR_CANDIDATE); CKR pipeline mapping |

### Field inventory for narrative

| Field | Value(s) found | Use |
|---|---|---|
| `anchor_name` | backend_isolated, frontend_isolated, platform_monorepo | Zone titles |
| `zone_class` | COMPOUND_ZONE (all 3) | Class label + definition |
| `attribution_profile` | PZ-001: secondary, PZ-002: primary, PZ-003: secondary | Factual attribution distinction |
| `condition_count` | 3 (all zones) | Co-presence count |
| Condition set | COND-PSIG-001-01, COND-PSIG-002-01, COND-PSIG-004-01 | All three zones share identical condition set |
| `activation_state` | HIGH (PSIG-001/002/004), ACTIVATED (PSIG-006) | State labels |
| `signal_value` | PSIG-001: 9.43, PSIG-002: 9.43, PSIG-004: 4.33, PSIG-006: 0.20 | Evidence values |
| `activation_method` | RUN_RELATIVE_OUTLIER (PSIG-001/002/004), THEORETICAL_BASELINE (PSIG-006) | Method labels |
| `primary_attribution_entity` | PSIG-001: NODE-009/DOM-04, PSIG-002: null, PSIG-004: NODE-009/DOM-04 | Attribution source |
| `embedded_pair_rules` | COUPLING_ZONE + PROPAGATION_ZONE + RESPONSIBILITY_ZONE (all zones) | Pair rule record |
| `signal_authority` | PROVISIONAL_CKR_CANDIDATE | Authority bound |
| `statistical_note` (PSIG-002) | IQR degenerate; mean+2SD fallback boundary=6.228 applied | Methodological note |
| PSIG-006 scope | DOM-01, DOM-02, NODE-001..007 — NOT in any pressure zone | Structural blind-spot boundary |
| `focus_domain_selected` | false | Unresolved boundary |
| `ranking_applied` | false | Unresolved boundary |

**No title, description, or label fields exist in the projection signals. PSIG IDs are the only signal identifiers. Signal meanings are derived from `pressure_zone_and_focus_domain_concept.md`:**
- PSIG-001 = Fan-In Concentration (Class 1 — Coupling Pressure)
- PSIG-002 = Fan-Out Propagation (Class 2 — Propagation Pressure)
- PSIG-004 = Responsibility Concentration (Class 3 — Responsibility Pressure)
- PSIG-006 = Structural Blind-Spot (not zone-assigned)

---

## Phase B — Narrative Binding Rules

### Language rules applied

| Rule | Enforcement |
|---|---|
| No causal claims | "co-present" used; no "because", "causes", "leads to" |
| No recommendations | Explicitly stated in authority_note; none in zone narratives |
| No ranking | No "most", "highest priority", "most critical" language; "primary attribution" is a factual field value |
| No focus domain | focus_domain_selected=false repeated in every zone's unresolved_boundaries |
| No invented domain names | Only anchor_name values from 41.x artifact used |
| No BlueEdge strings | "blueedge", "domain-10", "fleet", "driver", "vehicle", "sensor bridge" — all absent |
| PSIG IDs traceable | All PSIG/COND IDs present in trace_references |
| Signal authority declared | PROVISIONAL_CKR_CANDIDATE stated in every evidence_basis |

### Attribution profile treatment

`attribution_profile: "primary"` (PZ-002) is presented as a factual field value recording that NODE-009/DOM-04 is the `primary_attribution_entity` for PSIG-001 and PSIG-004. It is explicitly stated NOT to be a priority or severity designation. This prevents misreading of primary attribution as a ranking.

### PSIG-006 handling

PSIG-006 (structural blind-spot, ACTIVATED, value 0.20) is addressed at the package level in `structural_context` and in each zone's `unresolved_boundaries`. It is recorded as activated-but-not-zone-assigned; its entity scope (DOM-01/02, NODE-001..007) is declared; and its non-effect on COMPOUND_ZONE classification is stated explicitly for each zone.

### PSIG-002 statistical note

The IQR degenerate condition (mean+2SD fallback applied) is included verbatim from signal_projection.json in each zone's COND-PSIG-002-01 evidence record. This preserves methodological traceability.

---

## Phase C — Validation

| Check | Result |
|---|---|
| JSON valid | PASS |
| 3 zone narratives, one per PZ | PASS |
| Each narrative references zone_id, conditions[], signals[] | PASS |
| anchor_name present in all zones | PASS |
| narrative_title present in all zones | PASS |
| unresolved_boundaries ≥ 4 per zone | PASS |
| No BlueEdge strings (6 terms checked) | PASS |
| focus_domain_selected=false | PASS |
| ranking_applied=false | PASS |
| "most critical" / "should be" / "fix" / "address" — absent | PASS |
| PZ-002 attribution_profile=primary | PASS |
| PZ-001/003 attribution_profile=secondary | PASS |
| inference_prohibition=ACTIVE | PASS |
| All 9 required fields per zone | PASS (27/27) |
| Total checks: 61 | PASS: 59 / FALSE POSITIVE: 2 |

**2 false-positive validator failures (not violations):**
1. "recommend" matched on `"No recommendations"` in `authority_note` — governance negation, not a recommendation
2. "priorit" matched on `"not a severity or priority designation"` in PZ-002 `pressure_meaning` — explicit negation of priority claim, not a priority claim

Both are correct governance language. Substring matching without context produces false positives on deliberate negations.

---

## Files Created

| File | Description |
|---|---|
| `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_narrative_binding.json` | 41.x narrative binding package — 3 zone narratives with evidence basis, pressure meaning, unresolved boundaries, and trace references |
| `docs/programs/second-client-kill-plan-01/decisions/step41x_pressure_zone_narrative_binding.md` | This governance trace |

---

## Files NOT Modified

- 75.x artifacts — unchanged
- 41.x/pressure_zone_projection.json — unchanged
- 41.x/signal_projection.json — unchanged
- 41.x/projection_manifest.json — unchanged
- workspace.js — unchanged
- tier2_query_engine.py — unchanged

---

## Remaining Blockers

1. **Workspace consumption** — The narrative binding JSON is not yet wired into the workspace query engine or UI. A separate contract is required to expose `narrative_title`, `executive_summary`, `pressure_meaning` in WHY/EVIDENCE panel rendering.

2. **Report consumption** — `lens_report_generator.py` is not yet parameterized for second-client. The narrative binding package is ready for consumption when that contract executes.

3. **PSIG signal names are provisional** — Until PSIG-001..006 are formally admitted as CKR constructs, all signal meanings derive from `pressure_zone_and_focus_domain_concept.md` (75.x conceptual layer). Names like "Fan-In Concentration" should not be presented as final canonical labels in client-facing output.

4. **Focus domain not selected** — No ranking rule has been authorized. Narrative binding does not substitute for or imply a focus domain designation.

---

## Governance Confirmation

- 75.x artifacts not modified
- 41.x projection artifacts not modified
- No signals invented
- No focus domain selected
- No ranking applied
- No recommendations
- All narrative content derived from existing 41.x projection fields only
- PSIG signal meanings sourced from `pressure_zone_and_focus_domain_concept.md`
- inference_prohibition: ACTIVE in produced artifact
