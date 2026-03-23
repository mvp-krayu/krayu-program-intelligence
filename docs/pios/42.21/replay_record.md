# Stream 42.21 — Reproducibility Record

Stream: 42.21 — Controlled Runtime Intake Execution
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Execution version: 42.21-v1
Branch: feature/42-21-governed-runtime-intake

---

## Purpose

This record contains all information required to reproduce the controlled runtime intake executed by Stream 42.21. A reproduction is governed-equivalent if all four equivalence conditions are satisfied.

---

## Input Inventory (Exact)

| Input | File-Level SHA-256 |
|---|---|
| docs/pios/43.3/validated_binding_payload.json | 71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b |
| docs/pios/44.2/projection_attachment.json | e580a5edb62e2ec6fe8e683a5166532edd5ff6418d868a31565c9f091af716ae |
| docs/pios/contracts/43.31_execution_contract.md | 0ae54ffaae289424ef788f96da5f110f0beef38debaad0ac96fe1f06f1fbfe67 |
| docs/pios/43.31/reproducibility_contract.md | 26e95e18afa8d295f7a6549a6789017667a078c5639f50eebbe91e27d8a8244f |

---

## Execution Timestamp

2026-03-23T13:51:26Z

---

## Deterministic Ordering Rule

Runtime intake records processed in lexicographic order by attachment_id (ascending).

Ordered attachment_ids in this execution:
1. PROJ-BIND-SIG-001-C_02_Network_Security_Intelligence_Collection-C_02_Network_Security_Intelligence_Collection
2. PROJ-BIND-SIG-002-C_27_Caching_Layer-C_27_Caching_Layer
3. PROJ-BIND-SIG-003-C_30_Domain_Event_Bus-C_30_Domain_Event_Bus
4. PROJ-BIND-SIG-004-C_29_Platform_Monorepo_Container-C_29_Platform_Monorepo_Container
5. PROJ-BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure-C_40_Delivery_and_Quality_Infrastructure

---

## Checksum Verification Rule

Algorithm: SHA-256
Encoding: lowercase hex string
File-level checksums: SHA-256 of input file byte content (as recorded in Input Inventory)
Snapshot checksum: SHA-256 of canonical JSON of runtime intake records (sort_keys=True, separators=(',',':'), no whitespace)

---

## Runtime Intake Snapshot

Path: `docs/pios/42.21/runtime_intake_snapshot.json`
Label: NON-CANONICAL — VALIDATION ONLY — REMOVABLE
canonical: false
Snapshot checksum: `0dce38b03dcf2de25cd89fd0ddf5ccb3f62ed1676d0f8227c3ae28d20d05a593`
Records: 5 | Ingested: 5 | Failed: 0

---

## Rerun Instructions

To produce a governed-equivalent reproduction:

1. Verify all 4 input files are present at canonical paths with SHA-256 checksums matching the Input Inventory table above
2. Read `docs/pios/43.3/validated_binding_payload.json` and verify all binding records = VALID
3. Read `docs/pios/44.2/projection_attachment.json` and verify upstream_binding_checksum = `71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b`
4. Validate that all projection binding_id references resolve to binding records — no orphans
5. Construct runtime intake records carrying verbatim: binding_id, attachment_id, signal_reference, node_reference, projection_reference, evidence_reference, attachment_status, contract_version
6. Add no semantic fields, no derived values, no fallback logic
7. Process in lexicographic order by attachment_id (ascending)
8. Compute snapshot checksum using SHA-256 (canonical JSON, sort_keys, no whitespace)
9. Verify snapshot checksum matches: `0dce38b03dcf2de25cd89fd0ddf5ccb3f62ed1676d0f8227c3ae28d20d05a593`

---

## Replay Equivalence Conditions

A reproduction is governed-equivalent to this execution if and only if:

1. All input file checksums match exactly those listed in the Input Inventory table above
2. The runtime intake logic preserves all upstream fields without transformation, inference, or semantic extension
3. Processing order is lexicographic by attachment_id (ascending)
4. The snapshot checksum matches `0dce38b03dcf2de25cd89fd0ddf5ccb3f62ed1676d0f8227c3ae28d20d05a593`

If any condition differs, the reproduction is a new intake execution, not a replay of this run.
