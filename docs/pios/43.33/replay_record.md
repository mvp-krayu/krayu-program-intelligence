# Stream 43.33 — Reproducibility Record

Stream: 43.33 — Controlled Materialization Execution (44.2)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Contract source: 43.31 (LOCKED)
contract_version: 43.31-v1
execution_version: 43.33-v1

---

## Purpose

This record contains all information required to reproduce the canonical projection attachment artifact produced by Stream 43.33 under the governed replay procedure defined in docs/pios/43.31/reproducibility_contract.md.

A reproduction is governed-equivalent only if all four conditions in the Replay Equivalence Rule are satisfied.

---

## Input Inventory (Exact)

| Path | SHA-256 Checksum |
|---|---|
| docs/pios/43.3/validated_binding_payload.json | 71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b |
| docs/pios/44.1/structural_overlay_projection_definition.md | 08e298ac171e5db585043ae15c51a53c4a992c9ca2be57ba8c61951fa88bc951 |
| docs/pios/44.2/projection_attachment_contract.md | f6ca91a48708b0d0cb5e0fc52f3b899ca336d3994464567cd173c21129f41e17 |
| docs/pios/contracts/43.31_execution_contract.md | 0ae54ffaae289424ef788f96da5f110f0beef38debaad0ac96fe1f06f1fbfe67 |
| docs/pios/43.31/materialization_contract.md | 0747ae0e33854f49cea1d3bb69f1ba6b58346c3b634256920101c052341946de |
| docs/pios/43.31/reproducibility_contract.md | 26e95e18afa8d295f7a6549a6789017667a078c5639f50eebbe91e27d8a8244f |

---

## Execution Timestamp

2026-03-23T12:39:36Z

---

## Deterministic Ordering Rule

Records sorted lexicographically by attachment_id (ascending). Canonical JSON serialization: sort_keys=True, separators=(',', ':'), no whitespace variation.

Ordered attachment_ids in this execution:
1. PROJ-BIND-SIG-001-C_02_Network_Security_Intelligence_Collection-C_02_Network_Security_Intelligence_Collection
2. PROJ-BIND-SIG-002-C_27_Caching_Layer-C_27_Caching_Layer
3. PROJ-BIND-SIG-003-C_30_Domain_Event_Bus-C_30_Domain_Event_Bus
4. PROJ-BIND-SIG-004-C_29_Platform_Monorepo_Container-C_29_Platform_Monorepo_Container
5. PROJ-BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure-C_40_Delivery_and_Quality_Infrastructure

---

## Checksum Verification

Algorithm: SHA-256
Encoding: lowercase hex string
Input: JSON-serialized content with deterministic key ordering (lexicographic) and no whitespace variation
Per-record checksum: SHA-256 of record JSON with all fields present except the `checksum` field itself
Artifact-level checksum: SHA-256 of the full `projections` array (all records with per-record checksums)

| Attachment ID (abbreviated) | Per-Record Checksum |
|---|---|
| PROJ-BIND-SIG-001-C_02_...-C_02_... | 0b920378495d317475213cf676570712b2715521fd9e8a5134f5f7c3e05fd9c3 |
| PROJ-BIND-SIG-002-C_27_...-C_27_... | 56f1fd58093b92420142051d915d86f04bba60caa8a7d03c803e6493b4828b5c |
| PROJ-BIND-SIG-003-C_30_...-C_30_... | 7e278b98a860d5e3a81271c0f8e2fef12a2a9b2a3c589442bcd9549c1f6b2351 |
| PROJ-BIND-SIG-004-C_29_...-C_29_... | 9b205b02ce3b3c55e433062a39b36b12ab1e56e737f49141981c29400d3d8352 |
| PROJ-BIND-SIG-005-C_40_...-C_40_... | 8213dc932ff9ec363d9731ef7e96d7ec62bd820c0f3aacb88ffdb74f62ad4834 |

Artifact-level checksum: `bf20bec6f01dbca39e44233187214239e450e041e0f48516f5b016c890d090e8`

---

## Rerun Instructions

To produce a governed-equivalent reproduction of this artifact:

1. Verify all inputs in the Input Inventory table above are present at their canonical paths with matching SHA-256 checksums
2. Verify the upstream binding artifact checksum matches: `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`
3. Execute the attachment logic per reproducibility_contract.md R-5 (steps R-5a through R-5k)
4. Use contract_version: `43.31-v1`
5. Sort output records lexicographically by attachment_id
6. Serialize with sort_keys=True, separators=(',', ':'), no whitespace
7. Verify output artifact_checksum matches: `c2e22fdf7643937304c5bae568a4b458c9178ac182a99577eb4bd6cb850b8b57`

---

## Output Artifact

Path: `docs/pios/44.2/projection_attachment.json`
artifact_checksum: `bf20bec6f01dbca39e44233187214239e450e041e0f48516f5b016c890d090e8`
contract_version: `43.31-v1`
execution_version: `43.33-v1`
total: 5 | attached: 5 | rejected: 0

---

## Replay Equivalence Conditions

Per reproducibility_contract.md §Replay Equivalence Rule:

1. All input file checksums match exactly those listed in the Input Inventory table above (including upstream binding artifact_checksum)
2. contract_version is `43.31-v1`
3. The replay follows the exact step order: R-1 → R-2 → R-3 → ... → R-7 (per reproducibility_contract.md)
4. The output artifact_checksum matches `bf20bec6f01dbca39e44233187214239e450e041e0f48516f5b016c890d090e8`

If any of the four conditions differ, the reproduction is a NEW materialization, not a replay of this run.
