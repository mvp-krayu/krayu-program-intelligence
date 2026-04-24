# STEP 10H-R — Canonical Source Retrieval (Vault + Signals + Projection)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10H-R
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## 1. CANONICAL SOURCES (with exact paths)

### C1 — Reference Vault (BlueEdge)

**Primary vault:**
`clients/blueedge/vaults/run_01_authoritative/`

**Structure:**
```
claims/          — 27 claim files (CLM-01..CLM-27) + fragments/
artifacts/       — 7 artifact nodes (ART-01..ART-07)
governance/
entities/
transformations/
client-lineage/
00 — Meta
00 — Navigation
EVIDENCE VAULT V2.md
VAULT ENTRY — BlueEdge.md
```

**Claims schema (frontmatter):**
```
node_class: claim
claim_id: CLM-XX
claim_label: <label>
claim_type: metric | distribution | signal | boolean | range | list | narrative
exposure: ZONE-2
lens_admissible: YES | CONDITIONAL | NO
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
```

**Claims body sections:**
`## Explanation` · `## Authoritative Value` · `## Source Fields` ·
`## Upstream Artifacts` · `## Transformation Chain` · `## Entity Links` ·
`## Exposure` · `## Traceability` · `## Why It Matters` · `## Surfaces`

**Signal representation inside claims (CLM-20..CLM-24):**
- Authoritative Value includes: signal_id, evidence_confidence, domain, capability
- Source Fields reference: SIG-XXX, COND-XXX, DIAG-XXX, INTEL-XXX
- Transformation Chain: four-layer chain (SIG → COND → DIAG → INTEL)
- When signal missing from registry: `status: BLOCKED — signal not present in registry`
  (lines 1558–1571: `scripts/psee/build_evidence_vault.py`)

**Vault builder:**
`scripts/psee/build_evidence_vault.py`
— stream: `PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01`
— schema: `PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01`

---

### C2 — Canonical Signal Definitions

**Primary:**
`docs/pios/40.5/signal_output_set.md`

**Supplementary:**
`docs/pios/40.5/signal_computation_specification.md`
`docs/pios/40.5/signal_input_matrix.md`
`docs/pios/40.5/signal_boundary_enforcement.md`
`docs/pios/40.5/signal_traceability_map.md`
`docs/pios/contracts/40.5/PIOS-40.5-SIGNAL-CONTRACT.md`

**SIG-XXX definitions (run_01_blueedge):**

| Signal ID | Name | State | Required Input |
|---|---|---|---|
| SIG-001 | Backend Process Heap Usage | PENDING | VAR_SYS_001 (Prometheus, TMP-004) |
| SIG-002 | Cache Hit Efficiency | PENDING | VAR_CACHE_001/002 (Prometheus, TMP-004) |
| SIG-003 | Cache Connectivity State | PENDING | VAR_CACHE_003 (Prometheus, TMP-004) |
| SIG-004 | Domain Event Emission Count | PENDING | VAR_EVT_001 (Prometheus, TMP-004) |
| SIG-005 | Fleet Active Connection Count | PENDING | VAR_WS_001 (WebSocket events, TMP-010) |
| SIG-006 | Sensor Bridge Batch Throughput Rate | COMPLETE | hasi_bridge.py DEFAULT_CONFIG (static) |
| SIG-007 | Vehicle Alert Severity State | PENDING | VAR_ALT_001 (TMP-003/010) |
| SIG-008 | Driver Session Performance | PENDING | VAR_DS_004..006 (TMP-010) |

**Computation preconditions for SIG-001..005, SIG-007..008:**
- Requires live Prometheus scrape from running blueedge-api:3000/health/prometheus (TMP-004)
- Or live WebSocket / alert / session events (TMP-010)
- `signal_output_completeness: PARTIAL` is the governed position
- Evidence-First GC-06 prevents fabrication

**Key finding:** ALL SIG-XXX definitions in `docs/pios/40.5/` are
**BlueEdge-client-specific**. They reference:
- `hasi_bridge.py` (COMP-74/75) — BlueEdge CEU-10
- Fleet management platform concepts (driver sessions, vehicle alerts)
- `blueedge-api:3000/health/prometheus` endpoint
- VAR_HASI_001, VAR_HASI_002 telemetry variables

