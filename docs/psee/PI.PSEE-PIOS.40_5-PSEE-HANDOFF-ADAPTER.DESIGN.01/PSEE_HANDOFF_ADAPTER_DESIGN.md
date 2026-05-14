# PSEE Handoff Adapter — Design Specification

Stream: PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01  
Status: LOCKED — AUTHORITATIVE DESIGN  
Generated: 2026-05-06  
Baseline commit: 93098cb  
Branch: feature/psee-pios-integration-productized  

Upstream contracts:
- Boundary contract: PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.CORRECTION.01 (2705bca)
- Consumption verification: PI.PSEE-PIOS.40_5-CONSUMPTION-VERIFICATION.01 (cd009b9)

Downstream handoff:
- PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01

---

## 1. Executive Verdict

The PSEE handoff adapter is a sidecar extraction component. It does not modify, replace, or extend the existing 40.5 generic execution path. It does not compute signals.

The adapter reads PSEE 40.4 artifacts, validates eligibility, extracts topology quantities (ST-030..035), and writes a single sidecar artifact at a neutral path outside both `docs/pios/40.4/` and `docs/pios/40.5/`. The generic 40.5 path (`docs/pios/40.4/*.md → docs/pios/40.5/*.md`) continues to run unchanged in all conditions. When the sidecar is present and readiness is READY, PiOS 40.5 may optionally consume it for PSIG derivation. When the sidecar is absent, malformed, or NOT_READY, the generic path is the only active path.

The adapter is the bridge between PSEE structural topology and PiOS signal computation authority. It extracts but does not interpret. It measures but does not derive. Signal derivation from sidecar contents belongs exclusively to PiOS 40.5 under a future authorized contract.

---

## 2. Adapter Boundary and Location

### Position in the execution chain:

```
PSEE 40.2 → 40.3 → 40.4         (PSEE owned — unchanged)
                ↓
     [ PSEE handoff artifacts ]   (PSEE outputs; read-only to adapter)
                ↓
     [ PSEE HANDOFF ADAPTER ]     ← this component
                ↓
     artifacts/psee_handoff/      (sidecar — neutral territory)
                ↓
PiOS 40.5 signal derivation       (PiOS owned — optionally reads sidecar)
```

### Generic path (unchanged, always active):

```
docs/pios/40.4/*.md
        ↓
scripts/pios/40.5/build_signal_artifacts.py
        ↓
docs/pios/40.5/*.md
```

These two paths are parallel, not sequential. The sidecar path does not gate or delay the generic path. The generic path has no dependency on the sidecar.

### Adapter location:

The adapter is a new standalone script. It is NOT part of `scripts/pios/40.5/`. It is NOT called by `run_client_pipeline.py` in the current design. It is invoked explicitly on a per-run basis when PSEE_HANDOFF mode is intended.

**Proposed script path:** `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py`

This path is in a new `psee_handoff/` directory within `scripts/pios/`, explicitly separated from `40.5/`.

---

## 3. Allowed Inputs

The adapter may read ONLY the following PSEE 40.4 artifacts. All reads are read-only.

| Artifact | Path Pattern | Purpose | Required |
|----------|-------------|---------|---------|
| `canonical_topology.json` | `clients/<client>/psee/runs/<run_id>/structure/40.4/` | Cluster count; PSEE activation state | REQUIRED |
| `grounding_state_v3.json` | `clients/<client>/psee/runs/<run_id>/ceu/` | CEU grounding ratio; total CEU; validation status; activation_class per CEU | REQUIRED |
| `binding_envelope.json` | `clients/<client>/psee/runs/<run_id>/binding/` | Full node + edge topology; ST-030..035 extraction source | REQUIRED |
| `vault_readiness.json` | `clients/<client>/psee/runs/<run_id>/vault/` | Overall run readiness gate | REQUIRED |
| `dom_layer.json` | `clients/<client>/psee/runs/<run_id>/dom/` | Domain context labels for cross-domain edge resolution | CONDITIONAL — required only if ST-032 computation is attempted |

**Selector reference (if present):**

If `clients/<client>/psee/signal_selection.json` exists, the adapter reads it to populate `selector_summary`. Reading it is conditional and non-blocking. Absence is not a failure.

