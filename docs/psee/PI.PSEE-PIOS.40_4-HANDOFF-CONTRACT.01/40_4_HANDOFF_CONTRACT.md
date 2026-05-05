# 40.4 Handoff Contract — PSEE / PiOS Boundary

Stream: PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.CORRECTION.01  
Corrects: PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01  
Status: LOCKED — AUTHORITATIVE  
Generated: 2026-05-05  
Baseline commit: 93098cb  
Branch: feature/psee-pios-integration-productized

---

## 1. PSEE / PiOS Boundary Statement

The boundary between PSEE and PiOS is fixed at the 40.4 handoff layer.

**PSEE owns:** 40.2 → 40.3 → 40.4  
**PiOS owns:** 40.5 → 40.7 → 75.x → 41.x → decision / report

PSEE performs:
- structural scanning and node discovery (40.2)
- topology classification and edge extraction (40.3)
- canonical topology production and CEU grounding (40.4)

PiOS performs:
- signal derivation from telemetry (40.5) — FIRST LAYER ALLOWED TO COMPUTE SIGNALS
- ESI/RAG derivation (40.16, 40.7)
- pressure and narrative generation (75.x, 41.x)

**Signal ownership rule:**

PSEE does NOT compute signals.  
PSEE provides enriched structural input for PiOS signal derivation.  
PSIG is derived by PiOS when PSEE conditions are met.  
DPSIG is derived by PiOS in generic mode.  
No signal artifact of any kind (SIG-XXX, PSIG-XXX, DPSIG-XXX) belongs to 40.4 or earlier.

**Violation rule:** PiOS 40.5 MUST NOT read from any path upstream of 40.4. PSEE MUST NOT produce or modify any artifact downstream of 40.4. The 40.4 boundary is non-permeable in both directions.

---

## 2. Negative Boundary — Forbidden in 40.4

The following artifact types are INVALID in any 40.4 handoff. Their presence in a 40.4 handoff path constitutes a boundary violation.

**Forbidden artifact classes:**

| Artifact | Reason |
|----------|--------|
| Any `signals/` directory artifact | Signals are PiOS 40.5+ scope |
| `relational_signal_set.json` | Signal artifact — belongs to 40.5+ if implemented |
| `psig_computation.json` | Signal computation result — belongs to 40.5+ |
| Any SIG-XXX valued output | Generic PiOS signal — computed at 40.5 |
| Any PSIG-XXX valued output | PSEE-enriched PiOS signal — computed at 40.5 |
| Any DPSIG-XXX valued output | Distribution-based PiOS signal — computed at 40.5 |
| Any 75.x output | Pressure/narrative layer — downstream of 40.5 |
| Any 41.x output | Projection layer — downstream of 40.5 |
| Any decision or report artifact | Report layer — downstream of 40.5 |

These artifact types must not appear in the 40.4 PSEE handoff schema definition. This constraint applies to contract specification only. It does not mandate file deletion from disk.

---

## 3. Positive Boundary — Allowed in 40.4

The ONLY artifacts permitted in the 40.4 handoff are structural, topological, and readiness indicators. No computed values are allowed.

**Generic path (docs/pios/40.4/):**

| File | Allowed Content |
|------|----------------|
| `structural_telemetry.md` | ST-XXX metric values (topology counts, structural measurements) |
| `activity_telemetry.md` | AT-XXX metric values (activity measurements) |
| `delivery_telemetry.md` | DT-XXX metric values (delivery measurements) |
| `telemetry_surface_definition.md` | Surface schema definition |
| `telemetry_schema.md` | Metric schema and type definitions |
| `telemetry_traceability_map.md` | Lineage and traceability references |

**PSEE path (clients/<client_alias>/psee/runs/<run_id>/):**

| File | Allowed Content |
|------|----------------|
| `structure/40.4/canonical_topology.json` | Topology structure: cluster_count, clusters, nodes, edges — NO signals |
| `ceu/grounding_state_v3.json` | CEU/domain mapping, grounding_ratio, activation_class per CEU — evidence completeness state |
| `dom/dom_layer.json` | Domain layer — selector reference (NOT selector execution) |
| `binding/binding_envelope.json` | CEU-to-node relationship binding — telemetry readiness indicator (NOT signal values) |
| `vault/vault_readiness.json` | Overall PSEE run readiness gate (status: READY / NOT READY) |

All other PSEE run artifacts are downstream of 40.4 and are NOT part of the 40.4 handoff.

---

## 4. Generic 40.4 Artifact Shape

The generic PiOS pipeline produces six (6) markdown artifacts under `docs/pios/40.4/` via `scripts/pios/40.4/build_telemetry_artifacts.py`.

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

These values are consumed by `scripts/pios/40.5/build_signal_artifacts.py` via STATIC_TELEMETRY constants embedded in the script. AT-XXX and DT-XXX values are extracted from their respective markdown files by `scripts/pios/40.16/load_40_4_intake.py`.