**No SIG-XXX definitions exist for second-client (OSS FastAPI).**
PiOS 40.5 / 41.4 has never been executed for this client.

---

### C3 — Projection Runtime Contract

**Path:** `scripts/pios/projection_runtime.py`
**Authority:** `PRODUCTIZE.LENS.PROJECTION.CONTRACT.01`

**Expected vault inputs:**
- `vault_path` = `clients/<client_id>/vaults/<run_id>/`
- `claims/CLM-XX *.md` — parsed via `_find_claim_file()` (line 323)
- Signal registry via `_find_signal_registry()` (lines 333–347)

**`_find_signal_registry()` hardcoded candidates** (lines 338–343):
```python
client_dir / "psee" / "runs" / "run_authoritative_recomputed_01" / "package" / "signal_registry.json"
client_dir / "psee" / "runs" / "run_01_authoritative" / "package" / "signal_registry.json"
```
`run_01_oss_fastapi` is NOT in this list → will return `None` for second-client vault.

**Default `run_id` hardcoded** (lines 963, 1037, 1108, 1134, 1189, 1203, 1208):
`run_id: str = "run_authoritative_recomputed_01"` at all five public API entry points.

**Signal claim IDs** (line 106):
`SIGNAL_CLAIM_IDS = {"CLM-20", "CLM-21", "CLM-22", "CLM-23", "CLM-24"}`

**Signal claim labels** (vault builder lines 496–500):
```
CLM-20 → "SIG-001 Sensor Bridge Throughput"          (BlueEdge-specific)
CLM-21 → "SIG-002 Platform Runtime State Seven Unknown Dimensions"
CLM-22 → "SIG-003 Dependency Load 68 Percent"
CLM-23 → "SIG-004 Structural Volatility Edge Density"
CLM-24 → "SIG-005 Coordination Pressure Partial"
```
All five labels are hardcoded to BlueEdge signal content.

**Fragment generation logic:**
`export_fragments()` (line 1134) iterates CLAIM_SETS, projects each claim, writes
JSON fragments to `output_dir/`. Depends on vault claims being resolvable.

---

### C4 — Reference GAUGE → Vault Mapping

**Source:** `scripts/psee/build_evidence_vault.py` + BlueEdge vault at
`clients/blueedge/vaults/run_01_authoritative/`

**Confirmed mapping (build_vault_model lines 213–323):**

| GAUGE Package Artifact | Field(s) Read | → Vault Claim(s) |
|---|---|---|
| `gauge_state.json` | `dimensions.DIM-01.coverage_percent`, `required_units`, `admissible_units` | CLM-01, CLM-02 |
| `gauge_state.json` | `dimensions.DIM-02.state`, `axis_results`, `reconstruction_points` | CLM-03, CLM-04 |
| `gauge_state.json` | `dimensions.DIM-03.state_label` | CLM-05 |
| `gauge_state.json` | `dimensions.DIM-04.total_count` | CLM-06 |
| `gauge_state.json` | `dimensions.DIM-05.state` | CLM-07 |
| `gauge_state.json` | `dimensions.DIM-06.state` | CLM-08 |
| `gauge_state.json` | `score.canonical` | CLM-09 |
| `gauge_state.json` | `score.projected` | CLM-10 |
| `gauge_state.json` | `score.band_label` | CLM-11 |
| `gauge_state.json` | `confidence.lower` / `.upper` | CLM-12 |
| `gauge_state.json` | `state.execution_status` | CLM-13 |
| `gauge_state.json` | `score.derivation` | (score explanation) |
| `reconstruction_state.json` | `axis_results` (preferred over gauge DIM-02) | CLM-04 |
| `canonical_topology.json` | `counts.domains/capabilities/components/total_nodes` | CLM-14, CLM-15, CLM-16, CLM-27 |
| `canonical_topology.json` | `domains[].domain_name` | CLM-14 |
| `canonical_topology.json` | `domains[].cross_domain` → `canonical_cross_domain_overlaps` | CLM-17 |
| `signal_registry.json` | `total_signals` | CLM-18 |
| `signal_registry.json` | per-signal `evidence_confidence` | CLM-19 |
| `signal_registry.json` | `signals[SIG-001..005]` | CLM-20..CLM-24 |

