# Governed Reproduction & Replay Contract

Stream: 43.31 — Governed Materialization & Reproducibility Contract
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Authority: materialization_contract.md §3.7
Status: AUTHORITATIVE — CONTRACT DEFINITION

---

## Purpose

This document defines the complete reproduction and replay procedure for governed materialization of 43.3 and 44.2 runtime artifacts. Any execution that does not follow this procedure exactly is not a governed reproduction.

---

## Required Inputs (Full List)

| Input | Path | Required For | Mandatory |
|---|---|---|---|
| Signal registry | `docs/pios/41.4/signal_registry.json` | 43.3 binding step | YES |
| Evidence mapping index | `docs/pios/41.4/evidence_mapping_index.json` | 43.3 binding step | YES |
| Topology vault — Domains | `docs/pios/41.2/pie_vault/01_Domains/` | 43.3 + 44.2 node resolution | YES |
| Topology vault — Capabilities | `docs/pios/41.2/pie_vault/02_Capabilities/` | 43.3 + 44.2 node resolution | YES |
| Topology vault — Components | `docs/pios/41.2/pie_vault/03_Components/` | 43.3 + 44.2 node resolution | YES |
| Validated binding payload | `docs/pios/43.3/validated_binding_payload.json` | 44.2 projection step | YES (after step R-3) |

No optional inputs. No alternative inputs. If any mandatory input is absent at the step that requires it, the entire process terminates with no output.

---

## Required Contract Version

```
contract_version: 43.31-v1
```

All artifacts produced by a governed reproduction must carry this version string in every record's `contract_version` field. Any artifact produced under a different version string is not governed by this contract.

---

## Required Execution Version Placeholder

```
execution_version: [TO BE ASSIGNED AT EXECUTION STREAM]
```

The specific script version, commit hash, or execution identifier that produced the artifact must be recorded in the audit log at materialization time. This contract does not assign it — the executing stream does.

---

## Deterministic Execution Order

```
41.x  →  43.3  →  44.2
```

Step order is fixed and non-commutable. 44.2 cannot execute before 43.3 because its input is the 43.3 output. 43.3 cannot execute before 41.x inputs are verified present and checksum-stable.

No step may be skipped. No step may be reordered. No step may be replaced with a cached result unless that cached result carries a matching `artifact_checksum` verified against the current source inputs.

---

## Expected Output Locations

| Artifact | Path | Produced By Step |
|---|---|---|
| Validated binding payload | `docs/pios/43.3/validated_binding_payload.json` | R-3 |
| Projection attachment | `docs/pios/44.2/projection_attachment.json` | R-6 |

---

## Checksum Verification Method

Algorithm: **SHA256**
Encoding: lowercase hex string
Input: JSON-serialized artifact content with deterministic key ordering (lexicographic) and no whitespace variation

Per-record checksum: SHA256 applied to the record JSON with all fields present except the `checksum` field itself.

Artifact-level checksum: SHA256 applied to the full JSON array (all records, serialized with deterministic key ordering).

Verification pass condition: recomputed checksum equals stored checksum exactly. Any mismatch is FC-006 → TERMINATE — NO OUTPUT.

---

## Replay Procedure Steps (Ordered, Explicit)

**R-1 — Input verification**

Verify that all mandatory 41.x inputs are present at their canonical paths:
- `docs/pios/41.4/signal_registry.json` — exists, readable
- `docs/pios/41.4/evidence_mapping_index.json` — exists, readable
- `docs/pios/41.2/pie_vault/01_Domains/` — exists, contains `.md` files
- `docs/pios/41.2/pie_vault/02_Capabilities/` — exists, contains `.md` files
- `docs/pios/41.2/pie_vault/03_Components/` — exists, contains `.md` files

Record SHA256 checksum of each input file at time of read. If any file is absent or unreadable: TERMINATE — NO OUTPUT.

**R-2 — Schema validation of 41.x inputs**

Verify that `signal_registry.json` contains at minimum: `signals` array with entries carrying `signal_id`, `statement`, `domain_id`, `capability_id`, `component_ids`, `source_refs`.

Verify that `evidence_mapping_index.json` contains at minimum: `signals` array with entries carrying `signal_id`, `source_object_id`, `semantic_anchor`, `evidence_chain`, `temporal_reference`.

If required fields are absent: TERMINATE — NO OUTPUT.

**R-3 — 43.3 binding and validation execution**