**No other paths are permitted.** The adapter MUST NOT open any path outside:
- `clients/<client>/psee/runs/<run_id>/` (run-scoped artifacts above)
- `clients/<client>/psee/signal_selection.json` (client-level selector)
- `docs/governance/runtime/git_structure_contract.md` (contract load only)

---

## 4. Forbidden Inputs

The adapter MUST reject or refuse to read the following artifact classes. If any of these are present in the run directory, they are invisible to the adapter.

| Forbidden Artifact | Reason |
|-------------------|--------|
| `signals/*` (any file under a signals/ directory) | Signal artifacts — belong to 40.5+ scope; PSEE does not own signals |
| `psig_computation.json` | Signal computation result — 40.5+ scope |
| `relational_signal_set.json` | Signal artifact from prototype run — excluded per boundary contract |
| Any `75.x/*` artifact | Pressure/narrative layer — downstream of 40.5 |
| Any `41.x/*` artifact | Projection layer — downstream of 40.5 |
| Any `intake/mode_classification.json` | Does not exist; any future file of this name must not be treated as authoritative |
| UUID experimental run artifacts (`e65d2f0a-*`) | Non-canonical; excluded by boundary contract |
| `run_relational_recovery_01/*` | Prototype/recovery run — excluded by boundary contract |
| Any report-level artifact | Downstream of 40.5 |
| `docs/pios/40.4/*.md` | Generic telemetry path — belongs to generic pipeline only; adapter must not read it |
| `docs/pios/40.5/*.md` | 40.5 output artifacts — must not be read by adapter |

---

## 5. Sidecar Output Schema

### Output path:

```
artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json
```

`artifacts/` is a new neutral root directory outside `docs/`, `clients/`, `app/`, and `scripts/`. It is not protected by existing input guards.

### Full schema definition:

```json
{
  "schema_version": "1.0",
  "stream": "PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01",
  "generated_at": "<ISO 8601 timestamp>",

  "client": "<client alias>",
  "run_id": "<run identifier>",
  "handoff_mode": "PSEE_HANDOFF | GENERIC_HANDOFF",
  "readiness": "READY | NOT_READY",
  "disable_reason": "<string | null>",

  "source_artifacts": {
    "canonical_topology": { "path": "<relative path>", "present": true | false },
    "grounding_state_v3": { "path": "<relative path>", "present": true | false },
    "binding_envelope":   { "path": "<relative path>", "present": true | false },
    "vault_readiness":    { "path": "<relative path>", "present": true | false },
    "dom_layer":          { "path": "<relative path>", "present": true | false },
    "signal_selection":   { "path": "<relative path>", "present": true | false }
  },

  "topology_summary": {
    "cluster_count": <integer | null>,
    "psee_stage": "<stage string | null>",
    "psee_activated": true | false
  },

  "ceu_summary": {
    "total_ceu": <integer | null>,
    "grounded_count": <integer | null>,
    "ungrounded_count": <integer | null>,
    "grounding_ratio": <float | null>,
    "grounding_ratio_pass": true | false,
    "validation_status": "<PASS | FAIL | null>"
  },

  "evidence_summary": {
    "intake_mode": "<value from intake_manifest.mode | null>",
    "authoritative_intake": true | false,
    "vault_status": "<READY | NOT READY | null>"
  },

  "binding_summary": {
    "node_count": <integer | null>,
    "edge_count": <integer | null>,
    "capability_surface_count": <integer | null>,
    "st_030_max_fan_in": <integer | null>,
    "st_031_max_fan_out": <integer | null>,
    "st_032_cross_domain_edge_count": <integer | null>,
    "st_033_max_responsibility_surface": <integer | null>,
    "st_034_total_interface_surface": <integer | null>,
    "st_035_structural_cluster_count": <integer | null>,
    "extraction_status": "COMPLETE | PARTIAL | BLOCKED"
  },

  "selector_summary": {
    "selector_present": true | false,
    "eligible_signal_groups": ["<group name>"],
    "eligible_signal_count": <integer>,
    "blocked_signals": [
      { "signal_id": "<PSIG-XXX>", "block_reason": "<string>" }
    ]
  }
}
```

### Field rules:

