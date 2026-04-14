# Bootstrap Chain Authority Contract
# BOOTSTRAP.CHAIN.AUTHORITY.01

## Identity

- Contract: BOOTSTRAP.CHAIN.AUTHORITY.01
- Date: 2026-04-14
- Status: AUTHORITATIVE — LOCKED
- Scope: STAGE 0 (BOOTSTRAP) ONLY
- Authority level: CHAIN ENTRY AUTHORITY

---

## Purpose

This contract defines the authoritative entry boundary for the computable chain.

Stage 0 is the only stage that accepts external input.
Every downstream stage receives only what Stage 0 declares and freezes.
If Stage 0 is not governed, the entire chain is non-deterministic.

This contract is the enforcement specification for Stage 0.
It must be satisfied before Stage 1 (IG) may begin.

---

## 1. INTAKE DECLARATION

### 1.1 Required Fields

An intake declaration is the machine-readable record that initiates a chain run.
It must be produced before any source boundary is established.

| field | description | required |
|-------|-------------|----------|
| `client_uuid` | Canonical client identifier — must match existing client registry or be newly registered | REQUIRED |
| `source_location` | Absolute filesystem path or fully qualified repository reference (no relative paths) | REQUIRED |
| `source_version` | Commit hash (40-char hex), release tag (semver string), or snapshot ID (ISO timestamp + hash) | REQUIRED |
| `intake_timestamp` | ISO 8601 UTC timestamp of the moment the declaration is created | REQUIRED |
| `intake_mode` | One of: `LOCAL_SNAPSHOT`, `REMOTE_REPO` | REQUIRED |

No other fields are required. No optional fields may influence chain behavior.

### 1.2 Allowed Formats

| field | allowed format | example |
|-------|---------------|---------|
| `client_uuid` | Alphanumeric, hyphens allowed, 8–64 chars | `blueedge` / `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| `source_location` | Absolute POSIX path or `git+https://...@<ref>` | `/data/clients/blueedge/source/v3.23.0` |
| `source_version` | 40-hex commit hash OR `v<major>.<minor>.<patch>` tag OR `snap_<YYYYMMDDTHHmmss>_<8hex>` | `a1b2c3d4...` / `v3.23.0` / `snap_20260414T000000_f47ac10b` |
| `intake_timestamp` | `YYYY-MM-DDTHH:MM:SSZ` | `2026-04-14T09:00:00Z` |
| `intake_mode` | Exact string match — no casing variants | `LOCAL_SNAPSHOT` |

### 1.3 Rejection Conditions — Intake Declaration

| condition | rejection reason |
|-----------|-----------------|
| Any required field missing | MISSING_FIELD — chain must not start |
| `client_uuid` contains whitespace or special characters outside allowed set | INVALID_CLIENT_UUID |
| `source_location` is a relative path | RELATIVE_PATH_FORBIDDEN |
| `source_location` path does not exist and mode is `LOCAL_SNAPSHOT` | SOURCE_NOT_FOUND |
| `source_version` does not match any allowed format | INVALID_VERSION_FORMAT |
| `intake_timestamp` is not valid ISO 8601 UTC | INVALID_TIMESTAMP |
| `intake_mode` is not one of the two defined values | UNKNOWN_INTAKE_MODE |
| Duplicate `client_uuid` + `source_version` combination from a prior completed run | DUPLICATE_RUN — re-execution requires explicit `force` flag and new `intake_timestamp` |

---

## 2. SOURCE BOUNDARY CONTRACT

### 2.1 Root Directory

The source boundary root is defined as:

```
clients/<client_uuid>/source/<source_version>/
```

This directory is the canonical evidence root for the run.
No source artifact outside this directory may enter the chain.

### 2.2 Admissible File Types

The following file classes are admissible:

