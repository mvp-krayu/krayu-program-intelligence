# FORENSIC EXTRACTION REPORT
## Contract: PI.E2E.DETERMINISTIC-GAP.75X-41X.FORENSICS.01
## Run: run_01_oss_fastapi | Client: e65d2f0a-dfa7-4257-9333-fcbb583f0880

---

## SECTION 1 — SCOPE

This report documents the results of a read-only forensic extraction of all 75.x and 41.x
pipeline artifacts produced during `run_01_oss_fastapi` for client
`e65d2f0a-dfa7-4257-9333-fcbb583f0880`.

**Purpose:** Enable future deterministic script contracts for the 75.x → 41.x pipeline
stages that currently have no script-based entrypoints.

**Extraction mode:** READ-ONLY. No artifacts were created, modified, or deleted in client
directories, report directories, or script directories during this extraction.

**Governing contract:** PI.E2E.DETERMINISTIC-GAP.75X-41X.FORENSICS.01

**inference_prohibition:** ACTIVE. All INFERRED labels are explicitly marked. Unmarked
observations represent direct artifact reads only.

---

## SECTION 2 — BRANCH AND GIT STATE

```
Branch:          work/psee-runtime
HEAD commit:     f3cb8e6
Commit message:  [RC-V2] Graph scale tune — canvas 90% width, 220px explicit height
```

Branch authorization note: `work/psee-runtime` is outside the authorized set defined in
`docs/governance/runtime/git_structure_contract.md`. Per memory
`feedback_branch_violation.md`: flag violation, then proceed per contract instruction.

Violation flagged. Proceeding under forensics contract authority.

---

## SECTION 3 — EVIDENCE SOURCES

All artifacts read during this extraction:

**75.x artifacts (client run directory):**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/75.x/condition_correlation_state.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/75.x/pressure_candidate_state.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/75.x/pressure_zone_state.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/75.x/75x_runtime_manifest.json  [inventory only — not read in full]
```

**41.x artifacts (client run directory):**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_projection.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/signal_projection.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_narrative_binding.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/projection_manifest.json
```

