# Runtime Replay Manual — WP-10

**Document:** runtime_replay_manual.md
**Stream:** PSEE.RECONCILE.1.WP-10
**Client:** blueedge
**Run ID:** run_01_authoritative

---

## Purpose

Operational manual for building the BlueEdge runtime envelope and replaying PiOS intake. Both operations are deterministic. Rerunning the scripts with the same inputs produces the same package structure and intake outcome.

---

## Client Path

```
clients/blueedge/psee/runs/run_01_authoritative/
  package/     ← PSEE runtime artifacts
  intake/      ← PiOS intake result artifacts
  outputs/     ← downstream outputs (empty until populated)
```

---

## Prerequisites

- Python 3 (no external dependencies)
- Run all commands from repository root: `/Users/khorrix/Projects/k-pi-core`
- Branch: `work/psee-runtime`

---

## Commands

### Step 1 — Build runtime envelope

```
python3 scripts/psee/build_runtime_envelope.py
```

Writes to: `clients/blueedge/psee/runs/run_01_authoritative/package/`

Produces:
- `engine_state.json`
- `coverage_state.json`
- `reconstruction_state.json`
- `gauge_state.json`
- `gauge_view.json`
- `verification.log`
- `package_manifest.json` (written last; includes verification_hash and manifest_hash)

### Step 2 — Replay intake

```
python3 scripts/psee/run_intake_replay.py
```

Reads from: `clients/blueedge/psee/runs/run_01_authoritative/package/`

Writes to: `clients/blueedge/psee/runs/run_01_authoritative/intake/`

Produces:
- `intake_result.json`
- `intake_log.md`

---

## Expected Output Locations

| Artifact | Path |
|---|---|
| All package artifacts | `clients/blueedge/psee/runs/run_01_authoritative/package/` |
| Intake result | `clients/blueedge/psee/runs/run_01_authoritative/intake/intake_result.json` |
| Intake log | `clients/blueedge/psee/runs/run_01_authoritative/intake/intake_log.md` |

---

## Inspecting the Manifest

```
cat clients/blueedge/psee/runs/run_01_authoritative/package/package_manifest.json
```

Key fields:
- `run_id` — must be `run_01_authoritative`
- `required_artifacts_status` — must be `complete`
- `lifecycle_state` — must be `EMITTED`
- `verification_hash` — sha256 of `verification.log`
- `manifest_hash` — sha256 of the manifest itself (computed after all other fields)

---

## Inspecting the Verification Outcome

```
head -1 clients/blueedge/psee/runs/run_01_authoritative/package/verification.log
```

Expected: `Outcome: PASS_FULL`

Full log:
```
cat clients/blueedge/psee/runs/run_01_authoritative/package/verification.log
```

---

## Inspecting the Intake Mode

```
cat clients/blueedge/psee/runs/run_01_authoritative/intake/intake_result.json
```

Key fields:
- `verification_outcome` — derived from `verification.log`
- `intake_mode` — `AUTHORITATIVE_INTAKE` / `BOUNDED_INTAKE` / `REJECT`
- `consumed_scope` — `all` / `verified_scope_only` / `none`
- `rejected` — `false` on success

---

## Replay Rules

1. Both scripts are idempotent within the same run. Rerunning overwrites outputs with identical content (except `emission_timestamp` in the manifest, which refreshes to current UTC).
2. `run_intake_replay.py` reads only from the `package/` directory. It does not rerun `build_runtime_envelope.py`.
3. Intake outcome is derived entirely from `verification.log`. Changing `verification.log` changes the intake mode on next replay.
4. If any mandatory artifact is absent from `package/`, `run_intake_replay.py` exits with code 1 and sets `rejected: true` in `intake_result.json`.
5. If any JSON artifact has a `run_id` that does not match `package_manifest.json`, the replay fails with `RUN_ID_INCONSISTENCY`.

---

## What Constitutes Success

- `build_runtime_envelope.py` exits with code 0 and prints `ENVELOPE_BUILT`
- `run_intake_replay.py` exits with code 0 and prints `INTAKE_COMPLETE`
- `intake_result.json` has `rejected: false`
- `intake_mode` matches the `Outcome` in `verification.log`
- All mandatory artifacts present in `package/`
- All JSON artifacts share `run_id = run_01_authoritative`

---

## What Constitutes Rejection

- `run_intake_replay.py` exits with code 1 and prints `INTAKE_FAILED`
- `intake_result.json` has `rejected: true`
- `errors` array in `intake_result.json` is non-empty
- Trigger conditions: missing artifact, run_id mismatch, missing verification.log, `Outcome: FAIL_STRUCTURAL` in verification.log, unrecognized outcome value
