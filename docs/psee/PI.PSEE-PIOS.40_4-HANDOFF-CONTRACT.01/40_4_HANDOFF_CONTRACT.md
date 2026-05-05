# 40.4 Handoff Contract — PSEE / PiOS Boundary

Stream: PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01  
Status: LOCKED — AUTHORITATIVE  
Generated: 2026-05-05  
Baseline commit: 93098cb  
Branch: work/psee-runtime

---

## 1. PSEE / PiOS Boundary Statement

The boundary between PSEE and PiOS is fixed at the 40.4 handoff layer.

**PSEE owns:** 40.2 → 40.3 → 40.4  
**PiOS owns:** 40.5 → 40.7 → 75.x → 41.x → decision / report

PSEE performs:
- structural scanning and node discovery (40.2)
- topology classification and edge extraction (40.3)
- structural and canonical topology production (40.4)

PiOS performs:
- signal derivation from telemetry (40.5)
- ESI/RAG derivation (40.16, 40.7)
- pressure and narrative generation (75.x, 41.x)

**Violation rule:** PiOS 40.5 MUST NOT read from any path upstream of 40.4. PSEE MUST NOT produce or modify any artifact downstream of 40.4. The 40.4 boundary is non-permeable in both directions.

---

## 2. Current Generic 40.4 Artifact Shape

The generic PiOS pipeline produces six (6) markdown artifacts under `docs/pios/40.4/`:

| File | Content | ST Metrics Present |
|------|---------|-------------------|
| `telemetry_surface_definition.md` | surface schema definition | — |
| `telemetry_schema.md` | metric schema and type definitions | ST definitions |
| `structural_telemetry.md` | structural metric values | ST-007, ST-008, ST-009, ST-010, ST-011, ST-012, ST-013, ST-014, ST-015, ST-016, ST-017, ST-018 |
| `activity_telemetry.md` | activity and runtime metric values | AT-series |
| `delivery_telemetry.md` | delivery metric values | DT-series |
| `telemetry_traceability_map.md` | end-to-end traceability | — |

**Authoritative ST values (productized baseline, FastAPI canonical):**

| Metric | Value | Semantic |
|--------|-------|---------|
| ST-006 | 8 | module count |
| ST-007 | 22 | component count |
| ST-008 | 3 | depth |
| ST-009 | 10 | leaf nodes |
| ST-010 | 28 | entry points |
| ST-011 | 12 | internal interfaces |
| ST-012 | 7 | dependencies |
| ST-013 | 3 | external dependencies |
| ST-014 | 2 | dynamic dependencies |
| ST-015 | 3 | optional dependencies |
| ST-016 | 8 | responsible units |
| ST-022 | 3 | surface exposure count |

These values are read by `scripts/pios/40.5/build_signal_artifacts.py` via STATIC_TELEMETRY constants embedded in the script. They are not re-parsed from the markdown at signal derivation time except through load_40_4_intake.py for AT/DT metrics.

**Source path for generic 40.4:**

```
docs/pios/40.4/structural_telemetry.md
docs/pios/40.4/activity_telemetry.md
docs/pios/40.4/delivery_telemetry.md
docs/pios/40.4/telemetry_surface_definition.md
docs/pios/40.4/telemetry_schema.md
docs/pios/40.4/telemetry_traceability_map.md
```

**Source path for PSEE 40.4:**

```
clients/<client_uuid>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
```

These are two separate schemas. They coexist in the productized baseline. The generic markdown path and the PSEE JSON path are not equivalent and are not interchangeable.

---

## 3. Current 40.5 Consumption Expectations

`scripts/pios/40.5/build_signal_artifacts.py` expects exactly the six markdown files listed in Section 2.

**Consumption pattern:**

- File presence is verified before execution
- ST-XXX values are extracted from `structural_telemetry.md` table rows using structured parsing
- AT-XXX values are extracted from `activity_telemetry.md` via `scripts/pios/40.16/load_40_4_intake.py`
- DT-XXX values are extracted from `delivery_telemetry.md` via `scripts/pios/40.16/load_40_4_intake.py`
- `telemetry_surface_definition.md` and `telemetry_schema.md` provide schema context (not metric values)
- `telemetry_traceability_map.md` provides lineage references

**Signal derivations from 40.4 inputs:**

```
SIG-002 (Dependency Load):    (ST-012 + ST-013 + ST-014 + ST-015) / ST-007
SIG-004 (Structural Volatility): edge_to_node ratio, containment_density, responsibility_distribution, module_surface ratios
SIG-001_structural:            ST-012 / ST-016
```

**Critical finding — STATIC_TELEMETRY constants:**

The ST values in `build_signal_artifacts.py` are hardcoded as STATIC_TELEMETRY dict constants. This means the 40.5 script is currently tied to the productized baseline values. Any change to the markdown artifacts that produces different ST values will create a mismatch between the file content and the embedded constants unless the script is updated.

This is a known coupling. It is NOT modified by this contract. It is documented here as a boundary risk.

**40.5 does NOT consume:**

- `clients/*/psee/runs/*/structure/40.4/canonical_topology.json`
- Any PSEE JSON topology artifacts
- Any run-scoped PSEE outputs

