# EXECUTION GATE

**Stream:** GOV.1
**Authority:** GOV family — canonical governance enforcement
**Script:** `scripts/governance/validate_execution.sh`
**Companion:** `scripts/governance/validate_stream_open.sh` (GOV.0 — entry gate)
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

The Execution Gate is a post-execution validator that must be called before `RETURN_CONTRACT` is allowed. It enforces execution discipline that the entry gate (GOV.0) cannot see — what artifacts were produced, whether runs were duplicated, whether validators were created per-stream instead of shared.

---

## 2. USAGE

```bash
bash scripts/governance/validate_execution.sh <repo_root> <stream_id> <target_namespace> [options]
```

**Options:**

| Flag | Purpose |
|---|---|
| `--reference-run <path>` | Explicit reference run for duplication check |
| `--gov-stream` | Mark as GOV/framework stream — exempts validator creation check |
| `--baseline-dirs <a:b:c>` | Override default baseline protection dirs (colon-separated) |

**Exit codes:**

| Code | Meaning | Effect |
|---|---|---|
| `0` | PASS | `RETURN_CONTRACT` authorized |
| `1` | FAIL | `RETURN_CONTRACT` BLOCKED — violations must be resolved |

---

## 3. INTEGRATION RULE

Every execution stream must call the gate before closing:

```bash
bash scripts/governance/validate_execution.sh . <STREAM_ID> <TARGET_NAMESPACE>
```

If not called → stream is invalid. No exceptions.

---

## 4. GATE CHECKS

| Check | Failure Code | What triggers it | Exempt |
|---|---|---|---|
| **C1a** | `VALIDATOR_DUPLICATION` | `validate_*.sh` found in `scripts/pios/<slug>/` | GOV streams |
| **C1b** | `VALIDATOR_DUPLICATION_GLOBAL` | Any `validate_*.sh` exists anywhere in `scripts/pios/` | GOV streams |
| **C2** | `RUN_DUPLICATION` | Target namespace is provenance-only copy of a reference run | N/A |
| **C3a** | `ARTIFACT_INFLATION` | >7 governance artifacts in `docs/pios/<stream_id>/` | N/A |
| **C3b** | `ARTIFACT_INFLATION_STRUCTURE` | Same section heading appears ≥3 times across governance artifacts | N/A |
| **C4** | `NON_DELTA_OUTPUT` | Governance artifact <15% different from peer stream equivalent | N/A |
| **C5** | `GIT_DIRTY` | Untracked or modified files outside stream's expected scope | N/A |
| **C6** | `BASELINE_MUTATION` | `git diff HEAD` shows changes to baseline directories | N/A |
| **C6a** | `BASELINE_MUTATION` | Baseline anchor tag missing | N/A |

---

## 5. VIOLATION CODES

### `VALIDATOR_DUPLICATION`
Per-stream validator scripts (`validate_*.sh`) were created under `scripts/pios/<stream>/`. These must be replaced with parameterized calls to `scripts/governance/validate_*.sh`. Creating per-stream validators burns tokens on every stream and diverges from SKILLS.md rule 7.

**Resolution:** Move or replace per-stream validators with governance-level shared scripts.

### `RUN_DUPLICATION`
A full run namespace (40.2/40.3/40.4 artifacts) was created that is a provenance-only copy of an existing run. This wastes ~40% of execution token budget on file writes that carry no semantic value.

**Resolution:** Replace full-copy proof runs with diff-based verification reports. The canonical run set is run_02. Subsequent determinism/adapter/bootstrap proofs should produce a `VERIFICATION_REPORT.md` under `docs/pios/<stream_id>/` rather than materializing 43 near-identical files.

### `ARTIFACT_INFLATION`
More than 7 governance artifacts were produced for the stream, exceeding the GOVERNANCE_PACK 7-slot standard. Or: structural section headings are repeated across multiple artifacts instead of being template-filled.

**Resolution:** Use `GOVERNANCE_PACK` template. Fill slots — do not invent new slot classes unless the stream delta explicitly requires them.

### `NON_DELTA_OUTPUT`
A governance artifact is <15% semantically different from the equivalent artifact in the prior stream of the same family. This indicates that a template is being re-filled manually instead of the template mechanism being used.

**Resolution:** Apply `APPLY_REPORT_TEMPLATE`. Artifacts should contain only stream-specific delta content.

### `GIT_DIRTY`
The working tree contains untracked or modified files outside the expected scope of this stream. This means either (a) prior stream work is uncommitted, or (b) unintended writes occurred.

**Resolution:** Commit or stash prior stream artifacts before calling `RETURN_CONTRACT`. All writes for the current stream must be intentional and within declared scope.

### `BASELINE_MUTATION`
A baseline-protected directory was modified, or a baseline anchor tag is missing.

**Resolution:** Restore the affected directory from the baseline anchor. Baseline directories are read-only.

---

## 6. EXPECTED SCOPE PER STREAM

The git hygiene check (C5) uses the following as the expected scope for a stream:

| Path | Scope |
|---|---|
| `<target_namespace>/` | Primary outputs |
| `docs/pios/<stream_id>/` | Governance artifacts |
| `scripts/governance/` | Shared governance scripts (always in scope) |
| `scripts/pios/<stream_slug>/` | Per-stream scripts (triggers C1 if validators present) |
| `claude/` | Contract files |

Files outside all of the above are flagged as GIT_DIRTY.

---

## 7. GOV STREAM EXEMPTIONS

GOV and framework hardening streams are exempt from C1 (validator creation check) because they are the authority that creates shared validators. They are identified by:
- `--gov-stream` flag passed at invocation, or
- Stream ID beginning with `GOV.`

---

## 8. RUN DUPLICATION DETECTION ALGORITHM

1. Count governed 40.x artifacts in target namespace
2. Find all other run namespaces with identical file count
3. Sample 3 files from each; normalize both (strip all provenance fields)
4. If normalized diff = 0 across sample → `RUN_DUPLICATION`

Normalization strips: `run_id`, `contract`, `upstream_contract`, `date`, `regeneration_context`, `adapter_binding`, `github_*`, `jira_*`, `orchestration_*`, `source_profile_*`, `resolved_*`, and all path references containing run identifiers.

---

## 9. GATE PAIR: GOV.0 + GOV.1

| Gate | When | What it checks |
|---|---|---|
| GOV.0 (`validate_stream_open.sh`) | Before execution starts | Contract structure, family registration, schema compliance |
| GOV.1 (`validate_execution.sh`) | Before `RETURN_CONTRACT` | Execution outputs, validator reuse, run strategy, artifacts, git state |

Neither gate replaces the other. Both must pass for a stream to be valid.