| class | examples |
|-------|---------|
| Source code | `.py`, `.js`, `.ts`, `.go`, `.java`, `.rs`, `.c`, `.cpp`, `.h` |
| Configuration | `.yaml`, `.yml`, `.json`, `.toml`, `.ini`, `.env.example`, `.conf` |
| Infrastructure manifests | `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `*.tf`, `*.k8s.yaml`, `*.helm.yaml` |
| Build definitions | `Makefile`, `package.json`, `pyproject.toml`, `setup.py`, `requirements.txt`, `Cargo.toml`, `go.mod` |
| Documentation | `.md`, `.rst`, `.txt`, `.adoc` |
| Telemetry exports | `.csv`, `.log`, `.jsonl` (declared in intake; explicit allowlist only) |
| Schema definitions | `.proto`, `.graphql`, `.sql`, `.avsc`, `.xsd` |

### 2.3 Explicitly Excluded Artifacts

The following are never admissible regardless of location:

| excluded class | examples |
|---------------|---------|
| Package dependency trees | `node_modules/`, `.venv/`, `vendor/`, `__pycache__/` |
| Build outputs | `dist/`, `build/`, `target/`, `out/`, `.next/`, `__pycache__/` |
| Cache directories | `.cache/`, `.gradle/`, `.m2/`, `tmp/` |
| Generated code | Any file in a directory named `generated/`, `gen/`, `auto/` |
| Binary artifacts | `.exe`, `.dll`, `.so`, `.dylib`, `.class`, `.wasm`, `.pyc` |
| IDE and OS metadata | `.DS_Store`, `.idea/`, `.vscode/`, `Thumbs.db` |
| Secrets and credentials | `.env` (with real values), `*.pem`, `*.key`, `*.p12`, `credentials.json` |
| Chain outputs | Any file produced by a prior run of this chain for this client |

### 2.4 Symlinks and External References

- **Symlinks within the source boundary:** resolved to their target; target must be within the boundary or the symlink is excluded and logged.
- **Symlinks pointing outside the boundary:** excluded; logged as `OUT_OF_BOUNDARY_SYMLINK`.
- **External HTTP/package references in manifests:** recorded but NOT resolved; dependency resolution is explicitly out of scope for Stage 0.
- **Rule:** NO implicit external dependency resolution. External references are noted as observations only.

### 2.5 Boundary Freeze

The source boundary is frozen at the moment the intake declaration is accepted and the evidence root is created.

Freezing means:
- no file additions after freeze
- no file modifications after freeze
- no deletions after freeze
- the frozen state is the only state the chain may use

### 2.6 Boundary Invalidation Conditions

| condition | effect |
|-----------|--------|
| Any file is added to the root after freeze | BOUNDARY_VIOLATED — run must be invalidated |
| Any file is modified in the root after freeze | BOUNDARY_VIOLATED — run must be invalidated |
| Source root directory is deleted after freeze | BOUNDARY_DESTROYED — run is unrecoverable |
| A new source version is declared without a new run | BOUNDARY_CONFLICT — rejected; requires new intake declaration |

---

## 3. CLIENT / RUNTIME CONTEXT

### 3.1 Client UUID Binding

- The `client_uuid` binds the run to exactly one client directory path: `clients/<client_uuid>/`
- No run may write to a path outside its bound `client_uuid` directory
- Multiple runs for the same client use distinct `source_version` values — they never share a source root

### 3.2 Environment Assumptions

| mode | assumption |
|------|-----------|
| `LOCAL_SNAPSHOT` | Source files are present on the local filesystem at `source_location`; no network access required |
| `REMOTE_REPO` | Repository is accessible at `source_location`; commit hash must be specified as `source_version`; network access is allowed only to fetch the pinned version |

### 3.3 Runtime Context Isolation

- Each run is isolated to its own `clients/<client_uuid>/source/<source_version>/` root
- No run may read from another run's source root
- No environment variable, hidden config file, or ambient state may influence the source boundary definition
- `PATH`, `HOME`, user-level config files have no authority over the declared source boundary

### 3.4 Forbidden Context Inputs

| forbidden | reason |
|-----------|--------|
| Implicit environment variables influencing source path | Non-determinism |
| Hidden `.env` files with real credentials | Security boundary violation |
| Shared mutable directories across runs | Cross-run contamination |
| Operating system temp directories as evidence | Non-reproducible state |
| External package resolution at bootstrap time | Implicit dependency introduction |

### 3.5 No Cross-Run Mutation Rule

A completed run's source root may not be modified by any subsequent run.
Runs are append-only at the client level: new version → new directory.

---

## 4. EVIDENCE ROOT DEFINITION

### 4.1 Canonical Path

```
clients/<client_uuid>/source/<source_version>/
```

This path is the evidence root for the run.
All downstream stages receive this path as their S0 output reference.

### 4.2 Creation Rule

The evidence root is created by copying or linking the declared source into the canonical path.

- For `LOCAL_SNAPSHOT`: contents of `source_location` are copied into the canonical path
- For `REMOTE_REPO`: repository at `source_version` commit is cloned into the canonical path
- The copy/clone must be complete before the boundary is frozen
- Partial copies are not admissible

### 4.3 Immutability Rule

Once the evidence root is created and the boundary is frozen:

- The directory is read-only for all chain stages
- No stage may write to `clients/<client_uuid>/source/<source_version>/`
- Downstream stages write to their own output paths; they never write back to the evidence root

### 4.4 No Overwrite Rule

If `clients/<client_uuid>/source/<source_version>/` already exists:
- The run must halt with: `EVIDENCE_ROOT_EXISTS`
- A new `source_version` must be declared or the existing root must be explicitly archived before re-use
- Silent overwrite is forbidden

### 4.5 Versioning Behavior

Each `source_version` value maps to exactly one evidence root directory.
Different `source_version` values for the same `client_uuid` produce distinct, isolated directories.
Version directories accumulate; they are never merged.

### 4.6 Integrity Expectation

An `intake_record.json` file must be written to:

```
clients/<client_uuid>/source/<source_version>/intake_record.json
```

This file is the intake declaration record (see Section 7).
Its presence and validity is the integrity signal for the evidence root.
If `intake_record.json` is absent or malformed, the evidence root is considered uninitialized.

---

## 5. ADMISSIBILITY CONDITIONS

Stage 0 is considered COMPLETE and valid for Stage 1 if and only if ALL of the following are true:

| condition | check |
|-----------|-------|
| AC-01 | `intake_record.json` is present at `clients/<client_uuid>/source/<source_version>/intake_record.json` |
| AC-02 | All 5 required intake declaration fields are present and valid in `intake_record.json` |
| AC-03 | `clients/<client_uuid>/source/<source_version>/` directory exists and is non-empty |
| AC-04 | At least one admissible source file is present under the evidence root |
| AC-05 | No excluded artifact classes are present directly at the root level (nested excluded dirs are noted but do not block — see AC-06) |
| AC-06 | Excluded directories are logged in `intake_record.json` under `excluded_paths[]`; they do not block admission but must be declared |
| AC-07 | No file in the admissible set has a modification timestamp after `intake_timestamp` (ensures freeze integrity) |
| AC-08 | No unresolved symlinks pointing outside the boundary exist in the admissible file set |
| AC-09 | `intake_record.json` is not writable after boundary freeze (file permissions or explicit lock) |

**PASS condition:** AC-01 through AC-09 all satisfied.

**Stage 1 may not begin until the PASS condition is confirmed.**

---

## 6. REJECTION CONDITIONS

Stage 0 must FAIL and halt the chain on any of the following:

| code | condition |
|------|-----------|
| `MISSING_FIELD` | Any required intake declaration field is absent |
| `INVALID_CLIENT_UUID` | `client_uuid` contains illegal characters or is empty |
| `RELATIVE_PATH_FORBIDDEN` | `source_location` is a relative path |
| `SOURCE_NOT_FOUND` | `source_location` does not exist (LOCAL_SNAPSHOT mode) |
| `INVALID_VERSION_FORMAT` | `source_version` does not match any allowed format |
| `INVALID_TIMESTAMP` | `intake_timestamp` is not valid ISO 8601 UTC |
| `UNKNOWN_INTAKE_MODE` | `intake_mode` is not `LOCAL_SNAPSHOT` or `REMOTE_REPO` |
| `DUPLICATE_RUN` | Same `client_uuid` + `source_version` from a prior completed run, without explicit `force` flag |
| `EVIDENCE_ROOT_EXISTS` | `clients/<client_uuid>/source/<source_version>/` already exists without `force` flag |
| `BOUNDARY_VIOLATED` | A file in the evidence root was added or modified after freeze |
| `EMPTY_SOURCE` | Evidence root contains no admissible source files after exclusion |
| `MIXED_VERSIONS` | Source tree contains artifacts from more than one declared version (e.g., partial git merge state) |
| `EXTERNAL_DEPENDENCY_RESOLVED` | Any external package or dependency was resolved and injected into the source boundary |
| `NONDETERMINISTIC_STATE` | Source tree contains generated files, build outputs, or other artifacts whose content changes between reads of the same declared version |
| `OUT_OF_BOUNDARY_SYMLINK_UNRESOLVABLE` | Symlink in the admissible file set points outside the boundary and cannot be excluded safely |
| `INTAKE_RECORD_MALFORMED` | `intake_record.json` is present but fails schema validation |
| `INTAKE_RECORD_MISSING` | `intake_record.json` is absent from the evidence root |

**On any FAIL condition: Stage 0 halts. Stage 1 must not begin. The evidence root must not be used.**

---

## 7. OUTPUT CONTRACT

### 7.1 Directory Structure

Stage 0 produces exactly this structure:

```
clients/
  <client_uuid>/
    source/
      <source_version>/
        intake_record.json        ← mandatory
        <source files>            ← frozen admissible source tree
        (excluded dirs logged in intake_record.json, not removed)
