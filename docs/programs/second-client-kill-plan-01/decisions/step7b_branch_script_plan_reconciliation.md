# STEP 7B — Branch and Script/Plan Reconciliation

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 7B
**Date:** 2026-04-24
**Branch:** feature/second-client-kill-plan-01
**Baseline commit:** 9fce35a

---

## Current Branch

`feature/second-client-kill-plan-01`

---

## Local Branches (relevant)

```
feature/second-client-kill-plan-01   ← current (HEAD)
work/psee-runtime                    ← required by run_end_to_end.py branch guard
main
```

Full branch list available via `git branch --list`.

---

## Branch Relationship: feature/second-client-kill-plan-01 vs work/psee-runtime

```
merge-base: 51aab3f36167566a0433a69b4e364acaebb49808

git log --left-right --cherry-pick result:
  < [all 20 commits on feature/second-client-kill-plan-01]
  > (none)
```

**`feature/second-client-kill-plan-01` is a pure descendant of `work/psee-runtime`.**

- No commits exist on `work/psee-runtime` that are not already in `feature/second-client-kill-plan-01`
- No divergence; no merge conflicts possible
- A fast-forward of `work/psee-runtime` to the current HEAD of `feature/second-client-kill-plan-01` is a zero-risk operation

The 20 commits ahead on `feature/second-client-kill-plan-01` are all second-client execution governance commits (STEPs 0–6).

---

## Plan/Script Discrepancies Found

| Location | Plan said | Actual script arg |
|----------|-----------|-------------------|
| `pios intake create` (plan line 933) | `--source-selector <selector_id>` | `--source-path <directory_path>` |
| `run_end_to_end.py` (plan line 944) | `--source-selector <selector_id>` | `--source <directory_path>` |
| `run_end_to_end.py` | *(omitted)* | `--demo-client <client>` (required=True) |
| `run_end_to_end.py` | *(omitted)* | `--demo-run-id <run_id>` (default: `run_01_authoritative`) |

The `--source-selector` argument exists in neither `pios.py` nor `run_end_to_end.py`. The plan was written with a future selector-resolution model that was not implemented. The actual scripts accept direct filesystem paths. The resolved path is known from `decision_lock_01.md` DECISION-03.

`--demo-client` was also absent from the plan; it is `required=True` in `run_end_to_end.py` and references the BlueEdge reference package used by `emit_structure_manifest.py`.

---

## Plan Corrections Made

The STEP 7 CODE BRAIN section in `docs/programs/second-client-kill-plan-01/final_execution_plan.md` was updated:

### 1 — Corrected argument descriptions

Replaced:
> "The intake selector record resolves `source_uri` to the path passed to `--source-selector`. The intake model must not be written as local-directory-specific — the `--source-selector` argument receives the `selector_id`; the selector record holds the actual path."

With:
> "source directory is passed directly as `--source-path` (pios intake create) and `--source` (run_end_to_end.py). The `--source-selector` argument referenced in earlier plan drafts does not exist in the current scripts; callers pass the resolved path directly."

### 2 — Command sequence corrected

`pios intake create`: `--source-selector <selector_id>` → `--source-path clients/e65d2f0a-.../input/intake/source/fastapi-backend`

`run_end_to_end.py`: `--source-selector <selector_id>` → `--source clients/e65d2f0a-.../input/intake/source/fastapi-backend`

`run_end_to_end.py`: added `--demo-client blueedge --demo-run-id run_01_authoritative`

### 3 — Locked execution IDs substituted

All `<intake-id>` placeholders → `intake_01_oss_fastapi`

All `<run-id>` / `<new-run-id>` placeholders → `run_01_oss_fastapi`

All `<new-client-id>` / `<new-client-uuid>` placeholders → `e65d2f0a-dfa7-4257-9333-fcbb583f0880`

### 4 — Branch blocker recorded in plan

Added BRANCH BLOCKER note in CODE BRAIN section documenting the `work/psee-runtime` enforcement, the branch relationship, and all three resolution options.

### 5 — EXIT CONDITIONS updated

Replaced generic path placeholders with locked IDs:
- `clients/<new-client-id>/psee/runs/<new-run-id>/package/` → `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`

---

## Locked Execution IDs

| ID | Value |
|----|-------|
| `client_uuid` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `intake_id` | `intake_01_oss_fastapi` |
| `run_id` | `run_01_oss_fastapi` |
| Demo client | `blueedge` |
| Demo run | `run_01_authoritative` |

---

## Branch Blocker

`run_end_to_end.py` line 52: `REQUIRED_BRANCH = "work/psee-runtime"`

Pre-flight check (lines 196–208): `git branch --show-current` compared to `REQUIRED_BRANCH`; exits with pre-flight FAIL if mismatch.

Current branch: `feature/second-client-kill-plan-01` → pre-flight will exit(1) immediately.

**This blocker was NOT resolved in this contract chunk.** Resolution is deferred to a follow-up contract.

---

## Recommended Branch Resolution

**RESOLUTION A** — fast-forward `work/psee-runtime` to the current HEAD of `feature/second-client-kill-plan-01`, then execute STEP 7 from `work/psee-runtime`.

Rationale:
- `feature/second-client-kill-plan-01` is a pure descendant of `work/psee-runtime` (20 ahead, zero divergence)
- Fast-forward is a zero-risk operation — no conflicts, no lost commits
- This preserves the branch guard's original intent: pipeline execution happens from the runtime-authoritative branch
- The second-client governance commits (STEPs 0–6) are the correct state for the runtime branch

This is preferable to RESOLUTION B (amending the branch guard) because the guard exists for a reason — it enforces that pipeline execution happens from the designated runtime branch — and the correct response is to advance that branch, not to bypass the guard.

---

## Validation Results

| Check | Result |
|-------|--------|
| `grep "intake_01_oss_fastapi"` → lines 930, 936, 941 | PASS |
| `grep "run_01_oss_fastapi"` → lines 930, 939, 946, 976, 980 | PASS |
| `grep "--source-path"` → line 934 | PASS |
| `grep "--source "` → line 945 | PASS |
| `grep "--demo-client"` → line 948 | PASS |
| `grep "work/psee-runtime"` → line 951 (branch blocker note) | PASS |
| `git status --short` → only `final_execution_plan.md` modified | PASS |

---

## Confirmation: No Runtime Execution Occurred

No PiOS, PSEE, IG, GAUGE, LENS, npm, pip, or pipeline commands were run.

## Confirmation: STEP 7 Not Executed

`pios intake create`, `pios ledger create`, and `run_end_to_end.py` were not invoked.

---

## STEP 7B Status

**COMPLETE — branch blocker recorded; plan corrected; resolution deferred to follow-up contract**
