# Pipeline Execution Manifest — Canonical Execution Perimeter Contract

Stream: PI.PSEE-PIOS.PIPELINE-EXECUTION-MANIFEST.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: D (governance — no Lane A impact)  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Advances Lane D target: YES — freezes execution perimeter for DPSIG implementation family  

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.LANE-GOVERNANCE-LOCK.01/LANE_GOVERNANCE_LOCK.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-GOVERNANCE-EXPLORATION.CLOSURE.01/SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md`
- `docs/psee/PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.01/DETERMINISTIC_RELATIONAL_ENRICHMENT.md`
- `docs/psee/PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01/DPSIG_RUNTIME_NORMALIZATION.md`
- Baseline commit: `93098cb`

Machine-readable manifest:
- `docs/governance/pipeline_execution_manifest.json`

---

## 1. Executive Summary

This document freezes the execution perimeter for the PSEE ↔ PiOS implementation family.

Before this manifest, every implementation stream that entered the codebase risked:
- **Runtime rediscovery** — spending execution time traversing the pipeline to re-learn what it does
- **Perimeter drift** — reading artifacts not relevant to the contract, writing to unauthorized paths
- **Lane collapse** — confusing Lane A active runtime with Lane B reference artifacts or Lane C prototypes
- **Repository archaeology** — performing exploratory traversal as a precondition for implementation

After this manifest, every implementation stream has a machine-readable contract that states exactly:
- which artifacts it may read
- which artifacts it may write
- which patterns are forbidden
- which constraints are immutable
- which execution mode it operates in

Implementation streams do not discover. They execute.

---

## 2. Canonical Execution Baseline

**Baseline commit: `93098cb`**  
`[CLOSE] Formalize LENS real E2E pipeline execution baseline`

This commit is the frozen execution root for all future streams in the PSEE ↔ PiOS family. It represents:
- The productized generic runtime in its proven, runnable state
- The canonical FastAPI run_02 artifacts as the deterministic replay fixture
- The Lane A pipeline execution order (binding_envelope → 75.x → 41.x → vault → LENS)
- The active signal namespace (PSIG-001/002/004/006) at its productized values

No stream may claim authority over any runtime state that predates `93098cb` without an explicit rebaseline contract.

**Authoritative runtime class**: Lane A — Active Productized Generic Runtime  
**Authoritative execution family**: 40.x → 75.x → 41.x → vault  
**Authoritative sovereignty model**: 75.x activation is sovereign; THRESHOLD=2.0 is locked; RUN_RELATIVE_OUTLIER is locked

---

## 3. Lane Governance Model

The four-lane model is frozen as of `93098cb`. Lane status is not re-derived on each stream — it is read from this manifest.

### Lane A — Active Productized Generic Runtime

**Status: ACTIVE — only production-sovereign runtime**

Lane A is the only currently executing signal pipeline. It must remain runnable at all times.

| Property | Value |
|----------|-------|
| Execution root | `clients/<client>/psee/runs/<run_id>/binding/binding_envelope.json` |
| Activation layer | `scripts/pios/75x/` (3 scripts) |
| Projection layer | `scripts/pios/41x/compute_signal_projection.py` |
| Signal output | `vault/signal_registry.json` |
| Report output | `clients/<client>/reports/` |
| Threshold | `THRESHOLD=2.0` — IMMUTABLE |
| Activation method | `RUN_RELATIVE_OUTLIER` — IMMUTABLE |
| Active signals | PSIG-001=2.32, PSIG-002=6.96, PSIG-004=1.0, PSIG-006=0.2 (FastAPI fixture) |

Protected artifacts — must not be modified without explicit Lane A contract:
- `scripts/pios/75x/compute_condition_correlation.py`
- `scripts/pios/75x/compute_pressure_candidates.py`
- `scripts/pios/75x/compute_pressure_zones.py`
- `scripts/pios/41x/compute_signal_projection.py`
- `scripts/pios/run_client_pipeline.py`
- `scripts/pios/run_end_to_end.py`
- `scripts/pios/lens_report_generator.py`

**Namespace debt**: The PSIG-XXX labels in Lane A denote generic distribution signals — not PSEE-enriched signals. In the target architecture (Lane D), these belong to the DPSIG namespace. This naming debt is acknowledged and documented. `PSIG(LANE_A) ≠ PSIG(LANE_D)`.

### Lane B — Legacy Static Markdown Reference

**Status: INACTIVE_REFERENCE — valid reference, not a runtime**

Lane B contains historical signal specifications from `run_01_blueedge`. Its scripts (`build_signal_artifacts.py`, `validate_signal_artifacts.py`) are not invoked by the productized pipeline. Lane B artifacts may be read for design reference. They may not be treated as active computation paths.

### Lane C — Relational Forensic Prototype

**Status: BLOCKED_ISOLATED — forensic artifacts only**

Lane C (`run_relational_recovery_01/`, R-PSIG-001..004) is fully isolated. No Lane C artifact may appear in any implementation contract. There is no direct C→A promotion path; any promotion must pass through Lane B first.

### Lane D — Target Consolidated Architecture

**Status: GOVERNED_DESIGN — additive DPSIG streams authorized; semantic activation BLOCKED**

Lane D is the convergence architecture. DPSIG additive derivation (Class 4 first) is approved. Semantic activation authority remains BLOCKED until reopen conditions R-01..R-05 are met (defined in SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md Section 10).

Five blocking points (BP-01..BP-05) prevent full Lane D activation. The DPSIG additive model does not require any blocking point resolution — it operates alongside Lane A without modifying it.

---

## 4. Execution Perimeter Model

The execution perimeter defines what implementation streams may and may not access. It exists to prevent:

| Risk | How the Perimeter Prevents It |
|------|-------------------------------|
| Runtime rediscovery | Implementation mode is bounded — no traversal of undeclared artifacts |
| Lane collapse | Lane A protected artifacts are explicitly named and frozen |
| Activation sovereignty breach | THRESHOLD and RUN_RELATIVE_OUTLIER are immutable constraints |
| Client-specific coupling | IFR-06 mandates topology-native, client-agnostic implementations |
| Replay non-determinism | IFR-07 mandates replay verification (overall_verdict=IDENTICAL) |
| Unauthorized path writes | ALLOWED_WRITES is explicit and bounded |

The perimeter has three enforcement layers:
1. **Allowed reads** — bounded set of artifact patterns implementation may access
2. **Allowed writes** — bounded set of artifact patterns implementation may produce
3. **Forbidden patterns** — classified by severity (CRITICAL / HIGH / MEDIUM)

---

## 5. Machine-Readable Read Contract

Implementation streams in the DPSIG family are authorized to read ONLY the following surfaces.

**Tier 1 — Runtime Topology Inputs:**

| Artifact | Pattern | Authorized For |
|----------|---------|---------------|
| `canonical_topology.json` | `clients/<client>/psee/runs/<run_id>/structure/40.4/` | DPSIG Class 4 — cluster topology |
| `binding_envelope.json` | `clients/<client>/psee/runs/<run_id>/binding/` | DPSIG Class 1/5 (deferred); LENS |
| `structural_topology_log.json` | `clients/<client>/psee/runs/<run_id>/structure/40.3/` | DPSIG Class 2/6/7 (deferred) |
| `grounding_state_v3.json` | `clients/<client>/psee/runs/<run_id>/ceu/` | DPSIG Class 5 (deferred) |

**Tier 2 — Governance Inputs:**

| Artifact | Purpose |
|----------|---------|
| `DPSIG_RUNTIME_NORMALIZATION.md` | Implementation contract reference (read before any task) |
| `LANE_GOVERNANCE_LOCK.md` | Lane ownership verification |
| `pipeline_execution_manifest.json` | Execution perimeter enforcement |

**Tier 3 — Validation Fixture:**

| Artifact | Purpose |
|----------|---------|
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/` | Canonical deterministic replay fixture only — not a client specialization |