```

### 7.2 intake_record.json

**Location:** `clients/<client_uuid>/source/<source_version>/intake_record.json`
**Format:** JSON (UTF-8, no BOM)

**Required schema:**

```json
{
  "client_uuid":       "<string>",
  "source_location":   "<string>",
  "source_version":    "<string>",
  "intake_timestamp":  "<ISO-8601-UTC>",
  "intake_mode":       "LOCAL_SNAPSHOT | REMOTE_REPO",
  "evidence_root":     "clients/<uuid>/source/<version>/",
  "admissible_count":  <integer>,
  "excluded_paths":    ["<string>", ...],
  "boundary_frozen_at": "<ISO-8601-UTC>",
  "admissibility_status": "PASS | FAIL",
  "fail_codes":        ["<REJECTION_CODE>", ...]
}
```

**Rules:**
- `fail_codes` is an empty array `[]` when `admissibility_status` is `PASS`
- `fail_codes` lists all applicable rejection codes when `admissibility_status` is `FAIL`
- `admissible_count` counts files in the admissible set after exclusion
- `boundary_frozen_at` is the timestamp at which the evidence root was sealed
- No additional fields may alter chain behavior

### 7.3 Downstream Handoff

`intake_record.json` is the only authorized Stage 0 → Stage 1 handoff document.
Stage 1 (IG) must read `intake_record.json` to locate the evidence root.
Stage 1 must not accept a source path directly — it must accept an `intake_record.json` path.
Stage 1 must confirm `admissibility_status == "PASS"` before proceeding.

---

## 8. GOVERNANCE RULES

**G1 — No Evidence, No Chain**
If no admissible source file exists under the evidence root, the chain must not proceed.
An empty or excluded-only source tree is a FAIL condition, not a warning.

**G2 — No Boundary, No Admission**
If the source boundary is not frozen, Stage 1 must not begin.
An unfrozen boundary means the source state is undefined and non-reproducible.

**G3 — No Deterministic Source, No Execution**
If the source tree contains generated outputs, build artifacts, or content that varies between reads of the same declared version, the source is non-deterministic.
Non-deterministic source is a FAIL condition. The chain must not proceed.

**G4 — No Cross-Run Mutation**
No run may modify another run's evidence root.
No run may share mutable state with another run.
Runs are isolated, append-only, and version-bound.

**G5 — Stage 0 Output is Immutable Input to Stage 1**
`clients/<client_uuid>/source/<source_version>/` is read-only once frozen.
`intake_record.json` is immutable once written and the boundary is frozen.
Stage 1 reads Stage 0 output; it does not modify it.
No downstream stage may write into `clients/<client_uuid>/source/<source_version>/`.

---

## 9. BOUNDARY WITH STAGE 1 (IG)

Stage 0 ends at: confirmation of `admissibility_status == "PASS"` in `intake_record.json`.
Stage 1 begins at: reading `intake_record.json` to locate and consume the evidence root.

Stage 0 does NOT:
- scan file contents
- classify evidence semantics
- validate intake package structure (IG responsibility)
- produce normalized artifacts (IG responsibility)
- establish admissibility of individual files (IG responsibility — Stage 0 establishes the boundary; IG evaluates what is inside it)

Stage 0 ONLY:
- declares the intake
- creates the evidence root
- freezes the boundary
- records the intake declaration

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — file exists | PASS |
| C2 — intake declaration fully defined | PASS — Section 1 (5 required fields, formats, rejections) |
| C3 — source boundary explicit | PASS — Section 2 (root, admissible types, exclusions, symlinks, freeze) |
| C4 — evidence root defined and immutable | PASS — Section 4 (canonical path, creation, immutability, no-overwrite, integrity) |
| C5 — admissibility conditions explicit | PASS — Section 5 (AC-01 through AC-09, explicit PASS definition) |
| C6 — rejection conditions explicit | PASS — Section 6 (17 named rejection codes) |
| C7 — output contract explicit | PASS — Section 7 (directory structure, intake_record.json schema, handoff rule) |
| C8 — governance rules present | PASS — Section 8 (G1–G5) |
| C9 — no implementation details | PASS — no script names, no runtime commands |
| C10 — no other file modified | PASS |