1. `handoff_mode` is `PSEE_HANDOFF` only when all eligibility conditions (Section 6) are met. Otherwise `GENERIC_HANDOFF`.
2. `readiness` is `READY` only when `handoff_mode = PSEE_HANDOFF` AND all required extraction fields are non-null.
3. `disable_reason` is null when `readiness = READY`. Must be populated when `readiness = NOT_READY`.
4. All `binding_summary` ST fields (st_030..st_035) are null when extraction fails or input is absent.
5. `eligible_signal_count` is 0 when selector is absent; groups default to empty array.
6. No field in this schema carries a computed signal value. All fields are telemetry primitives, counts, ratios, or status flags.

### Forbidden fields (must never appear in psee_40_5_input.json):

- `psig_001_value`, `psig_002_value`, ... (any PSIG computed value)
- `dpsig_001_value`, ... (any DPSIG computed value)
- `sig_001_value`, ... (any SIG computed value)
- `condition`, `diagnosis`, `pressure_zone`, `decision`
- `signal_value`, `signal_score`, `threshold`

---

## 6. Eligibility Rules

### Conditions for `handoff_mode = PSEE_HANDOFF`:

All of the following must be true simultaneously:

| # | Condition | Source Field |
|---|-----------|-------------|
| E-01 | `vault_readiness.json` present | `source_artifacts.vault_readiness.present = true` |
| E-02 | `vault_readiness.status = READY` | `evidence_summary.vault_status = READY` |
| E-03 | `canonical_topology.json` present | `source_artifacts.canonical_topology.present = true` |
| E-04 | `canonical_topology.cluster_count > 0` | `topology_summary.cluster_count > 0` |
| E-05 | `grounding_state_v3.json` present | `source_artifacts.grounding_state_v3.present = true` |
| E-06 | `grounding_state_v3.validation_status = PASS` | `ceu_summary.validation_status = PASS` |
| E-07 | `grounding_state_v3.grounding_ratio ≥ 0.5` | `ceu_summary.grounding_ratio_pass = true` |
| E-08 | `binding_envelope.json` present | `source_artifacts.binding_envelope.present = true` |
| E-09 | `binding_envelope` node_count > 0 | `binding_summary.node_count > 0` |
| E-10 | `binding_envelope` edge_count > 0 | `binding_summary.edge_count > 0` |

If any of E-01 through E-10 is false → `handoff_mode = GENERIC_HANDOFF`, `readiness = NOT_READY`.

### Conditions for `readiness = READY` (requires `PSEE_HANDOFF`):

- All E-01..E-10 met (above)
- `binding_summary.extraction_status = COMPLETE` — all six ST-030..035 fields are non-null
- `binding_summary.st_030_max_fan_in` is non-null
- `binding_summary.st_031_max_fan_out` is non-null

ST-032..035 are CONDITIONAL: if `dom_layer.json` is absent, ST-032 may be null and extraction_status may be `PARTIAL`. A `PARTIAL` extraction may still allow `READY` if ST-030 and ST-031 are present (minimum viable PSIG derivation set).

### Conditions for PSIG derivation eligibility by PiOS 40.5:

PiOS 40.5 may attempt PSIG derivation when:
1. `psee_40_5_input.json` is present at the expected path
2. `readiness = READY`
3. `handoff_mode = PSEE_HANDOFF`
4. `selector_summary.eligible_signal_count > 0`
5. `psig_computation.json` authorization contract has been issued (40x.04 — Blocking Point BP-01; not yet issued)

**BP-01 is a hard gate.** Without psig_computation.json authorization, PSIG derivation is blocked regardless of sidecar readiness. The adapter documents this state; it does not enforce it (BP-01 enforcement belongs to the 40.5 signal computation engine).

---

## 7. Fail-Closed Behavior

The adapter is fail-closed on all error conditions.