**Optional artifacts (fail-open):**
- `admissibility_log.json` — try_load_json, 3 candidate paths
- `binding_envelope.json` — try_load_json, passed via `--binding-envelope`

---

## 2. SCHEMA EXTRACTION (no interpretation)

### Vault Structure

```
<vault_root>/
  EVIDENCE VAULT V2.md          — root node (frontmatter: title, node_type, client, status, stream_id)
  VAULT ENTRY — <client>.md     — entry point node
  00 — Meta                     — meta node
  00 — Navigation               — nav node
  claims/
    CLM-XX <label>.md           — claim nodes (frontmatter + ## sections)
    fragments/                  — projection fragment JSON files
  artifacts/
    ART-XX <name>.md            — artifact reference nodes
  entities/
    ENT-*.md                    — entity nodes
  transformations/
    TRN-*.md                    — transformation nodes
  governance/                   — governance docs
  client-lineage/               — client lineage docs
```

### Claim Structure

```markdown
---
node_class: claim
claim_id: CLM-XX
claim_label: <label>
claim_type: metric | distribution | signal | boolean | range | list | narrative
exposure: ZONE-2
lens_admissible: YES | CONDITIONAL | NO
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation       — technical Z1 text
## Authoritative Value — raw authoritative value
## Source Fields     — bullet list of artifact.field references
## Upstream Artifacts — wikilinks to ART-XX nodes
## Transformation Chain — derivation steps
## Entity Links      — signal/domain/component links
## Exposure          — ZONE, LENS admissible, Reason
## Traceability      — Status: FULL | PARTIAL | BLOCKED; Caveats
## Why It Matters    — Z2 narrative
## Surfaces          — UI surface references
```

### Signal Structure

Signal entries in `signal_registry.json` (BlueEdge reference schema):
```json
{
  "signal_id": "SIG-001",
  "title": "<title>",
  "statement": "<Z1 statement>",
  "evidence_confidence": "STRONG | MODERATE | WEAK",
  "business_impact": "<Z2 business_impact>",
  "risk": "<Z2 risk>",
  "domain_name": "<domain>",
  "capability_name": "<capability>",
  "component_names": ["<component>"],
  "source_refs": ["<COND/DIAG/INTEL references>"]
}
```

Second-client `signal_registry.json` (current):
```json
{
  "emission_state": "NOT_EVALUATED",
  "total_signals": 0,
  "signals": []
}
```
— no SIG-XXX entries; `signals` loop in vault builder produces empty `signals: []`
and `conf_dist: {}`.

---

## 3. DEPENDENCY MAP

### GAUGE → VAULT

| GAUGE Artifact | Vault Consumption | Second-Client Status |
|---|---|---|
| `coverage_state.json` | `dim01.coverage_percent`, `required_units`, `admissible_units` → CLM-01, CLM-02 | PRESENT; all fields present |
| `reconstruction_state.json` | `axis_results` → CLM-03, CLM-04 | PRESENT; PASS state, all four axes |
| `canonical_topology.json` | `counts`, `domains[]` → CLM-14..CLM-17, CLM-27 | PRESENT; 5 domains, 30 caps, 10 comps, 45 nodes |
| `signal_registry.json` | `total_signals`, `signals[]` → CLM-18..CLM-24 | PRESENT; total_signals=0, signals=[], NOT_EVALUATED |
| `gauge_state.json` | ALL DIM-01..DIM-06 + score + confidence + execution_state → CLM-09..CLM-13, CLM-05..CLM-08 | PRESENT; score=60, projected=100, CONDITIONAL |

### Signal layer dependency (CLM-20..CLM-24)

```
signal_registry.json.signals[SIG-001..SIG-005]
  → vault builder _gen_signal_claim()
  → if signal not found → BLOCKED claim (label retained, value=NOT_AVAILABLE)
  → if signal found → full ZONE-2 claim with business_impact, risk, etc.
```

For second-client: all five signal claims will emit as BLOCKED.
Claim labels (hardcoded BlueEdge names) will appear in vault.

### projection_runtime.py dependencies

