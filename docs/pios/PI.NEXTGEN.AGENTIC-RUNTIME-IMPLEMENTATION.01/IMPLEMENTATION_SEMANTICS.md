# Implementation Semantics — P0 Runtime Legality Foundation

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| `compute_file_hash` | artifact_integrity.py | SHA-256 hash of governed artifact | REUSABLE |
| `discover_governed_artifacts` | artifact_integrity.py | Walk run directory for governed artifacts by class | REUSABLE |
| `build_hash_manifest` | artifact_integrity.py | Compute and store full artifact hash manifest | REUSABLE |
| `verify_hash_manifest` | artifact_integrity.py | Recompute and compare against stored manifest | REUSABLE |
| `verify_single_artifact` | artifact_integrity.py | Single-artifact integrity check | REUSABLE |
| `assert_proposition_mutable` | terminal_state_guard.py | Reject mutation to terminal propositions | REUSABLE |
| `assert_reconciliation_mutable` | terminal_state_guard.py | Reject mutation to terminal reconciliation | REUSABLE |
| `assert_promotion_not_demoting` | terminal_state_guard.py | Reject S-state demotion | REUSABLE |
| `assert_event_log_append_only` | terminal_state_guard.py | Enforce append-only event logs | REUSABLE |
| `assert_checkpoint_immutable` | terminal_state_guard.py | Reject checkpoint overwrite | REUSABLE |
| `GovernedWriter` | terminal_state_guard.py | Storage-layer enforcement wrapper | REUSABLE |
| `test_revalidation_determinism` | replay_determinism.py | Replay revalidation and assert identical result | REUSABLE |
| `test_anchor_determinism` | replay_determinism.py | Verify anchor dimensional structure | REUSABLE |
| `test_certification_determinism` | replay_determinism.py | Verify certification internal consistency | REUSABLE |
| `run_all_tests` | replay_determinism.py | Composite replay determinism harness | REUSABLE |

## 2. Input Contracts

### artifact_integrity.py
- `run_dir: Path` — run directory containing governed artifacts per `GOVERNED_ARTIFACT_PATTERNS`
- Expected structure: `{run_dir}/{artifact_class}/{file_pattern}`
- 8 artifact classes: structural, semantic, sqo, ceu, spine, convergence, chronicle, learning

### terminal_state_guard.py
- `review_state: dict` — proposition_review_state.json shape (`status`, `dispositions.{id}.disposition`)
- `recon_state: dict` — reconciliation_state.json shape (`reconciliation_status`, `candidates.{id}.state`)
- `current_state: dict` — promotion_state.json shape (`s_level`)
- `GovernedWriter(run_dir)` — requires run directory with standard subdirectory structure

### replay_determinism.py
- `run_dir: Path` — must follow `clients/{client}/psee/runs/{run_id}/` path convention
- Extracts `client` and `run_id` from path for revalidation engine invocation
- Requires `revalidation_engine.py` at `scripts/pios/revalidation_engine.py`

## 3. Output Contracts

### artifact_integrity.py
- `artifact_hash_manifest.json` — written to `{run_dir}/artifact_hash_manifest.json`
- Fields: `manifest_version`, `created_at`, `artifact_count`, `artifacts[]` (each: `relative_path`, `artifact_class`, `immutable`, `sha256`, `size_bytes`, `hashed_at`)
- Verification returns: `status` (PASS/FAIL/NO_MANIFEST), `passed`/`failed`/`missing` counts, `immutable_violations[]`, `results[]`

### terminal_state_guard.py
- No file output — enforcement via exceptions
- `TerminalStateViolation` — proposition or reconciliation terminal state mutation
- `ImmutableArtifactViolation` — event log modification or checkpoint overwrite
- `SStateDemotionViolation` — S-state reverse transition
- `GovernedWriter` writes JSON to standard paths within run directory

### replay_determinism.py
- JSON result: `harness_version`, `overall_status`, `summary` (passed/failed/skipped/warned/errored), `tests[]`
- Optional file output via `--output` flag
- Exit code: 0 for PASS/SKIPPED/WARN, 1 for FAIL/ERROR

## 4. Calibration Assumptions

| Constant | Value | Governed/Tuned |
|----------|-------|---------------|
| `PROPOSITION_TERMINAL_DISPOSITIONS` | ACCEPTED, REJECTED, ARBITRATED | GOVERNED — per SQO execution graph |
| `RECONCILIATION_TERMINAL_STATES` | CONFIRMED, REJECTED, MERGED | GOVERNED — per SQO execution graph |
| `S_STATE_ORDER` | S0=0, S1=1, S2=2, S3=3 | GOVERNED — irreversible by constitution |
| `IMMUTABLE_CLASSES` | structural, chronicle | GOVERNED — per runtime state model |
| `GOVERNED_ARTIFACT_PATTERNS` | 8 classes, specific paths | TUNED — extends as new artifact types emerge |

## 5. Extension Points

- `GOVERNED_ARTIFACT_PATTERNS` — add new artifact classes or file patterns as the runtime expands
- `IMMUTABLE_CLASSES` — promote additional classes to immutable as governance tightens
- `GovernedWriter` — add new `write_*` methods as new governed artifact types are created
- `replay_determinism.py` — add new `test_*` functions for additional determinism assertions
- Anchor dimension names — update if constitutional anchor schema evolves

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| `artifact_integrity.py` | Storage integrity — what exists and whether it has been modified |
| `terminal_state_guard.py` | Mutation legality — whether a write operation is constitutionally permitted |
| `replay_determinism.py` | Computation determinism — whether re-execution produces identical results |