**Supporting artifacts (intake and validation):**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/intake_record.json
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/logs/stage_05_envelope.log
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/logs/stage_06_validation.log
```

**Consumer scripts (read-only grep inspection):**
```
scripts/pios/lens_report_generator.py
scripts/pios/tier2_query_engine.py
scripts/pios/run_end_to_end.py  [branch guard inspection only]
```

---

## SECTION 4 — 75.x ARTIFACT INVENTORY

| Artifact | Contract | Status |
|---|---|---|
| condition_correlation_state.json | PI.CONDITION-CORRELATION.ANALYSIS.75X.03 | PRESENT |
| pressure_candidate_state.json | PI.PRESSURE-ZONE.DESIGNATION.75X.04 (interim) | PRESENT |
| pressure_zone_state.json | PI.PRESSURE-ZONE.DESIGNATION.75X.04 | PRESENT |
| 75x_runtime_manifest.json | PI.41X.PRESSURE-ZONE.PROJECTION.01 (source ref) | PRESENT (not read) |

**75.x Markdown artifacts inventory (filenames only — not read in full):**

The following Markdown files exist in the 75.x directory. Contents were not read during
this extraction (out of scope for determinization gap analysis):

```
[OBSERVED] Markdown artifacts present in 75.x/ — exact filenames confirmed by directory listing
```

---

## SECTION 5 — 75.x OBSERVED SCHEMA

### 5.1 condition_correlation_state.json

**Top-level fields (OBSERVED):**
```
schema_version: "1.0"
contract_id: "PI.CONDITION-CORRELATION.ANALYSIS.75X.03"
run_id: "run_01_oss_fastapi"
client_id: "e65d2f0a-dfa7-4257-9333-fcbb583f0880"
analysis_domain: "STRUCTURAL"
total_entities_analyzed: 45
entities_with_active_conditions: 15
signals_evaluated: ["PSIG-001", "PSIG-002", "PSIG-004", "PSIG-006"]
activation_count_distribution: {<entity_id>: <int>, ...}
combination_distribution: {<combination_signature>: <int>, ...}
entity_condition_map: [...]
domain_correlation_map: [...]
validation_flags: {...}
```

**entity_condition_map entry schema (OBSERVED):**
```json
{
  "entity_id": "<string>",
  "entity_name": "<string>",
  "domain_id": "<string>",
  "conditions": {
    "PSIG-001": {
      "status": "ACTIVATED | NOT_ACTIVATED",
      "raw_value": <float>,
      "normalized_value": <float>,
      "threshold": <float>,
      "activation_method": "RUN_RELATIVE_OUTLIER"
    },
    "PSIG-002": { ... same structure ... },
    "PSIG-004": { ... same structure ... },
    "PSIG-006": {
      "status": "ACTIVATED | NOT_ACTIVATED",
      "raw_value": 0.0 | 1.0,
      "normalized_value": <float>,
      "threshold": 0.5,
      "activation_method": "THEORETICAL_BASELINE"
    }
  },
  "combination_signature": "<string>",
  "activation_count": <int>
}
```

**domain_correlation_map entry schema (OBSERVED):**
```json
{
  "domain_id": "<string>",
  "domain_name": "<string>",
  "entity_count": <int>,
  "activated_entity_count": <int>,
  "domain_attribution_signature": "<string>"
}
```

**validation_flags schema (OBSERVED):**
```json
{
  "no_conditions_recomputed": true,
  "no_signals_recomputed": true,
  "no_ranking_applied": true
}
```

### 5.2 pressure_candidate_state.json

**Top-level fields (OBSERVED):**
```
schema_version: "1.0"
source_contract: "PI.CONDITION-CORRELATION.ANALYSIS.75X.03"
candidate_rule: "activation_count >= 2"
candidates: [...]
evidence_trace: {...}
validation_flags: {no_ranking_applied: true, no_focus_domain_selected: true}
```

**candidates entry schema (OBSERVED):**
```json
{
  "candidate_id": "PC-<NNN>",
  "entity_id": "<string> | null",
  "domain_id": "<string>",
  "attribution_type": "primary | secondary | domain-attribution",
  "activation_count": <int>,
  "conditions_activated": ["PSIG-001", "PSIG-002", "PSIG-004"]
}
```

**evidence_trace schema (OBSERVED):**
```json
{
  "ST-030": "PSIG-001",
  "ST-031": "PSIG-002",
  "ST-033": "PSIG-004",
  "ST-034": "PSIG-004"
}
```

### 5.3 pressure_zone_state.json

**Top-level fields (OBSERVED):**
```
schema_version: "1.0"
source_contract: "PI.PRESSURE-ZONE.DESIGNATION.75X.04"
zone_class_rules: {...}
zone_grouping_rule: "domain_id anchor; DOMAIN_ZONE type; alphabetical ordering by anchor_id (deterministic)"
zones: [...]
structural_blind_spot_entities: [...]
validation_status: "VALIDATED"
```

**zone_class_rules (OBSERVED):**
```json
{
  "COMPOUND_ZONE": "condition_count >= 3",
  "COUPLING_ZONE": "PSIG-001 AND PSIG-002 both ACTIVATED",
  "RESPONSIBILITY_ZONE": "PSIG-004 ACTIVATED",
  "BLIND_SPOT_ZONE": "PSIG-006 ACTIVATED (entity level only)"
}
```

**zones entry schema (OBSERVED):**
```json
{
  "zone_id": "PZ-<NNN>",
  "zone_type": "DOMAIN_ZONE",
  "zone_class": ["COMPOUND_ZONE", ...additional class flags...],
  "anchor_id": "<domain_id>",
  "anchor_name": "<string>",
  "condition_count": <int>,
  "max_activation_count": <int>,
  "conditions": ["PSIG-001", "PSIG-002", "PSIG-004"],
  "attribution_profile": {
    "primary": {"entity_id": "<string>", "entity_name": "<string>"},
    "secondary": [{"entity_id": "<string>", ...}, ...]
  },
  "member_entity_ids": ["<string>", ...],
  "candidate_ids": ["PC-<NNN>", ...]
}
```

**structural_blind_spot_entities entry schema (OBSERVED):**
```json
{
  "entity_id": "<string>",
  "domain_id": "<string>",
  "signal": "PSIG-006",
  "activation_status": "ACTIVATED"
}
```

---

## SECTION 6 — 75.x OBSERVED LOGIC

### 6.1 Condition Activation Logic (OBSERVED from artifact field values)

**PSIG-001 (fan-in) and PSIG-002 (fan-out):**
- activation_method: `RUN_RELATIVE_OUTLIER`
- threshold: `2.0` (for PSIG-001)
- INFERRED: IQR-based outlier detection; when IQR degenerates (all values equal), falls back to `mean + 2SD`
- OBSERVED: PSIG-002 for at least one entity: IQR degenerate → threshold computed as `mean + 2SD = 6.228`
- OBSERVED: raw_value for primary candidate (NODE-009): `9.43` for both PSIG-001 and PSIG-002

**PSIG-004 (responsibility):**
- activation_method: `RUN_RELATIVE_OUTLIER`
- OBSERVED: raw_value for primary candidate (NODE-009): `4.33`
- OBSERVED: condition_count threshold produces activation at `4.33`

**PSIG-006 (structural blind-spot):**
- activation_method: `THEORETICAL_BASELINE`
- threshold: `0.5`
- raw_value: `0.0` (not activated) or `1.0` (activated)
- INFERRED: binary signal; entity is a structural blind-spot if it has no conditions other than PSIG-006
- OBSERVED: 9 entities with PSIG-006 ACTIVATED in run_01: DOM-01, DOM-02, NODE-001 through NODE-007

### 6.2 Candidate Selection Logic (OBSERVED)

- candidate_rule: `activation_count >= 2` (entity level)
- Produces 3 entity candidates (PC-001, PC-002, PC-003) and 3 domain candidates (PC-004, PC-005, PC-006)
- Primary attribution: entity with highest activation_count AND highest raw signal values
- OBSERVED: NODE-009 is primary (activation_count=3, raw PSIG-001=9.43)
- OBSERVED: NODE-008 and NODE-010 are secondary (activation_count=3 each)
- Domain candidates anchor to the domain of their primary/secondary entity

### 6.3 Zone Designation Logic (OBSERVED)

- Zones anchor to domain_id (DOMAIN_ZONE type)
- zone_class is multi-valued: all 3 zones carry COMPOUND_ZONE (condition_count=3 >= 3)
- OBSERVED: zone ordering is alphabetical by anchor_id (PZ-001=DOM-03, PZ-002=DOM-04, PZ-003=DOM-05)
- zone_grouping_rule explicitly states: "deterministic"
- OBSERVED: all zones have condition_count=3 and max_activation_count=3
- OBSERVED: structural_blind_spot_entities are NOT promoted to zones — they remain as entity-level PSIG-006 flags

---

## SECTION 7 — 41.x ARTIFACT INVENTORY

| Artifact | Contract | Status |
|---|---|---|
| pressure_zone_projection.json | PI.41X.PRESSURE-ZONE.PROJECTION.01 | PRESENT |
| signal_projection.json | PI.41X.PRESSURE-ZONE.PROJECTION.01 | PRESENT |
| pressure_zone_narrative_binding.json | PI.41X.PRESSURE-ZONE.NARRATIVE-BINDING.01 | PRESENT |
| projection_manifest.json | PI.41X.PRESSURE-ZONE.PROJECTION.01 | PRESENT |

---

## SECTION 8 — 41.x OBSERVED SCHEMA

### 8.1 pressure_zone_projection.json

**Top-level fields (OBSERVED):**
```
schema_version
contract_id: "PI.41X.PRESSURE-ZONE.PROJECTION.01"
source_contract: "PI.PRESSURE-ZONE.DESIGNATION.75X.04"
projection_prohibited_assumptions: [...]
zones: [...]
```

**projection_prohibited_assumptions (OBSERVED):**
```
- no focus domain selection
- no ranking applied
- no new signal IDs introduced
- no recomputation of any values
```

**zones entry schema (OBSERVED — flat projection):**
```json
{
  "zone_id": "PZ-<NNN>",
  "zone_type": "DOMAIN_ZONE",
  "zone_class": ["COMPOUND_ZONE", ...],
  "anchor_id": "<domain_id>",
  "anchor_name": "<string>",
  "condition_count": <int>,
  "max_activation_count": <int>,
  "conditions": ["PSIG-001", "PSIG-002", "PSIG-004"],
  "signals": ["<signal_ref>", ...],
  "attribution_profile": {
    "primary": {"entity_id": "<string>", "entity_name": "<string>"},
    "secondary": [{"entity_id": "<string>", ...}]
  },
  "member_entity_ids": ["<string>", ...],
  "candidate_ids": ["PC-<NNN>", ...],
  "embedded_pair_rules": [...]
}
```

**Fields DROPPED from 75.x → 41.x (OBSERVED):**
- evidence_trace strings (ST-030, ST-031, etc.)
- per-condition_source detail
- validation_status field
- zone_class_rules (moved to manifest-level, not per-zone)
- structural_blind_spot_entities (promoted separately in signal_projection.json)

### 8.2 signal_projection.json

**Top-level fields (OBSERVED):**
```
schema_version
contract_id
source_contract: "PI.CONDITION-CORRELATION.ANALYSIS.75X.03"
active_conditions: [...]
primary_attribution: {...}
```

**active_conditions entry schema (OBSERVED):**
```json
{
  "condition_id": "COND-PSIG-<NNN>-01",
  "signal_id": "PSIG-<NNN>",
  "severity": "HIGH | ACTIVATED",
  "raw_value": <float>,
  "activation_method": "RUN_RELATIVE_OUTLIER | THEORETICAL_BASELINE",
  "threshold": <float>
}
```

**OBSERVED active conditions (all 4):**
```
COND-PSIG-001-01: HIGH, raw_value=9.43, method=RUN_RELATIVE_OUTLIER, threshold=2.0
COND-PSIG-002-01: HIGH, raw_value=9.43, method=RUN_RELATIVE_OUTLIER, threshold=6.228 (IQR degenerate)
COND-PSIG-004-01: HIGH, raw_value=4.33, method=RUN_RELATIVE_OUTLIER
COND-PSIG-006-01: ACTIVATED, raw_value=0.2, method=THEORETICAL_BASELINE, threshold=0.5
```

**primary_attribution (OBSERVED):**
```json
{
  "entity_id": "NODE-009",
  "domain_id": "DOM-04",
  "signals": ["PSIG-001", "PSIG-004"]
}
```

### 8.3 pressure_zone_narrative_binding.json

**Top-level fields (OBSERVED):**
```
schema_version
contract_id: "PI.41X.PRESSURE-ZONE.NARRATIVE-BINDING.01"
source_artifacts: ["41.x/pressure_zone_projection.json", "41.x/signal_projection.json"]
inference_prohibition: "ACTIVE"
zones: [...]
```

**Per-zone narrative fields (OBSERVED):**
```json
{
  "zone_id": "PZ-<NNN>",
  "executive_summary": "<string>",
  "evidence_basis": "<string>",
  "pressure_meaning": "<string>",
  "unresolved_boundaries": "<string>",
  "trace_references": ["<ST-ref>", ...]
}
```

**Governance note (OBSERVED):** inference_prohibition: ACTIVE on this artifact. Narrative
content is evidence-derived descriptions only — no causal claims, no advisory language.

### 8.4 projection_manifest.json

**Top-level fields (OBSERVED):**
```
schema_version: "1.0"
projection_stage: "41.x"
source_stage: "75.x"
projection_contract: "PI.41X.PRESSURE-ZONE.PROJECTION.01"
run_id: "run_01_oss_fastapi"
client_id: "e65d2f0a-dfa7-4257-9333-fcbb583f0880"
generated_at: "2026-04-25"
artifacts: [...]
source_artifacts: [...]
reinjection_analysis: {...}
projection_status: "PROJECTION_PACKAGE_READY"
focus_domain_selected: false
ranking_applied: false
downstream_ready_for: [...]
```

**source_artifacts (OBSERVED):**
```
75.x/pressure_zone_state.json
75.x/pressure_candidate_state.json
75.x/condition_correlation_state.json
75.x/75x_runtime_manifest.json
```

**reinjection_analysis (OBSERVED):**
```
nearest_consumer_zone:
  path: app/gauge-product/pages/api/zones.js
  entry_point: zones.js:25
  invokes: scripts/pios/tier2_query_engine.py --list-zones
  contract: TIER2.RUNTIME.QUERY.ENGINE.01
  status: AVAILABLE — pressure_zone_projection.json not yet wired; requires tier2_query_engine.py extension