The 40.5 pipeline has no current PSEE input path. This is the gap this contract defines.

---

## 4. Required Handoff Schema

The handoff from 40.4 to 40.5 must support two modes. The consuming layer (40.5) MUST determine mode from a mode_classification signal before reading any 40.4 artifacts.

**Mode classification source:**

```
clients/<client_uuid>/psee/runs/<run_id>/intake/mode_classification.json
```

If `mode_classification.json` is absent or mode field is missing → apply GENERIC_HANDOFF.  
If `mode_classification.json` is present and `psee_mode = PSEE_ELIGIBLE` → apply PSEE_HANDOFF.

**Required handoff fields for GENERIC mode (existing):**

```
docs/pios/40.4/structural_telemetry.md    (REQUIRED)
docs/pios/40.4/activity_telemetry.md      (REQUIRED)
docs/pios/40.4/delivery_telemetry.md      (REQUIRED)
docs/pios/40.4/telemetry_surface_definition.md  (REQUIRED)
docs/pios/40.4/telemetry_schema.md        (REQUIRED)
docs/pios/40.4/telemetry_traceability_map.md    (REQUIRED)
```

**Required handoff fields for PSEE mode (additive):**

```
clients/<client_uuid>/psee/runs/<run_id>/structure/40.4/canonical_topology.json  (REQUIRED)
  → fields: contract_id, client_id, source_id, run_id, stage, generated_at
  → fields: cluster_count (integer, ≥ 0)
  → fields: clusters (array, may be empty in non-PSEE-active runs)

clients/<client_uuid>/psee/runs/<run_id>/binding/binding_model.json              (REQUIRED)
  → provides CEU-to-node relationship mapping
  → required for relational signal computation

clients/<client_uuid>/psee/runs/<run_id>/signals/relational_signal_set.json      (CONDITIONAL)
  → required only if signal_mode = RELATIONAL_EDGE_BASED
  → may be absent if DISTRIBUTION_BASED mode is active
```

**Schema incompatibility note (documented in run_client_pipeline.py):**

> "Native 40.4 canonical_topology uses incompatible cluster_topology schema"

This incompatibility is real. The GENERIC markdown schema and the PSEE JSON cluster schema are not structurally compatible. PiOS 40.5 MUST NOT attempt to derive ST-XXX metrics from canonical_topology.json. ST-XXX metrics originate exclusively from the markdown telemetry path.

The PSEE handoff adds topology structure (CEU graph, cluster classification, relational edges) as a parallel input. It does not replace or override the ST-XXX telemetry path.

---

## 5. GENERIC_HANDOFF Rules

GENERIC_HANDOFF applies when:
- `mode_classification.json` is absent, OR
- `psee_mode` ≠ `PSEE_ELIGIBLE`, OR
- `canonical_topology.json` is absent or has `cluster_count = 0`

Rules:

1. 40.5 reads only `docs/pios/40.4/*.md` — the six markdown files
2. 40.5 uses STATIC_TELEMETRY constants; no parsing override allowed
3. Signal computation proceeds using ST-XXX values from the productized baseline
4. No PSEE artifacts are read, referenced, or consumed
5. Output: `docs/pios/40.5/` signal artifacts using generic derivation
6. The six 40.4 markdown files MUST all be present; if any is missing → FAIL CLOSED
7. No fallback to any PSEE path is permitted in GENERIC_HANDOFF mode
8. IMPORTS count = 0 for FastAPI canonical — signals computed on CONTAINS-only edge set

**Baseline protection:**

GENERIC_HANDOFF is the protected baseline. Its behavior MUST NOT change when PSEE mode is introduced. Any PSEE activation MUST be additive and isolated. The generic pipeline MUST produce the same output regardless of whether PSEE artifacts exist in the repository.

---

## 6. PSEE_HANDOFF Rules

PSEE_HANDOFF applies when ALL of the following are true:
- `mode_classification.json` is present
- `psee_mode = PSEE_ELIGIBLE`
- `canonical_topology.json` is present with `cluster_count > 0`
- `binding_model.json` is present

Rules:

1. 40.5 reads the six markdown files (identical to GENERIC_HANDOFF — required)
2. 40.5 additionally reads `canonical_topology.json` for CEU topology structure
3. 40.5 additionally reads `binding_model.json` for CEU-to-node relationship edges
4. If `signal_mode = RELATIONAL_EDGE_BASED` in mode_classification.json: 40.5 additionally reads `relational_signal_set.json`
5. ST-XXX signal derivation uses the same formula path as GENERIC_HANDOFF — no override
6. PSEE topology data augments the structural context (cluster membership, CEU classification) but does NOT replace ST-XXX derivation
7. PSEE signals (PSIG-XXX) are computed in addition to, not instead of, generic signals (SIG-XXX)
8. PSIG namespace (PSIG-001 through PSIG-004) MUST NOT collide with SIG namespace (SIG-001 through SIG-008)
9. R-PSIG namespace (R-PSIG-001 through R-PSIG-004) is reserved for RELATIONAL_EDGE_BASED mode
10. If `binding_model.json` has `build_binding_convergence_status = BLOCKED_*` → PSEE signal path is blocked; fall back to GENERIC_HANDOFF for signal derivation; document block reason in execution log