**Explicitly forbidden reads:**

- `scripts/pios/75x/*` — Lane A protected; execution order is declared in this manifest
- `scripts/pios/41x/*` — Lane A protected
- `vault/signal_registry.json` — PSIG sovereign; DPSIG does not read it
- `clients/fastapi/psee/runs/run_relational_recovery_01/*` — Lane C isolated
- Any uuid-named client directory — non-canonical
- Any artifact not in the tiers above

**Key principle**: The pipeline execution order is declared in Section 2 of this manifest. Implementation streams do not need to read run_client_pipeline.py to understand it. Reading the pipeline orchestrator to "discover" execution order is REPOSITORY_ARCHAEOLOGY (HIGH severity violation).

---

## 6. Machine-Readable Write Contract

Implementation streams in the DPSIG family are authorized to write ONLY the following targets.

**Implementation outputs:**

| Artifact | Pattern | Constraint |
|----------|---------|------------|
| `derive_relational_signals.py` | `scripts/pios/dpsig/` | New file; stdlib only; no 75.x imports; client-agnostic |
| `dpsig_signal_set.json` | `artifacts/dpsig/<client_id>/<run_id>/` | DPSIG artifact; never written to signal_registry.json |
| `replay_diff.json` | `artifacts/dpsig/<client_id>/<run_id>/` | Replay verification output |