For each signal in `signal_registry.json`:

  R-3a. Locate corresponding evidence entry in `evidence_mapping_index.json` by `signal_id`.
       If absent: mark record INVALID (FC-003); continue.

  R-3b. Verify `evidence_chain` is non-null and non-empty.
       If absent or empty: mark record INVALID (FC-005); continue.

  R-3c. Verify `temporal_reference` is present (may be non-null string).
       If absent: mark record INVALID (FC-009); continue.

  R-3d. Verify `semantic_anchor` contains `domain_id`, `capability_id`, `component_ids`.
       If absent: mark record INVALID (FC-010); continue.

  R-3e. Resolve node_id against pie_vault topology (exact filename stem match).
       Domain: match `domain_id` pattern to `01_Domains/D_*.md` file stem.
       Capability: match `capability_id` pattern to `02_Capabilities/C_*.md` file stem.
       Components: match each `component_id` to `03_Components/CMP_*.md` file stem.
       If any node_id cannot be exactly resolved: mark record INVALID (FC-006); continue.

  R-3f. Run 43.3 validation checks (five dimensions per §3.4):
       Structure Validity, Signal Integrity, Evidence Completeness, Derivation Compliance, Boundary Compliance.
       If any dimension fails: mark record INVALID; record failing dimension in `validation_trace`.

  R-3g. Assign `binding_id` = `BIND-{signal_id}-{node_id}`.

  R-3h. Compute per-record SHA256 checksum (all fields except `checksum`).

  R-3i. Append record to output array with `validation_status: VALID | INVALID`.

  R-3j. Set `contract_version: 43.31-v1` and `source_snapshot_reference`.

After processing all signals:

  R-3k. If zero VALID records remain: TERMINATE — NO OUTPUT — emit observability record.

  R-3l. Write full array to `docs/pios/43.3/validated_binding_payload.json`.
        Compute artifact-level SHA256. Write artifact metadata envelope.

**R-4 — 43.3 output verification**

Re-read `docs/pios/43.3/validated_binding_payload.json`.
Recompute artifact-level SHA256. Compare to stored `artifact_checksum`.
If mismatch: TERMINATE — NO OUTPUT (FC-006).

Count total records, VALID records, INVALID records. Record in audit log.

**R-5 — 44.2 projection attachment execution**

Read `docs/pios/43.3/validated_binding_payload.json`.
Select only records where `validation_status: VALID`.

For each VALID binding record:

  R-5a. Extract `node_reference.node_id` and `node_reference.source_reference`.

  R-5b. Perform exact resolution of `node_id` against pie_vault (same R-3e rule).
        If resolution fails: RECORD REJECTED — projection element not produced (FC-008).

  R-5c. Carry `signal_reference.*` and `evidence_embedding.*` unchanged from binding record.

  R-5d. Set `upstream_binding_reference` = binding record's `binding_id`.

  R-5e. Set `emphasis: none` (default — upstream assignment not yet defined).
        If upstream emphasis is provided: validate against closed set {high, medium, low, none}.
        If outside closed set: treat as `none` per 44.3 E-VAL-001.

  R-5f. Set `validation_basis_reference` = `"{binding_id}:VALID:43.31-v1"`.

  R-5g. Assign `projection_id` = `PROJ-{binding_id}-{node_id}`.

  R-5h. Compute per-record SHA256 checksum.

  R-5i. Set `contract_version: 43.31-v1` and `source_snapshot_reference`.

  R-5j. Append to projection array.

After processing all VALID binding records:

  R-5k. Write full array to `docs/pios/44.2/projection_attachment.json`.
        Compute artifact-level SHA256. Write artifact metadata envelope.

**R-6 — 44.2 output verification**

Re-read `docs/pios/44.2/projection_attachment.json`.
Recompute artifact-level SHA256. Compare to stored `artifact_checksum`.
If mismatch: TERMINATE — NO OUTPUT (FC-006).

**R-7 — Audit log emission**

Emit structured audit log entry with:
- Execution timestamp (ISO-8601 UTC)
- SHA256 checksums of all 41.x input files as read
- R-3 output: total, valid, invalid, rejected counts
- R-5 output: total projected, rejected counts
- Output artifact paths and checksums
- Contract version: 43.31-v1
- Execution version: [as assigned by executing stream]
- Final status: COMPLETE | FAILED

---

## Replay Equivalence Rule

A reproduction is governed-equivalent if and only if:
1. It uses the same 41.x input files (identical checksums to prior run)
2. It uses the same contract_version (43.31-v1)
3. It follows the exact step order above
4. The output artifact_checksums match those of the prior run

If any of the four conditions differ, the reproduction is a NEW materialization, not a replay of the prior run.