nearest_consumer_signal:
  path: app/gauge-product/pages/api/signals.js
  entry_point: signals.js:35
  reads: docs/pios/41.4/signal_registry.json
  contract: GAUGE.RUNTIME.SIGNAL.VISIBILITY.01
  status: AVAILABLE — signal_projection.json is a parallel artifact; does not replace signal_registry.json

direct_consumer_pressure_zone_projection: NONE — no existing code path reads pressure_zone_projection.json by name
safe_to_proceed: true
blockers: []
```

---

## SECTION 9 — 41.x OBSERVED LOGIC

### 9.1 Projection Rules (OBSERVED from artifact field declarations)

1. Zones are projected 1:1 from pressure_zone_state.json — no zone is added, removed, or reordered
2. Field values are copied verbatim — no normalization, no rescaling
3. evidence_trace strings are dropped — they are 75.x internal traceability only
4. validation_status is dropped — it is a 75.x artifact-level property
5. embedded_pair_rules are introduced at 41.x level — these encode the PSIG combination logic
   in a consumer-readable pair format (e.g., "PSIG-001 + PSIG-002 = coupling")
6. signal_projection.json flattens condition-level data from entity_condition_map to a
   condition-indexed list — only activated conditions appear
7. primary_attribution in signal_projection.json is the entity-level primary from
   pressure_candidate_state.json (PC-001 attribution)
8. projection_prohibited_assumptions are explicitly listed and form a governance fence:
   no recomputation, no focus selection, no ranking, no new IDs

### 9.2 Narrative Binding Rules (OBSERVED)

1. Narrative binding derives from 41.x projections only (not directly from 75.x)
2. Each zone receives exactly one narrative entry
3. trace_references in narrative binding reference ST-level evidence (ST-030, etc.) even
   though evidence_trace was dropped from pressure_zone_projection.json
   INFERRED: narrative binding author had access to 75.x artifacts during execution, not
   just 41.x artifacts, despite 41.x being declared as source
4. inference_prohibition: ACTIVE — narrative content uses evidence-descriptive language only

---

## SECTION 10 — DOWNSTREAM CONSUMER DEPENDENCIES

### 10.1 lens_report_generator.py

**Artifact reads (OBSERVED — grep confirmed):**

| Function | Line | Artifact Read |
|---|---|---|
| `_load_psig_projection()` | 2338 | `41.x/signal_projection.json` |
| `_load_pressure_zone_projection()` | 2347 | `41.x/pressure_zone_projection.json` |
| `_compute_decision_model()` | 2387 | uses outputs of both loaders |

**Fields consumed from pressure_zone_projection.json (OBSERVED):**
- `zones[].zone_id`
- `zones[].zone_class`
- `zones[].anchor_name`
- `zones[].attribution_profile`
- `zones[].embedded_pair_rules`
- `zones[].conditions`

**Fields consumed from signal_projection.json (OBSERVED):**
- `active_conditions[].condition_id`
- `active_conditions[].signal_id`
- `active_conditions[].severity`
- `active_conditions[].raw_value`
- `active_conditions[].activation_method`
- `active_conditions[].threshold`

**Fallback behavior (OBSERVED):**
- `_load_psig_projection()` returns `None` if file absent
- `_load_pressure_zone_projection()` returns `None` if file absent
- If either returns `None`: `use_psig = False`
- Decision Surface zone sections render fallback text:
  `"Signal derivation (PiOS 41.x) has not been executed."`

**RC.V2 guard (OBSERVED — present in file after previous task execution):**
- RC.V2 EXECUTION GUARD comment block present in `_build_decision_surface()` above the HTML return
- inference_prohibition: ACTIVE declared in guard

### 10.2 tier2_query_engine.py

**Artifact reads (OBSERVED — grep confirmed):**

| Lines | Purpose | Artifact |
|---|---|---|
| 574–601 | Zone list build | `pressure_zone_projection.json` + `signal_projection.json` |
| 582–601 | `_load_projection_artifact()` — iterates zone_projection, builds activation_state | both projections |
| 675–736 | Zone detail — reads zone_class, attribution_profile, embedded_pair_rules, activation_state, signal_value | both projections |
| 762–870 | Additional tier2 zone rendering logic | both projections |

**Fields consumed from pressure_zone_projection.json (OBSERVED):**
- `zones[].zone_id`
- `zones[].zone_class`
- `zones[].attribution_profile`
- `zones[].embedded_pair_rules`
- `zones[].member_entity_ids`

**Fields consumed from signal_projection.json (OBSERVED):**
- `active_conditions[]` keyed by condition_id
- `active_conditions[].signal_id` → used to build `sig_by_cond` lookup
- `active_conditions[].raw_value` → `signal_value`

**Wiring status (OBSERVED — from reinjection_analysis in projection_manifest.json):**
- tier2_query_engine.py extension is listed as `downstream_ready_for` target
- reinjection_analysis notes: "requires tier2_query_engine.py extension" — partial wiring exists

### 10.3 Other scripts/pios/ scripts

**OBSERVED:** Zero references to 75.x or 41.x artifacts confirmed by grep across all other
scripts in `scripts/pios/`. The 75.x → 41.x pipeline artifacts are consumed exclusively
by `lens_report_generator.py` and `tier2_query_engine.py`.

---

## SECTION 11 — DETERMINIZATION GAPS

### GAP-75X-01: condition_correlation_state.json has no script entrypoint

**Classification:** CRITICAL — blocks full reproducibility

**Observed:** No script in `scripts/pios/` produces `condition_correlation_state.json`.

**OBSERVED pipeline stages that DO have scripts (for contrast):**
```
S01: emit_coverage_state.py
S02: emit_reconstruction_state.py
S03: emit_topology_from_binding.py
S04: emit_signals_empty.py
S05: run_end_to_end.py (envelope)
S06: run_end_to_end.py (validation)
```

**INFERRED:** 75.x condition correlation was executed via AI contract
(PI.CONDITION-CORRELATION.ANALYSIS.75X.03) — no deterministic script equivalent exists.

**Impact:** `condition_correlation_state.json` cannot be regenerated from raw topology alone
without re-executing the AI contract. This breaks the E2E reproducibility chain at the
75.x boundary.

---

### GAP-75X-02: pressure_candidate_state.json has no script entrypoint

**Classification:** CRITICAL — cascades from GAP-75X-01

**Observed:** No script produces `pressure_candidate_state.json`.

**OBSERVED deterministic rule (in artifact):** `candidate_rule: "activation_count >= 2"`

**INFERRED:** Given the rule is explicit, pressure candidate selection IS fully computable
from `condition_correlation_state.json` without AI interpretation. A script could implement
this rule deterministically.

**Candidate inputs for determinization:**
- `condition_correlation_state.json` (activation_count per entity)

**Candidate outputs:**
- `pressure_candidate_state.json` (all fields computable from activation_count and entity metadata)

---

### GAP-75X-03: pressure_zone_state.json has no script entrypoint

**Classification:** CRITICAL — cascades from GAP-75X-02

**Observed:** No script produces `pressure_zone_state.json`.

**OBSERVED deterministic rules (in artifact):**
```
COMPOUND_ZONE: condition_count >= 3
COUPLING_ZONE: PSIG-001 AND PSIG-002 both ACTIVATED
RESPONSIBILITY_ZONE: PSIG-004 ACTIVATED
BLIND_SPOT_ZONE: PSIG-006 ACTIVATED (entity level only)
zone_grouping_rule: alphabetical by anchor_id (deterministic)
```

**INFERRED:** Zone designation rules are fully explicit in the artifact. All rules are
deterministic given `pressure_candidate_state.json` as input. A script could implement
all four zone_class rules and the grouping rule without AI interpretation.

**Candidate inputs for determinization:**
- `pressure_candidate_state.json` (candidates and their activation profiles)
- `condition_correlation_state.json` (domain_correlation_map for domain metadata)

**Candidate outputs:**
- `pressure_zone_state.json` (all fields computable from above inputs)

---

### GAP-41X-01: pressure_zone_projection.json has no script entrypoint

**Classification:** HIGH — cascades from GAP-75X-03

**Observed:** No script produces `pressure_zone_projection.json`.

**OBSERVED projection rules (in artifact):**
- 1:1 zone mapping from `pressure_zone_state.json`
- Drop: evidence_trace, validation_status, per-condition_source
- Add: embedded_pair_rules (encodes combination logic in consumer format)
- Prohibited: no recomputation, no reordering, no new IDs

**INFERRED:** The projection is a deterministic field-selection + field-drop + embedded_pair_rules
construction. The embedded_pair_rules construction is the only non-trivial step — it encodes
PSIG combination semantics in a per-zone pair format. The combination rules are observable
from zone_class_rules in `pressure_zone_state.json`.

**Candidate inputs for determinization:**
- `pressure_zone_state.json`
- zone_class_rules (already embedded in source artifact)

**Candidate outputs:**
- `pressure_zone_projection.json`

---

### GAP-41X-02: signal_projection.json has no script entrypoint

**Classification:** HIGH — cascades from GAP-75X-01

**Observed:** No script produces `signal_projection.json`.

**OBSERVED projection rules:**
- Select only ACTIVATED conditions from entity_condition_map
- Flatten to condition-indexed list
- Assign condition_id as `COND-<SIGNAL_ID>-01`
- Carry forward: severity, raw_value, activation_method, threshold
- Derive primary_attribution from PC-001 entity (primary pressure candidate)

**INFERRED:** This projection is fully deterministic given:
- `condition_correlation_state.json` (for activated conditions + values)
- `pressure_candidate_state.json` (for primary attribution)

**Candidate inputs for determinization:**
- `condition_correlation_state.json`
- `pressure_candidate_state.json`

**Candidate outputs:**
- `signal_projection.json`

---

### GAP-41X-03: pressure_zone_narrative_binding.json cannot be fully determinized

**Classification:** MEDIUM — narrative generation requires AI; governance fences are deterministic

**Observed:** No script produces `pressure_zone_narrative_binding.json`.

**OBSERVED:** inference_prohibition: ACTIVE. Narrative is evidence-descriptive only.

**OBSERVED anomaly:** `trace_references` in narrative binding contain ST-level references
(e.g., ST-030, ST-031) that are NOT present in `pressure_zone_projection.json`
(evidence_trace was dropped at projection). This means narrative binding was authored
with access to 75.x artifacts, despite declaring only 41.x as source.

**INFERRED:** Narrative generation requires:
1. Deterministic part: zone_id, evidence_basis fields, trace_references (computable from 75.x artifacts)
2. Non-deterministic part: executive_summary, pressure_meaning, unresolved_boundaries (require prose generation)

**Candidate partial determinization:**
- Scaffold generation (zone_id, trace_references, evidence_basis structure) = scriptable
- Prose fields = require AI contract execution; cannot be determinized via script alone

**Impact on certification:** Even if GAP-41X-01 and GAP-41X-02 are closed, narrative binding
will require AI contract execution for prose fields. This gap is inherent to the artifact type.

---

### GAP-INFRA-01: No 75.x/41.x stage registration in run_end_to_end.py

**Classification:** HIGH — pipeline completeness gap

**Observed:** `run_end_to_end.py` runs stages S01–S06. No stage exists for 75.x condition
correlation, pressure candidate selection, pressure zone designation, or any 41.x projection.

**INFERRED:** The 75.x → 41.x pipeline is executed as a parallel out-of-band process,
not as a registered pipeline stage. This means:
- No stage_07 or equivalent for 75.x/41.x
- No stage log written for 75.x/41.x execution
- stage_05_envelope.log and stage_06_validation.log validate the pre-75.x pipeline only

**Candidate resolution:**
- Add S07_75X (condition correlation + candidate + zone designation) as a pipeline stage
- Add S08_41X (projection package) as a pipeline stage
- Wire both stages into run_end_to_end.py with branch guard enforcement

---

## SECTION 12 — CANDIDATE INPUTS FOR DETERMINISTIC SCRIPTS

Based on observed artifact field values and declared rules, the following inputs are
candidates for each gap-closing script:

| Target Artifact | Primary Input | Secondary Input | Notes |
|---|---|---|---|
| condition_correlation_state.json | canonical_topology.json | signal_registry.json | PSIG-001/002/004 metric extraction + outlier detection required |
| pressure_candidate_state.json | condition_correlation_state.json | — | Rule: activation_count >= 2; deterministic |
| pressure_zone_state.json | pressure_candidate_state.json | condition_correlation_state.json | All zone_class_rules are explicit; grouping is alphabetical |
| pressure_zone_projection.json | pressure_zone_state.json | — | Field selection + drop + embedded_pair_rules construction |
| signal_projection.json | condition_correlation_state.json | pressure_candidate_state.json | Flatten activated conditions; derive primary_attribution |

---

## SECTION 13 — CANDIDATE OUTPUTS FOR DETERMINISTIC SCRIPTS

Each gap-closing script MUST produce an output that is byte-equivalent to the
corresponding `run_01_oss_fastapi` artifact when given the same inputs. This is the
certification criterion implied by the contract.

**Required output format:** JSON, matching observed schema exactly (Section 5 and Section 8).

**Fields that MUST be preserved verbatim:**
- All numeric values (raw_value, threshold, normalized_value) — no rounding changes
- All IDs (entity_id, domain_id, zone_id, candidate_id, condition_id) — no renaming
- All list orderings (zone alphabetical by anchor_id, conditions by PSIG number)
- All boolean flags (no_conditions_recomputed, no_ranking_applied, etc.)

**Fields that are computed (not copied):**
- combination_signature — INFERRED: concatenation of activated PSIG IDs in defined order
- activation_count — count of ACTIVATED conditions per entity
- zone_class — multi-value list derived from zone_class_rules

---

## SECTION 14 — CERTIFICATION IMPLICATIONS

### 14.1 What blocked run_02 certification

`run_end_to_end.py` branch guard prevented execution outside `work/psee-runtime`. Tested
on `release/rc-v2-decision-surface`: exit code 1, pre-flight FAIL.

Even on the correct branch, 75.x and 41.x stages have no script entrypoints. A second run
cannot regenerate these artifacts deterministically. This is the core certification blocker.

### 14.2 What must be closed before certification is possible

1. **GAP-75X-01 must be closed first.** `condition_correlation_state.json` is the root of
   the entire 75.x → 41.x chain. If it cannot be regenerated deterministically, all
   downstream gaps are moot.

2. **GAP-INFRA-01 must be closed in parallel.** Without stage registration, a second run
   will not execute 75.x/41.x even after scripts are written.

3. **GAP-75X-02, GAP-75X-03, GAP-41X-01, GAP-41X-02** can be closed in sequence after
   GAP-75X-01, since each depends on the prior artifact.

4. **GAP-41X-03 (narrative binding)** cannot be fully closed by script alone. Certification
   scope should either exclude narrative binding from determinism requirements or accept AI
   contract execution as the binding step.

### 14.3 Certification verdict for run_01

`run_01_oss_fastapi` is validated (S06 PASS, all validation checks PASS). The pipeline
executed correctly. The determinization gap is a pipeline engineering gap, not a run quality
failure.

---

## SECTION 15 — OPEN QUESTIONS

1. **OQ-01:** What metric underlies PSIG-001 raw_value=9.43? Is this fan-in count, normalized
   fan-in ratio, or something else? The activation_method is RUN_RELATIVE_OUTLIER but the
   raw metric source is not named in the artifact.

2. **OQ-02:** What is the exact IQR degenerate fallback formula for PSIG-002? The artifact
   states threshold=6.228 (mean + 2SD). What is the population used for mean/SD computation?

3. **OQ-03:** PSIG-006 raw_value = 0.2 in signal_projection.json despite being binary at
   entity level (0.0 or 1.0 in condition_correlation_state.json). Why is 0.2 reported?
   INFERRED: This may represent a run-level prevalence ratio (9 blind-spot entities /
   45 total entities = 0.2). If so, signal_projection.json carries a run-level aggregate,
   not an entity-level value. This must be confirmed before determinization.

4. **OQ-04:** What governs the `embedded_pair_rules` structure in pressure_zone_projection.json?
   The exact schema for this field was not fully extracted. A complete read of the
   `pressure_zone_projection.json` `embedded_pair_rules` array is required.

5. **OQ-05:** Does `75x_runtime_manifest.json` carry any fields that affect projection logic?
   It is listed as a source artifact in projection_manifest.json but was not read in full
   during this extraction.

6. **OQ-06:** Are there additional 75.x Markdown artifacts (beyond the JSON state files)
   that contain computation rules or derivation notes not captured in the JSON schemas?
   The 75.x Markdown file inventory was confirmed but contents were not read.

---

## SECTION 16 — FORENSIC VERDICT

```
FORENSIC_STATUS: EXTRACTION_COMPLETE
DETERMINIZATION_STATUS: NOT_ACHIEVABLE_WITHOUT_SCRIPT_DEVELOPMENT