**Documentation outputs:**

| Artifact | Pattern |
|----------|---------|
| Implementation report | `docs/psee/PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01/` |
| This manifest | `docs/governance/pipeline_execution_manifest.json` |
| This report | `docs/psee/PI.PSEE-PIOS.PIPELINE-EXECUTION-MANIFEST.01/` |

**Explicitly forbidden writes:**

- `vault/signal_registry.json` — PSIG sovereign; FORBIDDEN
- `clients/.../binding_envelope.json` — READ_ONLY; FORBIDDEN
- `scripts/pios/75x/*` — Lane A protected; FORBIDDEN
- `scripts/pios/41x/*` — Lane A protected; FORBIDDEN
- `scripts/pios/run_client_pipeline.py` — Lane A protected; FORBIDDEN
- `scripts/pios/lens_report_generator.py` — Lane A protected; any DPSIG read integration requires explicit Lane A contract
- `docs/pios/40.4/*.md` or `docs/pios/40.5/*.md` — Lane B reference; FORBIDDEN
- Any path outside declared targets above

---

## 7. Forbidden Execution Patterns

### CRITICAL Violations — Immediate STOP

| Pattern | Description |
|---------|-------------|
| `LANE_A_PROTECTED_ARTIFACT_MUTATION` | Writing to any protected Lane A script |
| `THRESHOLD_MUTATION` | Altering THRESHOLD=2.0 in 75.x; or DPSIG threshold that copies PSIG value by reference |
| `SIGNAL_REGISTRY_WRITE` | Writing any DPSIG entry into vault/signal_registry.json |
| `ACTIVATION_COUPLING` | Signal that derives activation_state from a PSIG activation outcome |
| `SEMANTIC_AUTHORITY_CLAIM` | Implementation claiming authority over 75.x activation behavior |
| `LANE_C_IMPORT` | Importing R-PSIG formulas or uuid-client patterns into Lane A or Lane D implementation |

### HIGH Violations — Stream Non-Compliant

| Pattern | Description |
|---------|-------------|
| `REPOSITORY_ARCHAEOLOGY` | Performing undeclared traversal to discover pipeline structure during IMPLEMENTATION_MODE |
| `CLIENT_SPECIFIC_LOGIC` | Any `if fastapi` / `if blueedge` branching in a generic script |
| `UNDECLARED_READ` | Reading artifact not in ALLOWED_READS |
| `BINDING_ENVELOPE_WRITE` | Any write to binding_envelope.json |
| `DYNAMIC_PIPELINE_REDISCOVERY` | Inspecting run_client_pipeline.py to discover execution order (already declared here) |

### MEDIUM Violations — Must Be Corrected Before Shipping

| Pattern | Description |
|---------|-------------|
| `MISSING_LANE_SCOPE` | Stream contract without LANE_SCOPE header |
| `FLOAT_NONDETERMINISM` | Float operation with non-canonical summation order |
| `MISSING_DERIVATION_TRACE` | Signal entry missing required derivation_trace field |
| `UNAUTHORIZED_ARTIFACT_PATH` | Writing outside ALLOWED_WRITES |

---

## 8. Implementation Freeze Model

### Immutable Runtime Assumptions

The following are frozen at `93098cb` and require an explicit Lane A contract to change:

