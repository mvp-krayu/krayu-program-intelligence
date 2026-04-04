# IG.1A — Source Binding Model

**Stream:** IG.1A  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines how ingestion sources are bound at bootstrap time. It governs source type selection, binding verification, and protection of baseline anchors from source mutation.

---

## 2. SOURCE BINDING OVERVIEW

A source binding is the formal declaration of what data a given IG.1 execution will ingest. The binding must be:

- explicit (no inferred sources)
- declared before execution begins
- locked at bootstrap time (immutable during a run)
- traceable from `bootstrap_state.json`

---

## 3. SOURCE TYPES

### 3.1 SNAPSHOT (default, in-scope for IG.1A)

A snapshot source is a static file that was captured at a prior point in time. It is the only authorized source mode for IG.1A.

| Property | Value |
|---|---|
| Authorized | YES |
| In scope for IG.1A | YES |
| Mutability | READ-ONLY during execution |
| Live connection required | NO |
| Credential required | NO |

**Binding fields:**

- `SOURCE_MODE = SNAPSHOT`
- `SNAPSHOT_BASELINE_PATH` = absolute path to the snapshot file

**Binding verification:**

1. File exists at `SNAPSHOT_BASELINE_PATH`
2. File is readable
3. File hash is recorded in `bootstrap_state.json` at bind time
4. File is not modified during execution (enforced by hash re-check at close)

---

### 3.2 LIVE (out-of-scope for IG.1A)

A live source connects to an external system (e.g., GitHub API, Jira API) at execution time.

| Property | Value |
|---|---|
| Authorized | NO — requires separate contract |
| In scope for IG.1A | NO |
| Mutability | N/A |
| Live connection required | YES |
| Credential required | YES |

**Rules:**

- `SOURCE_MODE = LIVE` must NOT be set during IG.1A execution
- Any attempt to activate LIVE mode under IG.1A → FAIL CLOSED
- LIVE mode requires its own stream contract with explicit authorization

---

## 4. BASELINE ANCHOR BINDING

The `BASELINE_ANCHOR` variable binds the execution to a protected reference point. This binding is:

- declaration-only (not a checkout or write target)
- used to establish lineage traceability
- recorded in `bootstrap_state.json`

**Allowed anchor values:**

| Anchor Tag | Description |
|---|---|
| `pios-core-v0.4-final` | Core PiOS baseline |
| `demo-execlens-v1-final` | ExecLens demo baseline |
| `governance-v1-final` | Governance baseline |

**Binding rule:**

- The anchor tag must exist in the repository (`git tag`)
- The anchor is referenced, never written to
- No execution output may target an anchor-tagged commit

---

## 5. VARIANT BINDING (conditional)

When `SNAPSHOT_VARIANT_ENABLED = true`:

| Property | Value |
|---|---|
| Additional field required | `SNAPSHOT_VARIANT_PATH` |
| File must exist | YES |
| Hash recorded | YES |
| Used for | Invariance comparison only |

Variant binding does not replace the baseline binding. Both must be present when variant mode is active.

---

## 6. BINDING INTEGRITY RULES

1. Source binding is established at bootstrap time and locked
2. No source path may change mid-execution
3. File hashes of all bound sources must be recorded before ingestion begins
4. Any hash mismatch at close → FAIL and flag evidence mutation

---

## 7. SOURCE BINDING RECORD FORMAT

Written to `bootstrap_state.json` under `source_binding`:

```json
"source_binding": {
  "mode": "SNAPSHOT",
  "baseline": {
    "path": "<SNAPSHOT_BASELINE_PATH>",
    "hash_sha256": "<hash at bind time>"
  },
  "variant": {
    "enabled": false,
    "path": null,
    "hash_sha256": null
  },
  "anchor": {
    "tag": "<BASELINE_ANCHOR>",
    "commit": "<tag commit hash>"
  }
}
```

---

## 8. GOVERNANCE

- This model is owned by IG.1A
- Source type additions require a new authorized stream contract
- No new source type may be activated under this model without a governing contract