**CEU stage gate:**

PSEE_HANDOFF MUST NOT proceed to GOVERNED-level signal computation unless:
- `grounding_state_v3.json` is present with `grounding_ratio ≥ 0.5`
- `intake/mode_classification.json` confirms `AUTHORITATIVE_INTAKE`
- `signals/psig_computation.json` is present (40x.04 contract authorization)

If any CEU stage gate criterion is unmet → PSEE signal computation is BLOCKED.  
If PSEE signal computation is BLOCKED → GENERIC_HANDOFF signal path applies.  
Blocked status MUST be logged. It is NOT a silent fallback.

**Current productized baseline status:**

`canonical_topology.json` has `cluster_count = 0`, `clusters = []` in the productized run.  
This means PSEE_HANDOFF cannot activate on the current productized baseline.  
PSEE_HANDOFF activation is pending `run_blueedge_psee_candidate_01` execution.

---

## 7. Fail-Closed Behavior

The following conditions MUST cause immediate execution halt with explicit error output:

| Condition | Required Action |
|-----------|----------------|
| Any of the 6 generic 40.4 markdown files missing | STOP — report missing file name |
| `structural_telemetry.md` present but ST-XXX table malformed | STOP — report parse failure |
| `canonical_topology.json` present but `cluster_count` field absent | STOP — report schema violation |
| `binding_model.json` present but `relationships` array absent | STOP — report schema violation |
| `mode_classification.json` present with unrecognized `psee_mode` value | STOP — report unknown mode |
| `relational_signal_set.json` referenced but absent when RELATIONAL_EDGE_BASED mode active | STOP — report missing artifact |
| PSEE_HANDOFF attempted when `build_binding_convergence_status` is BLOCKED | STOP — report block reason; apply GENERIC_HANDOFF |
| CEU stage < GOVERNED when PSEE signal computation attempted | STOP — report stage gate failure |
| Signal namespace collision between SIG-XXX and PSIG-XXX | STOP — report collision |
| Any 40.4 artifact modified by the 40.5 process | STOP — report mutation attempt |

**Input guard (existing, preserved):**

`build_telemetry_artifacts.py` enforces `verify_no_input_modification()` which prevents writing to protected input directories. This guard MUST remain active in all PSEE-extended executions.

**No silent fallback permitted.**  
Every blocked or degraded condition MUST produce explicit log output naming the condition, the artifact involved, and the resulting mode applied.

---

## 8. Files Inspected

The following files were read to produce this contract. No files were modified.

**Build scripts:**

| File | Purpose |
|------|---------|
| `scripts/pios/40.4/build_telemetry_artifacts.py` | 40.4 output production; REQUIRED_INPUTS list; input guard |
| `scripts/pios/40.5/build_signal_artifacts.py` | 40.5 consumption; STATIC_TELEMETRY constants; signal derivation formulas |
| `scripts/pios/40.16/load_40_4_intake.py` | AT/DT metric extraction from activity/delivery telemetry |
| `scripts/pios/run_client_pipeline.py` | 9-phase orchestrator; Phase 3 40.4 verification; schema incompatibility note |

**40.4 artifacts (generic pipeline, productized baseline):**

| File | Key Content |
|------|-------------|
| `docs/pios/40.4/structural_telemetry.md` | ST-007=22, ST-008=3, ST-009=10, ST-010=28, ST-011=12, ST-012=7, ST-013=3, ST-014=2, ST-015=3, ST-016=8, ST-017=3 |
| `docs/pios/40.5/signal_input_matrix.md` | Runtime telemetry variables (BlueEdge VAR_SYS, VAR_CACHE, VAR_EVT, etc.) |

**PSEE artifacts (fastapi client, productized baseline):**

| File | Key Content |
|------|-------------|
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json` | cluster_count=0, clusters=[], 0 nodes, 0 edges |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.3/structural_topology_log.json` | 104 CONTAINS edges, 0 IMPORTS edges |
| `clients/fastapi/psee/runs/run_relational_recovery_01/signals/relational_signal_set.json` | R-PSIG-001–004, RELATIONAL_EDGE_BASED, FULLY_ISOLATED, BLOCKED |
| `clients/fastapi/psee/runs/run_relational_recovery_01/binding/binding_model.json` | REL-001/REL-002 OVERLAP_STRUCTURAL, BLOCKED_SIGNAL_SEED_PROVENANCE_MISSING |

**Governance:**

| File | Purpose |
|------|---------|
| `docs/governance/runtime/git_structure_contract.md` | Branch domain ownership; boundary enforcement |

---

## Validation

PASS criteria (as defined in stream contract):

- [x] 40.4→40.5 boundary is explicit (Section 1, Section 3)
- [x] Generic baseline remains untouched (Section 5, Section 7)
- [x] No implementation performed (read-only inspection throughout)
- [x] No old integration branch artifacts used (all files read from current productized baseline 93098cb)

Status: PASS