| Condition | Adapter Behavior | disable_reason |
|-----------|-----------------|----------------|
| `vault_readiness.json` absent | Write sidecar with `readiness=NOT_READY` | `VAULT_READINESS_MISSING` |
| `vault_readiness.status ≠ READY` | Write sidecar with `readiness=NOT_READY` | `VAULT_NOT_READY` |
| `canonical_topology.json` absent | Write sidecar with `readiness=NOT_READY` | `CANONICAL_TOPOLOGY_MISSING` |
| `canonical_topology.cluster_count = 0` | Write sidecar with `readiness=NOT_READY` | `PSEE_NOT_ACTIVATED` |
| `canonical_topology.cluster_count` field absent | Write sidecar with `readiness=NOT_READY` | `CANONICAL_TOPOLOGY_SCHEMA_VIOLATION` |
| `grounding_state_v3.json` absent | Write sidecar with `readiness=NOT_READY` | `GROUNDING_STATE_MISSING` |
| `grounding_state_v3.grounding_ratio < 0.5` | Write sidecar with `readiness=NOT_READY` | `CEU_GROUNDING_INSUFFICIENT` |
| `grounding_state_v3.validation_status ≠ PASS` | Write sidecar with `readiness=NOT_READY` | `GROUNDING_VALIDATION_FAILED` |
| `binding_envelope.json` absent | Write sidecar with `readiness=NOT_READY` | `BINDING_ENVELOPE_MISSING` |
| `binding_envelope` node_count = 0 | Write sidecar with `readiness=NOT_READY` | `BINDING_ENVELOPE_EMPTY` |
| `binding_envelope` malformed (required fields absent) | Write sidecar with `readiness=NOT_READY` | `BINDING_ENVELOPE_SCHEMA_VIOLATION` |
| ST-030..035 extraction fails | `extraction_status=PARTIAL` or `BLOCKED`; `readiness=NOT_READY` if ST-030/031 null | `ST_EXTRACTION_FAILED` |
| Forbidden artifact detected in input path | STOP — do not write sidecar; log violation | N/A — hard stop |
| Client path resolves inside `docs/pios/` | STOP — input guard violation | N/A — hard stop |

**No silent degradation.** Every failure must produce an explicit sidecar with `readiness=NOT_READY` and a populated `disable_reason`, or a hard stop log if the error is a contract violation (forbidden artifact access).

**Generic path unaffected.** The adapter never touches `docs/pios/40.4/` or `docs/pios/40.5/`. Even a hard stop does not interrupt the generic path.

---

## 8. Generic Preservation Rules

The following rules govern that the existing generic 40.5 path remains permanently untouched.

**Rule G-01:** `scripts/pios/40.5/build_signal_artifacts.py` MUST NOT be modified by the adapter implementation. Its `REQUIRED_INPUTS` list, `STATIC_TELEMETRY` constants, `INPUT_40_4` path, and `PROTECTED_INPUT_DIRS` must remain exactly as currently written.

**Rule G-02:** `docs/pios/40.4/*.md` (all 18 files) MUST NOT be modified, augmented, or written to by the adapter. The adapter's input guard must enforce that no output path resolves inside `docs/pios/40.4/`.

**Rule G-03:** `docs/pios/40.5/*.md` (all 11 files) MUST NOT be modified, augmented, or written to by the adapter.

**Rule G-04:** The sidecar output path `artifacts/psee_handoff/` is neutral and external to all protected directories. It must not be added to `PROTECTED_INPUT_DIRS` in `build_signal_artifacts.py`.

**Rule G-05:** The generic path executes without consulting the sidecar. `build_signal_artifacts.py` does not check for `psee_40_5_input.json`. If PSIG derivation is required, it is a separate execution step that reads the sidecar independently.

**Rule G-06:** `run_client_pipeline.py` MUST NOT be modified by the adapter implementation. Pipeline invocation of the sidecar builder, if ever required, is defined in a separate pipeline integration contract.

**Rule G-07:** The sidecar is optional at all times. Its absence is not an error from the perspective of the generic pipeline.

**Diagram:**

```
Generic path (always active, never modified):
  docs/pios/40.4/*.md  →  build_signal_artifacts.py  →  docs/pios/40.5/*.md

PSEE sidecar path (optional, additive):
  PSEE run artifacts  →  build_psee_handoff_sidecar.py  →  artifacts/psee_handoff/.../psee_40_5_input.json
                                                                          ↓
                                               PiOS 40.5 PSIG derivation (future contract)
```

---

## 9. Future Implementation Boundary

### Files the implementation MAY create or write to:

| Path | Action |
|------|--------|
| `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py` | CREATE — new script only |
| `scripts/pios/psee_handoff/__init__.py` | CREATE — if needed for module structure |
| `artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json` | CREATE per run — sidecar output |
| `docs/psee/PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01/` | CREATE — stream execution artifacts |