| ID | Constraint | Value | Location |
|----|-----------|-------|---------|
| IRC-01 | THRESHOLD_LOCK | `THRESHOLD=2.0` | `scripts/pios/75x/compute_pressure_candidates.py` |
| IRC-02 | ACTIVATION_METHOD_LOCK | `RUN_RELATIVE_OUTLIER` | `scripts/pios/75x/compute_pressure_candidates.py` |
| IRC-03 | SIGNAL_REGISTRY_SOVEREIGNTY | PSIG-sovereign artifact | `vault/signal_registry.json` |
| IRC-04 | LANE_A_PIPELINE_ORDER | `binding_envelope → 75.x (×3) → 41.x → vault → lens` | `scripts/pios/run_client_pipeline.py` |
| IRC-05 | BINDING_ENVELOPE_IMMUTABILITY | `READ_ONLY for all consumers` | `clients/.../binding/binding_envelope.json` |
| IRC-06 | SEMANTIC_ACTIVATION_BLOCKED | `activation_authorized=false` | `artifacts/psee_gate/...` |
| IRC-07 | NAMESPACE_DEBT_ACKNOWLEDGMENT | `PSIG(LANE_A) ≠ PSIG(LANE_D)` | LANE_GOVERNANCE_LOCK.md Section 2 |

### Implementation Streams Are Not Discovery Streams

This principle is the central purpose of this manifest.

A discovery stream asks: "What does this pipeline do?" — and traverses the repository to find out.

An implementation stream asks: "Where do I put this output?" — and reads from the contract to find out.

The execution perimeter declared in this manifest eliminates the need for discovery behavior in implementation streams. All pipeline structure questions are answered here.

**Before this manifest**: an implementation engineer would read run_client_pipeline.py, 75x scripts, and 41x scripts to understand what they may and may not modify.

**After this manifest**: the ALLOWED_READS, ALLOWED_WRITES, protected_artifacts, and immutable_constraints sections answer those questions without any script traversal.

---

## 9. Execution Mode Taxonomy

### DISCOVERY_MODE

**Purpose**: Investigation, gap analysis, forensic research  
**Traversal scope**: UNRESTRICTED (read-only)  
**Constraint**: Findings must be formalized in a governance document before informing implementation

### GOVERNANCE_MODE

**Purpose**: Writing manifests, architecture definitions, closure documents  
**Traversal scope**: Declared authoritative inputs only  
**Constraint**: No script execution; no protected artifact modification

### IMPLEMENTATION_MODE

**Purpose**: Creating scripts and artifacts within explicit contract scope  
**Traversal scope**: STRICTLY BOUNDED to ALLOWED_READS  
**Constraint**: No reads or writes outside declared perimeter; no discovery behavior; scripts must be client-agnostic

> **IMPLEMENTATION_MODE is not DISCOVERY_MODE.** The execution perimeter is frozen before implementation begins.

### VALIDATION_MODE

**Purpose**: Running scripts, asserting output correctness, producing replay_diff.json  
**Traversal scope**: Implementation outputs + declared validation fixtures  
**Constraint**: READ_ONLY on existing artifacts; writes limited to designated validation outputs

### CERTIFICATION_MODE

**Purpose**: Producing CLOSURE.md, issuing stream RETURN block  
**Traversal scope**: Stream artifacts only  
**Constraint**: No new implementation findings; any VAL-check FAIL blocks certification

---

## 10. Future Stream Enforcement Rules

Every future implementation stream in the PSEE ↔ PiOS family must satisfy all of the following before execution begins:

| Rule | Requirement |
|------|-------------|
| IFR-01 | PERIMETER FROZEN BEFORE EXECUTION — no mid-stream expansion |
| IFR-02 | BASELINE COMMIT DECLARED — `93098cb` or authorized successor |
| IFR-03 | LANE_SCOPE MANDATORY — contract without LANE_SCOPE is INVALID |
| IFR-04 | READ SURFACE FROZEN — only ALLOWED_READS or manifest amendment |
| IFR-05 | WRITE TARGET FROZEN — only ALLOWED_WRITES or manifest amendment |
| IFR-06 | SCRIPTS ARE TOPOLOGY-NATIVE — no client-specific logic in generic scripts |
| IFR-07 | REPLAY MANDATORY — overall_verdict=IDENTICAL required for PASS |
| IFR-08 | ADDITIVE ONLY — no Lane A artifact removal or repurposing |
| IFR-09 | DENOMINATOR GUARDS MANDATORY — every division formula has an explicit guard |
| IFR-10 | FAIL-CLOSED MANDATORY — non-zero exit on REQUIRED_ARTIFACT_MISSING |