**Critical coupling note:**

The ST values in `build_signal_artifacts.py` are hardcoded as STATIC_TELEMETRY dict constants. The 40.5 script is tied to the productized baseline values. Any change to the markdown artifacts that produces different ST values creates a mismatch unless the script is updated. This coupling is a known boundary risk. It is documented here only.

---

## 5. 40.5 Consumption Expectations

`scripts/pios/40.5/build_signal_artifacts.py` reads the six markdown files listed in Section 4.

**Consumption pattern:**

- All six files must be present; absence of any causes STOP
- ST-XXX values extracted from `structural_telemetry.md`
- AT-XXX values extracted from `activity_telemetry.md` via load_40_4_intake.py
- DT-XXX values extracted from `delivery_telemetry.md` via load_40_4_intake.py

**Signal derivations owned by 40.5 (not 40.4):**

```
SIG-002 (Dependency Load):          (ST-012 + ST-013 + ST-014 + ST-015) / ST-007
SIG-004 (Structural Volatility):    edge_to_node ratio, containment_density, responsibility_distribution, module_surface ratios
SIG-001_structural:                 ST-012 / ST-016
```

**40.5 does NOT consume in current productized baseline:**

- `structure/40.4/canonical_topology.json`
- `ceu/grounding_state_v3.json`
- `binding/binding_envelope.json`

These PSEE artifacts are structurally present on disk but have no 40.5 consumption path on the current baseline. The PSEE enrichment path into 40.5 is not yet implemented. This contract defines the intended boundary for when it is.

---

## 6. Mode Selection — How PiOS Determines Handoff Path

No dedicated `mode_classification.json` artifact exists in the productized baseline (confirmed: absent from all canonical run paths). Mode is determined by inspecting existing PSEE artifacts.

**GENERIC_HANDOFF applies when ANY of the following is true:**

- `vault/vault_readiness.json` is absent, OR
- `vault_readiness.json.status` ≠ `READY`, OR
- `structure/40.4/canonical_topology.json` is absent, OR
- `canonical_topology.json.cluster_count` = 0, OR
- `ceu/grounding_state_v3.json` is absent

**PSEE_HANDOFF applies only when ALL of the following are true:**

- `vault/vault_readiness.json` is present with `status = READY`
- `structure/40.4/canonical_topology.json` is present with `cluster_count > 0`
- `ceu/grounding_state_v3.json` is present with `validation_status = PASS`
- `ceu/grounding_state_v3.json.grounding_ratio` ≥ 0.5
- `binding/binding_envelope.json` is present

**Current productized baseline (FastAPI, run_02_oss_fastapi_pipeline):**

| Check | Value | Result |
|-------|-------|--------|
| vault_readiness.status | READY | PASS |
| canonical_topology.cluster_count | 0 | FAIL → GENERIC_HANDOFF |
| grounding_state_v3.grounding_ratio | 0.9 | PASS |
| grounding_state_v3.validation_status | PASS | PASS |

**Result: GENERIC_HANDOFF applies on current productized baseline.**  
PSEE_HANDOFF cannot activate until `canonical_topology.cluster_count > 0`, which requires PSEE pipeline execution on a qualified run (pending `run_blueedge_psee_candidate_01`).

---

## 7. GENERIC_HANDOFF Rules

Applies when mode selection (Section 6) determines GENERIC_HANDOFF.

1. 40.5 reads only `docs/pios/40.4/*.md` — the six markdown files
2. 40.5 uses STATIC_TELEMETRY constants; no dynamic parsing override
3. Signal derivation proceeds on CONTAINS-only edge set (IMPORTS = 0 for FastAPI canonical)
4. No PSEE artifacts are read, referenced, or consumed
5. Output: `docs/pios/40.5/` signal artifacts using generic derivation
6. All six markdown files MUST be present; if any is missing → FAIL CLOSED
7. No fallback to any PSEE artifact path is permitted within GENERIC_HANDOFF

**Baseline protection:**

GENERIC_HANDOFF is the protected baseline. Its behavior MUST NOT change when PSEE mode is introduced. Any PSEE activation MUST be additive and isolated. The generic pipeline MUST produce identical output regardless of whether PSEE artifacts exist in the repository.

---

## 8. PSEE_HANDOFF Rules

Applies when ALL mode selection criteria in Section 6 are met.

**Allowed PSEE inputs to 40.5 (additive, not replacing):**

1. The six generic markdown files remain REQUIRED — same as GENERIC_HANDOFF
2. Additionally read: `structure/40.4/canonical_topology.json` — for CEU cluster topology structure
3. Additionally read: `ceu/grounding_state_v3.json` — for CEU membership and activation_class per CEU
4. Additionally read: `binding/binding_envelope.json` — for CEU-to-node relationship mapping