### Files the implementation MUST NOT touch:

| Path | Reason |
|------|--------|
| `scripts/pios/40.5/build_signal_artifacts.py` | Generic path — protected by Rule G-01 |
| `scripts/pios/40.5/validate_signal_artifacts.py` | Locked governance artifact |
| `scripts/pios/run_client_pipeline.py` | Pipeline orchestrator — protected by Rule G-06 |
| `docs/pios/40.4/*.md` (all files) | Generic telemetry artifacts — protected by Rule G-02 |
| `docs/pios/40.5/*.md` (all files) | 40.5 output artifacts — protected by Rule G-03 |
| `clients/<client>/psee/runs/<run_id>/*` | PSEE run artifacts — read-only to adapter |
| `docs/psee/PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01/40_4_HANDOFF_CONTRACT.md` | Locked boundary contract |
| `docs/psee/PI.PSEE-PIOS.40_5-CONSUMPTION-VERIFICATION.01/40_5_CONSUMPTION_REPORT.md` | Locked verification report |

### Files the implementation MUST NOT create:

- Any file inside `docs/pios/40.4/`
- Any file inside `docs/pios/40.5/`
- Any signal artifact (PSIG-XXX, SIG-XXX, DPSIG-XXX values)
- `psig_computation.json` (requires 40x.04 contract, not this implementation)

---

## 10. Next Contract Recommendation

**Recommended next contract:** PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01

### Scope definition for that contract:

Implement `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py` that:

1. Accepts `--client <alias>` and `--run-id <run_id>` as arguments
2. Resolves all allowed input paths from Section 3 of this design
3. Validates eligibility conditions E-01..E-10 from Section 6
4. If eligibility fails at any gate, writes sidecar with `readiness=NOT_READY` and populated `disable_reason`; exits with non-zero status
5. If eligibility passes, executes ST-030..035 extraction from `binding_envelope.json`:
   - ST-030: traverse all edges, count incoming edges per `to_node`, take max
   - ST-031: traverse all edges, count outgoing edges per `from_node`, take max
   - ST-032: count edges with `edge_type = OVERLAP_STRUCTURAL` where from/to domain contexts differ (requires `dom_layer.json`; null if absent)
   - ST-033: group nodes by `provenance.parent_ceu` for capability_surface nodes, take max count
   - ST-034: count all nodes of type `capability_surface`
   - ST-035: BFS/DFS connected components on undirected graph of all edges
6. Populates all sidecar fields per the schema in Section 5
7. Writes `artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json`
8. Writes stream execution artifacts to `docs/psee/PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01/`

**Strict scope limits for that contract:**
- No modification to any file in `scripts/pios/40.5/` or `scripts/pios/run_client_pipeline.py`
- No modification to any `docs/pios/40.4/` or `docs/pios/40.5/` artifact
- No computation of any PSIG value
- No psig_computation.json creation

**What that contract does NOT cover (deferred):**
- 40.5 consumption of the sidecar (separate contract: PI.PSEE-PIOS.40_5-PSIG-DERIVATION.01)
- Pipeline integration of sidecar builder into run_client_pipeline.py phases
- psig_computation.json authorization (40x.04 contract — BP-01)
- Selector execution from signal_selection.json

---

## 11. Validation

PASS criteria:

- [x] Adapter is sidecar-only — output path `artifacts/psee_handoff/` is external to all protected directories (Sections 2, 8)
- [x] Generic path remains untouched — Rules G-01..G-07 explicitly prohibit all modifications (Section 8)
- [x] No signals produced by adapter — schema explicitly forbids signal values; forbidden fields listed in Section 5 (Section 5)
- [x] No existing artifacts mutated — Section 9 lists all files implementation must not touch
- [x] PSEE remains 40.2→40.4 only — adapter reads PSEE outputs but PSEE boundary is unchanged (Section 2)
- [x] PiOS remains 40.5+ — PSIG derivation deferred to future contract; adapter is pre-40.5 extraction only (Section 6)
- [x] Failure behavior is fail-closed — every failure condition produces NOT_READY sidecar or hard stop (Section 7)
- [x] No implementation performed — design document only; no code written; no artifacts mutated

Status: PASS
