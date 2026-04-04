# IG.1A — Bootstrap Interface Specification

**Stream:** IG.1A  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines the bootstrap interface that any IG.1 ingestion execution must satisfy before execution begins. All variables defined here must be resolved explicitly. No variable may remain implicit or derived from environment defaults without declaration.

---

## 2. INTERFACE CONTRACT

The bootstrap interface is the formal entry boundary for IG.1 ingestion. It governs:

- workspace resolution
- repository binding
- anchor reference lock
- source mode selection
- snapshot configuration
- run mode selection
- evidence and output routing

No ingestion execution may begin unless all mandatory fields are resolved and written to a bootstrap state file.

---

## 3. MANDATORY FIELDS

| Field | Type | Description |
|---|---|---|
| `WORKSPACE_ROOT` | path | Absolute path to the working filesystem root |
| `REPO_ROOT` | path | Absolute path to the k-pi-core repository |
| `BASELINE_ANCHOR` | string | Tag name of the protected baseline anchor (READ-ONLY) |
| `SOURCE_MODE` | enum | One of: `SNAPSHOT`, `LIVE` (see SOURCE_BINDING_MODEL) |
| `SNAPSHOT_BASELINE_PATH` | path | Path to the snapshot file used as ingestion source |
| `SNAPSHOT_VARIANT_ENABLED` | bool | Whether variant snapshot comparison is active |
| `RUN_MODE` | enum | One of: `DRY_RUN`, `VALIDATE_ONLY`, `FULL_EXECUTE` |
| `EVIDENCE_ROOT` | path | Directory where all ingestion evidence is written |
| `OUTPUT_ROOT` | path | Directory where stream artifacts are written |

---

## 4. OPTIONAL FIELDS

| Field | Type | Description |
|---|---|---|
| `SNAPSHOT_VARIANT_PATH` | path | Path to variant snapshot (required if `SNAPSHOT_VARIANT_ENABLED=true`) |
| `EXECUTION_ID` | string | Unique run identifier for traceability (defaults to timestamp if unset) |
| `LOG_LEVEL` | enum | One of: `SILENT`, `SUMMARY`, `VERBOSE` (defaults to `SUMMARY`) |

---

## 5. BOOTSTRAP STATE FILE

All resolved fields must be written to:

```
{OUTPUT_ROOT}/bootstrap_state.json
```

Format:

```json
{
  "stream": "IG.1A",
  "execution_id": "<value>",
  "timestamp": "<ISO-8601>",
  "fields": {
    "WORKSPACE_ROOT": "<resolved>",
    "REPO_ROOT": "<resolved>",
    "BASELINE_ANCHOR": "<resolved>",
    "SOURCE_MODE": "<resolved>",
    "SNAPSHOT_BASELINE_PATH": "<resolved>",
    "SNAPSHOT_VARIANT_ENABLED": "<resolved>",
    "RUN_MODE": "<resolved>",
    "EVIDENCE_ROOT": "<resolved>",
    "OUTPUT_ROOT": "<resolved>"
  }
}
```

---

## 6. PRE-EXECUTION GATE

Before any ingestion execution proceeds:

1. All mandatory fields must be resolved
2. `bootstrap_state.json` must exist and be valid JSON
3. `BASELINE_ANCHOR` must match a protected git tag (read-only verification)
4. `SNAPSHOT_BASELINE_PATH` must exist if `SOURCE_MODE=SNAPSHOT`
5. `RUN_MODE` must be one of the allowed enum values

Any unresolved field → FAIL CLOSED

---

## 7. ANCHOR PROTECTION RULE

The `BASELINE_ANCHOR` field binds to one of:

- `pios-core-v0.4-final`
- `demo-execlens-v1-final`
- `governance-v1-final`

These are READ-ONLY reference points. No bootstrap execution may write to, rebase on, or mutate these anchors.

---

## 8. GOVERNANCE

- This spec is owned by IG.1A
- Modifications require a new stream contract
- No field may be added or removed without a versioned update
