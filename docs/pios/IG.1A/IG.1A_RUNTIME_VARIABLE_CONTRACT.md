# IG.1A — Runtime Variable Contract

**Stream:** IG.1A  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines the runtime variable contract for IG.1 ingestion. It specifies allowed values, validation rules, default behavior, and failure conditions for each bootstrap field.

No variable may be set outside this contract. No implicit inheritance from shell environment is permitted without explicit declaration here.

---

## 2. VARIABLE DEFINITIONS

---

### WORKSPACE_ROOT

- **Type:** absolute path  
- **Required:** YES  
- **Default:** none — must be explicit  
- **Validation:** directory must exist  
- **Failure:** FAIL if path does not exist or is relative  
- **Notes:** typically `~/Projects` or equivalent; must be set by caller

---

### REPO_ROOT

- **Type:** absolute path  
- **Required:** YES  
- **Default:** none — must be explicit  
- **Validation:** must be a valid git repository root; must contain `docs/`, `scripts/`, `app/`  
- **Failure:** FAIL if not a git repo or missing governed directories  
- **Canonical value:** `~/Projects/k-pi-core`

---

### BASELINE_ANCHOR

- **Type:** string (git tag name)  
- **Required:** YES  
- **Allowed values:**  
  - `pios-core-v0.4-final`  
  - `demo-execlens-v1-final`  
  - `governance-v1-final`  
- **Validation:** tag must exist in the repository; no write operations permitted against it  
- **Failure:** FAIL if tag does not exist; FAIL if any write targets the tagged commit

---

### SOURCE_MODE

- **Type:** enum  
- **Required:** YES  
- **Allowed values:**  
  - `SNAPSHOT` — ingest from a local snapshot file  
  - `LIVE` — ingest from a live external source (requires explicit authorization)  
- **Default:** `SNAPSHOT`  
- **Failure:** FAIL if value is not one of the above  
- **Notes:** `LIVE` mode is OUT OF SCOPE for IG.1A; it must not be activated without a new contract authorizing it

---

### SNAPSHOT_BASELINE_PATH

- **Type:** absolute path  
- **Required:** YES when `SOURCE_MODE=SNAPSHOT`  
- **Default:** none  
- **Validation:** file must exist and be readable  
- **Failure:** FAIL if `SOURCE_MODE=SNAPSHOT` and path does not exist  
- **Notes:** this is the primary evidence input; it must not be mutated during execution

---

### SNAPSHOT_VARIANT_ENABLED

- **Type:** boolean  
- **Required:** YES  
- **Allowed values:** `true`, `false`  
- **Default:** `false`  
- **Failure:** FAIL if not set to a boolean value  
- **Notes:** if `true`, `SNAPSHOT_VARIANT_PATH` becomes required

---

### RUN_MODE

- **Type:** enum  
- **Required:** YES  
- **Allowed values:**  
  - `DRY_RUN` — resolve and validate all inputs; produce no output files  
  - `VALIDATE_ONLY` — run validators; produce validation log only  
  - `FULL_EXECUTE` — full execution producing all governed artifacts  
- **Default:** `DRY_RUN`  
- **Failure:** FAIL if value is not one of the above

---

### EVIDENCE_ROOT

- **Type:** absolute path  
- **Required:** YES  
- **Default:** `{REPO_ROOT}/docs/evidence/IG.1/`  
- **Validation:** directory must exist or be creatable  
- **Failure:** FAIL if directory cannot be created  
- **Notes:** all raw evidence and ingestion inputs are written here; must not overlap with OUTPUT_ROOT

---

### OUTPUT_ROOT

- **Type:** absolute path  
- **Required:** YES  
- **Default:** `{REPO_ROOT}/docs/pios/IG.1A/`  
- **Validation:** directory must exist or be creatable  
- **Failure:** FAIL if directory cannot be created  
- **Notes:** all governed stream artifacts are written here

---

## 3. VARIABLE RESOLUTION ORDER

1. Explicit caller-provided values (highest authority)
2. CONTRACT-defined defaults (this document)
3. No shell environment inheritance permitted

---

## 4. IMMUTABILITY RULE

Once `bootstrap_state.json` is written, all variables are locked for that execution run. Variables must not change mid-execution.

---

## 5. FORBIDDEN PATTERNS

- Hardcoded credentials or tokens of any kind
- Paths that reference system-level secrets stores
- Variables set to point at live external APIs unless `SOURCE_MODE=LIVE` is explicitly authorized
- Any variable that resolves differently per environment without explicit per-environment declaration

---

## 6. GOVERNANCE

- This contract is owned by IG.1A
- Any new variable requires a versioned update to this contract
- Deprecation requires explicit stream declaration