```
vault_path / claims / CLM-XX *.md   → resolve_claim()
_find_signal_registry(repo_root, vault_path)
  → searches ONLY run_authoritative_recomputed_01 and run_01_authoritative
  → run_01_oss_fastapi NOT in candidate list
  → returns None for second-client vault
project() / project_set() / export_fragments()
  → run_id default = "run_authoritative_recomputed_01" (hardcoded at 5 locations)
```

---

## 4. SECOND-CLIENT COMPARISON

### Available

| Artifact | Status | Notes |
|---|---|---|
| `gauge_state.json` | PRESENT | score=60, projected=100, CONDITIONAL, S-13 |
| `coverage_state.json` | PRESENT | coverage_percent=100.0, 10 units |
| `reconstruction_state.json` | PRESENT | state=PASS, 4 axes PASS |
| `canonical_topology.json` | PRESENT | 5 domains, 30 caps, 10 comps, 45 nodes |
| `signal_registry.json` | PRESENT (0 signals, NOT_EVALUATED) | Corrected in STEP 10G-R |

### Missing

| Item | Gap | Impact |
|---|---|---|
| SIG-XXX intelligence signals | PiOS 40.5/41.4 not executed for second client | CLM-20..CLM-24 will emit as BLOCKED |
| Second-client signal definitions | No SIG-XXX defs exist for OSS FastAPI | No second-client signal layer |
| `admissibility_log.json` | Not produced for second-client PSEE run | Optional — vault builder fail-open; CLM-05/07/08 will derive from gauge_state.json |

### Not Evaluated

| Item | Status |
|---|---|
| Execution layer (DIM-03 runtime, DIM-04 unknown-space) | NOT_EVALUATED — PiOS runtime not run |
| Intelligence signal computation (40.5/41.4) | NOT_EVALUATED — stream not executed |
| Projection runtime for second-client | NOT_EVALUATED — `_find_signal_registry` and run_id defaults unpatched |

### Contamination Risks

| Risk | Source | Severity |
|---|---|---|
| CLM-20..CLM-24 claim labels contain BlueEdge signal names | `build_evidence_vault.py` lines 496–500, 1624–1671 — hardcoded | MEDIUM — vault files will carry BlueEdge-specific labels in BLOCKED state |
| `_find_signal_registry` BlueEdge run_id candidates | `projection_runtime.py` lines 338–343 | MEDIUM — returns None for second-client; projection signal augmentation silently disabled |
| `run_id` default in `projection_runtime.py` | lines 963, 1037, 1108, 1134, 1189 | MEDIUM — must be overridden explicitly for second-client projections |

---

## 5. GAP LIST (FAIL-CLOSED)

**G1 — Signal claim labels (CLM-20..CLM-24) hardcoded to BlueEdge signal names**