**Ownership rule for signal derivation under PSEE_HANDOFF:**

- ST-XXX signal derivation (SIG-001 through SIG-008) uses the SAME formula path as GENERIC_HANDOFF — no override
- PSEE topology data (cluster membership, CEU classification) provides structural enrichment context for 40.5 to derive PSIG-XXX signals
- PSIG-XXX signals are derived by PiOS 40.5 using the PSEE topology as input — PSEE does not pre-compute these
- PSIG namespace MUST NOT collide with SIG namespace

**CEU stage gate:**

PSEE_HANDOFF MUST NOT proceed to PSIG derivation unless:

- `grounding_state_v3.json.grounding_ratio` ≥ 0.5
- `grounding_state_v3.json.validation_status` = PASS
- `psig_computation.json` authorization contract has been issued (40x.04 — not yet issued; this is Blocking Point BP-01)

If the CEU stage gate is unmet → PSIG derivation is BLOCKED.  
If BLOCKED → ST-based generic signal derivation continues (SIG-XXX only).  
BLOCKED status MUST be logged explicitly. It is NOT a silent fallback.

---

## 9. Fail-Closed Behavior

The following conditions MUST cause immediate execution halt with explicit error output.

| Condition | Required Action |
|-----------|----------------|
| Any of the 6 generic 40.4 markdown files missing | STOP — report missing file name |
| `structural_telemetry.md` present but ST-XXX table malformed | STOP — report parse failure |
| `canonical_topology.json` present but `cluster_count` field absent | STOP — report schema violation |
| `grounding_state_v3.json` present but `grounding_ratio` field absent | STOP — report schema violation |
| `binding/binding_envelope.json` present but `nodes` array absent | STOP — report schema violation |
| `vault_readiness.json` status = NOT READY when PSEE_HANDOFF attempted | STOP — report readiness gate failure |
| PSIG derivation attempted without 40x.04 psig_computation authorization | STOP — report BP-01 blocking point |
| Signal namespace collision between SIG-XXX and PSIG-XXX | STOP — report collision |
| Any 40.4 artifact modified by the 40.5 process | STOP — report mutation attempt |
| Any signal artifact found in 40.4 path | STOP — report boundary violation |

**Input guard (existing, preserved):**

`build_telemetry_artifacts.py` enforces `verify_no_input_modification()`. This guard MUST remain active in all PSEE-extended executions.

**No silent fallback permitted.**  
Every blocked or degraded condition MUST produce explicit log output naming the condition, the artifact, and the resulting mode applied.

---

## 10. Files Inspected

The following files were read to produce this contract. No files were modified.

**Build scripts (productized baseline):**

| File | Purpose |
|------|---------|
| `scripts/pios/40.4/build_telemetry_artifacts.py` | 40.4 output production; REQUIRED_INPUTS; input guard |
| `scripts/pios/40.5/build_signal_artifacts.py` | 40.5 consumption; STATIC_TELEMETRY constants; signal derivation formulas |
| `scripts/pios/40.16/load_40_4_intake.py` | AT/DT metric extraction from activity/delivery telemetry |
| `scripts/pios/run_client_pipeline.py` | 9-phase orchestrator; Phase 3 verification; schema incompatibility note |

**Generic 40.4 artifacts (productized baseline):**

| File | Key Content |
|------|-------------|
| `docs/pios/40.4/structural_telemetry.md` | ST-007=22 through ST-022=3 canonical values |

**PSEE artifacts (FastAPI client, productized baseline run_02_oss_fastapi_pipeline):**

| File | Key Content |
|------|-------------|
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json` | cluster_count=0 — PSEE_HANDOFF not active |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/ceu/grounding_state_v3.json` | grounding_ratio=0.9, validation_status=PASS, 10 CEUs |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json` | CEU-to-node bindings, client_alias=fastapi |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/vault_readiness.json` | status=READY, 9 checks PASS |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/intake_manifest.json` | contract_id=PI.LENS.SOURCE-INTAKE.GENERIC.01 |

**Governance:**

| File | Purpose |
|------|---------|
| `docs/governance/runtime/git_structure_contract.md` | Branch domain ownership; boundary enforcement |

---

## Validation

PASS criteria (as defined in correction stream contract):

- [x] 40.4 contains ZERO signal artifacts (Section 2 — negative boundary explicit)
- [x] Signal derivation clearly starts at 40.5 (Sections 1, 5, 8 — ownership rule stated)
- [x] No prototype or recovery artifacts referenced (run_relational_recovery_01 removed; UUID client removed)
- [x] No ambiguity between PSEE and PiOS ownership (Section 1 signal ownership rule)
- [x] Generic pipeline unchanged (Sections 4, 7 — baseline protection preserved)
- [x] Mode classification path corrected to evidence-based determination (Section 6 — no invented path)

Status: PASS