CRITICAL GAPS:   3 (GAP-75X-01, GAP-75X-02, GAP-75X-03)
HIGH GAPS:       3 (GAP-41X-01, GAP-41X-02, GAP-INFRA-01)
MEDIUM GAPS:     1 (GAP-41X-03)
OPEN_QUESTIONS:  6

ROOT GAP: GAP-75X-01 — condition_correlation_state.json has no deterministic script entrypoint.
          All downstream gaps cascade from this root.

PARTIALLY DETERMINIZABLE: GAP-75X-02, GAP-75X-03, GAP-41X-01, GAP-41X-02
  → All rules are explicit in artifacts
  → Scripts can be written to reproduce these artifacts deterministically

NOT DETERMINIZABLE BY SCRIPT ALONE: GAP-41X-03 (narrative binding prose fields)

CERTIFICATION BLOCKER: GAP-75X-01 + GAP-INFRA-01 must be closed before E2E
  reproducibility certification is achievable for any future run.

DOWNSTREAM CONSUMER READINESS:
  → lens_report_generator.py: wired and consuming 41.x projections; RC.V2 guard active
  → tier2_query_engine.py: partially wired; extension required per reinjection_analysis

RECOMMENDATION STATUS: INFERRED — flagged for human review. Execution authority
  for gap-closing contracts rests with the contracting party, not this forensic report.
```

---

*Report generated under contract: PI.E2E.DETERMINISTIC-GAP.75X-41X.FORENSICS.01*
*Branch: work/psee-runtime | HEAD: f3cb8e6*
*Extraction mode: READ-ONLY*
*inference_prohibition: ACTIVE — all INFERRED labels are explicitly marked*