- Location: `scripts/psee/build_evidence_vault.py` lines 496–500; `gen_clm_20..gen_clm_24` (lines 1624–1671)
- Description: Claim labels ("SIG-001 Sensor Bridge Throughput", "SIG-002 Platform Runtime State
  Seven Unknown Dimensions", etc.) are hardcoded strings derived from BlueEdge signal content.
  For second-client vault these will appear as BLOCKED claims with BlueEdge signal names.
- Impact: Vault structurally valid; signal claims semantically contaminated with BlueEdge names.
  Acceptable for internal/structural vault. Not acceptable for client-facing LENS report.
- Resolution path: Requires parameterization of signal claim labels per client,
  OR generic labels ("Signal 1", etc.) when signals=0, OR omission of signal claims
  when NOT_EVALUATED.

**G2 — `projection_runtime.py:_find_signal_registry()` hardcoded to BlueEdge run IDs**

- Location: `scripts/pios/projection_runtime.py` lines 333–347
- Description: Candidates list contains only `run_authoritative_recomputed_01` and
  `run_01_authoritative`. Will return `None` for second-client vault at
  `clients/e65d2f0a-.../vaults/run_01_oss_fastapi/`. Signal augmentation in projection
  claims will be silently disabled.
- Impact: Projection runtime will work for structural claims; signal claims will lack
  registry augmentation. Projection claims CLM-20..CLM-24 unresolvable unless
  `--vault-path` points to a vault where signal claims are BLOCKED.
- Resolution path: Add `run_01_oss_fastapi` to candidates, OR accept `None` return
  and rely on BLOCKED claim state in vault.

**G3 — `projection_runtime.py` `run_id` defaults hardcoded to BlueEdge run**

- Location: `scripts/pios/projection_runtime.py` lines 963, 1037, 1108, 1134, 1189, 1203, 1208
- Description: Default `run_id="run_authoritative_recomputed_01"` at all five public API
  entry points and CLI arg defaults.
- Impact: All projection calls must explicitly pass `--run-id run_01_oss_fastapi`
  for correct `projection_id` hashing. Wrong `run_id` in projection payloads is a
  data integrity defect.
- Resolution path: CLI `--run-id` override is already available; must be used explicitly.
  No code change required for vault build (projection not invoked in vault builder).

---

## 6. DECISION

### Vault Build: **ALLOWED**

**Reason (based on canonical sources only):**

1. All five `REQUIRED_PACKAGE_ARTIFACTS` are present and valid at
   `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`

2. `build_evidence_vault.py` `build_vault_model()` (lines 209–323) will:
   - Load all five artifacts without error
   - Populate VaultModel with correct second-client structural values
   - Iterate `signals_raw.get("signals", [])` → empty list → no crash
   - `total_signals=0`, `conf_dist={}` → valid empty state

3. Signal claims CLM-20..CLM-24 will emit as BLOCKED (lines 1558–1571):
   ```
   status: BLOCKED — signal not present in registry
   ```
   This is the correct governed state when signals are NOT_EVALUATED.
   Vault builder does not crash on missing signals.

4. Structural claims (CLM-01..CLM-17) will be correctly populated from
   second-client artifacts. CLM-18 will show `total_signals=0`. CLM-19 will
   show empty distribution.

5. `--package-dir` override (STEP 10C) is available to point vault builder
   at correct second-client package directory.

**Conditions on vault build (not blocking, but required for STEP 10H):**
- Use `--package-dir clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package`
- Use `--client e65d2f0a-dfa7-4257-9333-fcbb583f0880`
- Use `--run run_01_oss_fastapi`
- Use `--output-dir clients/e65d2f0a-.../vaults/run_01_oss_fastapi`
- G1 (BlueEdge signal names in BLOCKED claims) is a known gap — documented, not blocking
- G2 and G3 are projection-layer gaps — do NOT affect vault build execution

**Projection runtime:** NOT READY for second-client without patching G2 and G3.
Vault build does not invoke `projection_runtime.py`. Projection is deferred.

---

## PRODUCT Brain Summary

**Vault build is authorized for the structural layer.**
Score claims (CLM-09..CLM-12), topology claims (CLM-14..CLM-17), coverage (CLM-01..CLM-02),
and execution layer (CLM-13) will all be correctly populated and evidence-traceable.

Signal claims (CLM-18..CLM-24) will reflect the accurate state:
- CLM-18: 0 governed intelligence signals
- CLM-19: empty distribution
- CLM-20..CLM-24: BLOCKED (signal not evaluated)

The vault is a **structural assessment artifact** — the full commercially differentiated
product requires signal layer execution (NOT_EVALUATED) which is deferred.

---

## PUBLISH Brain Summary

Claims that MUST NOT be produced from this vault:
- Signal confidence claims (SIG-XXX names or values) — no second-client signals exist
- Executive statements referencing signal intelligence findings
- Confidence claims derived from signal layer

Claims that MAY be produced from this vault (after vault is built and validated):
- CLM-09: Proven Structural Score = 60 (ZONE-2 ALLOWED)
- CLM-10: Achievable Score = 100 (ZONE-2 CONDITIONAL with caveat)
- CLM-11: Score Band = CONDITIONAL (ZONE-2 ALLOWED)
- CLM-14..CLM-16: Domain / Capability / Component counts (ZONE-2 ALLOWED)
- CLM-13: Execution Layer Status = NOT_EVALUATED (ZONE-2 ALLOWED)

---

## STEP 10H-R Status

**COMPLETE** — canonical sources retrieved; all four C-items cited with exact paths;
schema extracted; dependency map confirmed; 3 gaps declared; vault build: ALLOWED.
