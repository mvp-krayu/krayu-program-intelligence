# Decision Lock — Second Client Identity and Intake Selector

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
Date: 2026-04-24
Status: LOCKED
Produced by: CHUNK: DECISION LOCK
STEP 0 executed: NO
Runtime execution performed: NO

---

## DECISION-01: Second-Client Identity

**RESOLVED**

| Field | Value |
|---|---|
| `client_uuid` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `business_client_id` | `oss-fastapi-modular` |
| `client_display_name` | `OSS FastAPI Modular Monolith` |
| `lifecycle_state` | `ACTIVE` (to be written at STEP 0) |

Brain authority: CANONICAL BRAIN — client identity is a canonical act; UUID is permanent and immutable once registered.

These values are the inputs to STEP 0. No client registration has occurred. No entry has been written to `clients/registry/client_index.json`. That act is reserved for STEP 0 execution.

---

## DECISION-02: Tenant Parameter Mapping

**RESOLVED**

| Parameter | Value |
|---|---|
| `--client` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `--tenant` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `named_alias_required` | `false` |

`--client` and `--tenant` resolve to the same UUID for this client. No separate `tenants/` directory is required. The PSEE runtime path convention is UUID-rooted: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/`.

**Constraint:** `clients/oss-fastapi-modular/` MUST NOT be created. Named alias directories are not part of the second-client execution model. Verified absent: directory does not exist.

Brain authority: CODE BRAIN — parameter resolution is an implementation question; confirmed by path-convention discovery (UUID directory is the authoritative PSEE runtime root).

---

## DECISION-03: Intake Selector Record

**RESOLVED**

```
selector_id: sel_001_e65d2f0a
selector_type: local_directory
source_kind: open_source_repository_snapshot
source_profile: modular_fastapi_backend
source_uri: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
source_version: 04dcdc9ae62e94d55f528cb89493a72b448845ab
adapter_required: false
evidence_boundary:
  include: [".py", ".md", ".toml", ".yaml", ".yml", ".json"]
  exclude: [".git", "__pycache__", ".venv", "venv", ".env", "build", "dist", "node_modules", "cache artifacts"]
  file_count_total: 87
  file_count_eligible: 79
checksum_manifest: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/manifests/fastapi-backend.manifest.sha256
allowed_runtime_mode: psee_local
```

Brain authority: CANONICAL BRAIN (evidence boundary and selector validity); CODE BRAIN (selector resolution to PSEE --source argument).

---

## Source Staging

**Temporary source path (origin):**
`/tmp/pi-second-client-source/fastapi-backend`

**Governed source path (staged, not git-tracked):**
`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend`

**Checksum manifest (governed path, not git-tracked):**
`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/manifests/fastapi-backend.manifest.sha256`

**Git tracking status:** NOT committed. The `clients/*/input/` path is excluded by `.gitignore` per existing repo policy (WP-13B: onboarding runtime artifacts are not committed, regenerated per run). Source snapshot persists on disk for this execution session. The pinned `source_version` (git SHA `04dcdc9ae62e94d55f528cb89493a72b448845ab`) is the durable reproducibility anchor — source is re-creatable at any time via `git clone https://github.com/YoraiLevi/modular-monolith-fastapi.git` at that SHA.

**Verification at time of staging:**
- Total files staged: 87 (matches manifest line count)
- Evidence-eligible files: 79
- `.git/` directory: ABSENT (stripped by rsync --exclude='.git')
- `clients/oss-fastapi-modular/`: ABSENT (named alias not created)
- Source size: 752K (full clone); staged snapshot excludes `.git` overhead

---

## PRE-GATE Dependency

Before STEP 0 may execute, the PRE-GATE — INTAKE VIABILITY CHECK must be run against this selector record.

PRE-GATE inputs:
- `intake_selector_record`: this document, DECISION-03 section
- `source_uri`: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend`
- `checksum_manifest`: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/manifests/fastapi-backend.manifest.sha256`

Expected PRE-GATE classification: PASS (87 files, git SHA versioned, multiple services with cross-service dependencies observed).

PRE-GATE result must be recorded in `pregate_viability_record.json` before STEP 0 begins.

---

## Confirmation

- **STEP 0 not executed**: confirmed; no entry written to `clients/registry/client_index.json`; no client directory scaffold created under `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/`
- **Runtime execution not performed**: confirmed; no PiOS, PSEE, IG, GAUGE, LENS, npm, pip, pytest, or Docker commands were run
- **clients/blueedge/ unmodified**: confirmed
- **docs/baseline/pios_baseline_v1.0.md unmodified**: confirmed
- **clients/oss-fastapi-modular/ not created**: confirmed