**Pre-execution checklist for all future implementation streams:**

```
STEP 1: Confirm baseline_commit=93098cb is declared
STEP 2: Confirm LANE_SCOPE and LANE_IMPACT headers present
STEP 3: Confirm all reads are in ALLOWED_READS (or manifest amendment exists)
STEP 4: Confirm all writes are in ALLOWED_WRITES (or manifest amendment exists)
STEP 5: Confirm no CRITICAL or HIGH forbidden patterns in the contract
STEP 6: Confirm Lane A protected artifacts are listed as immutable
STEP 7: Confirm DPSIG script contains no client-specific logic (IFR-06)
STEP 8: Confirm replay verification is included in stream tasks (IFR-07)
```

Any step that cannot be confirmed = stream STOP.

---

## 11. Governance Verdict

**PI.PSEE-PIOS.PIPELINE-EXECUTION-MANIFEST.01 is COMPLETE.**

The generic PiOS runtime execution perimeter is now frozen. The following are true:

| Verdict Item | Status |
|-------------|--------|
| Baseline `93098cb` frozen as execution root | CONFIRMED |
| Lane A sovereignty explicit and machine-readable | CONFIRMED |
| Lane B/C/D status explicit — no lane collapse possible | CONFIRMED |
| ALLOWED_READS contract machine-readable | CONFIRMED |
| ALLOWED_WRITES contract machine-readable | CONFIRMED |
| Forbidden execution patterns classified CRITICAL/HIGH/MEDIUM | CONFIRMED |
| Immutable runtime constraints declared (IRC-01..IRC-07) | CONFIRMED |
| Implementation freeze rules declared (IFR-01..IFR-10) | CONFIRMED |
| Execution mode taxonomy defined (5 modes) | CONFIRMED |
| Repository rediscovery behavior prohibited in IMPLEMENTATION_MODE | CONFIRMED |
| Future stream pre-execution checklist defined (8 steps) | CONFIRMED |

**HANDOFF: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01**

Resume within the perimeter defined by this manifest. Read surfaces and write targets are frozen. Pre-execution checklist is satisfied. Implementation begins.

---

## 12. Validation

### PASS criteria — all met:

- [x] Baseline `93098cb` frozen (Section 2) — commit identity, runtime class, sovereignty model declared
- [x] Lane ownership explicit (Section 3) — 4 lanes, status, protected artifacts, forbidden usage, implementation eligibility
- [x] Read/write contracts machine-readable (Sections 5, 6) — tier-1/2/3 reads; implementation + documentation writes; explicit forbidden lists
- [x] Implementation boundaries explicit (Section 4, Section 7) — perimeter model; forbidden patterns with severity classification
- [x] Execution modes defined (Section 9) — 5 modes, allowed/forbidden behavior, traversal scope
- [x] Implementation mode bounded (Sections 4, 8, 9) — IMPLEMENTATION_MODE ≠ DISCOVERY_MODE principle stated and enforced
- [x] Repository rediscovery prohibited (Section 7, IFR-01) — REPOSITORY_ARCHAEOLOGY classified as HIGH violation
- [x] Future enforcement rules explicit (Section 10) — IFR-01..IFR-10, 8-step pre-execution checklist
- [x] No implementation performed — documentation only
- [x] Client-agnosticism enforced (IFR-06) — topology-native requirement explicit

### FAIL conditions check:

- Runtime rediscovery allowed? NO — REPOSITORY_ARCHAEOLOGY is HIGH violation; IMPLEMENTATION_MODE explicitly forbids undeclared traversal
- Exploratory implementation behavior allowed? NO — IFR-01 "perimeter must be frozen before execution"; Section 8 "implementation streams are not discovery streams"
- Lane sovereignty ambiguous? NO — Lane A protected artifacts named; immutable constraints declared; PSIG(LANE_A) ≠ PSIG(LANE_D) documented
- Execution modes undefined? NO — 5 modes with allowed/forbidden/traversal/access defined
- Baseline commit ambiguous? NO — 93098cb declared with commit message and authority class
- Implementation perimeter not machine-constrained? NO — allowed_reads, allowed_writes, forbidden_patterns all machine-readable in pipeline_execution_manifest.json

Status: **PASS**
