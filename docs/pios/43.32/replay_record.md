# Stream 43.32 — Reproducibility Record

Stream: 43.32 — Controlled Materialization Execution (43.3)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Contract source: 43.31 (LOCKED)
contract_version: 43.31-v1
execution_version: 43.32-v1

---

## Purpose

This record contains all information required to reproduce the canonical binding artifact produced by Stream 43.32 under the governed replay procedure defined in docs/pios/43.31/reproducibility_contract.md.

A reproduction is governed-equivalent only if all four conditions in the Replay Equivalence Rule are satisfied (reproducibility_contract.md §Replay Equivalence Rule).

---

## Input Inventory (Exact)

| Path | SHA-256 Checksum |
|---|---|
| docs/pios/41.4/signal_registry.json | f2ecb42473ee71bf1381b144fdc2d0484ae6943e862d06d9e1347e8c0cd769e3 |
| docs/pios/41.4/evidence_mapping_index.json | 325fabf7f926126e0de3dfb840b3763e989485ec30e2be7c4ca0c049f191333b |
| docs/pios/41.5/query_signal_map.json | 330130c6003c4b63e10d773d041619050e41cf6a8fd080edac6bd576b538159b |
| docs/pios/43.1/signal_to_structure_binding.md | 9c062070814e52e7a2d8c84dce5fcbd48ae237728db8468e0c7973e7a6676473 |
| docs/pios/43.2/binding_payload_contract.md | 0ef33c28391d72942a5c6c5227a1e9899477c225c3baacf4d852c10d963fa59c |
| docs/pios/43.3/binding_validation_envelope.md | ae4c2f6a563449e86b635bdbcc222403432998a3fe7ff77de10775e97cb674b8 |
| docs/pios/contracts/43.31_execution_contract.md | 0ae54ffaae289424ef788f96da5f110f0beef38debaad0ac96fe1f06f1fbfe67 |
| docs/pios/43.31/materialization_contract.md | 0747ae0e33854f49cea1d3bb69f1ba6b58346c3b634256920101c052341946de |
| docs/pios/43.31/reproducibility_contract.md | 26e95e18afa8d295f7a6549a6789017667a078c5639f50eebbe91e27d8a8244f |
| docs/pios/41.2/pie_vault/02_Capabilities/C_02_Network_Security_Intelligence_Collection.md | 43068f0855d855de83f9b4caae335d479f808d7ae4c3180733e36fbf98a7e443 |
| docs/pios/41.2/pie_vault/02_Capabilities/C_27_Caching_Layer.md | f9f03c9cd1116983adfb1f228db3068ff8a709090d68e721a0f589d2bb6d977b |
| docs/pios/41.2/pie_vault/02_Capabilities/C_30_Domain_Event_Bus.md | 9d5be03293a78ec40e2d0a7125c839d9f01be33c248133bd28a9ec27e96163fa |
| docs/pios/41.2/pie_vault/02_Capabilities/C_29_Platform_Monorepo_Container.md | 2d04043c24496a77c45b68160f5fa524aa788ea65285a31557102d31a244cd94 |
| docs/pios/41.2/pie_vault/02_Capabilities/C_40_Delivery_and_Quality_Infrastructure.md | ca5e176cc26374c2582f4016ba9de9335467d21cd2295ac7fc1d2294fde950e8 |

---

## Execution Timestamp

2026-03-23T11:23:46Z

---

## Deterministic Ordering Rule

Records sorted lexicographically by binding_id (ascending). Canonical JSON serialization: sort_keys=True, separators=(',', ':'), no whitespace variation.

Ordered binding_ids in this execution:
1. BIND-SIG-001-C_02_Network_Security_Intelligence_Collection
2. BIND-SIG-002-C_27_Caching_Layer
3. BIND-SIG-003-C_30_Domain_Event_Bus
4. BIND-SIG-004-C_29_Platform_Monorepo_Container
5. BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure

---

## Checksum Verification

Algorithm: SHA-256
Encoding: lowercase hex string
Input: JSON-serialized content with deterministic key ordering (lexicographic) and no whitespace variation
Per-record checksum: SHA-256 applied to record JSON with all fields present except the `checksum` field itself
Artifact-level checksum: SHA-256 applied to the full `bindings` array (all records with their per-record checksums)

| Binding ID | Per-Record Checksum |
|---|---|
| BIND-SIG-001-C_02_Network_Security_Intelligence_Collection | 58555a38009476aeab9eaf553fab6914a3bbc850504abdf90f4996423f25af52 |
| BIND-SIG-002-C_27_Caching_Layer | f7d1e64cb3d124c5205417ed60582f003ce9c4cdbdd0cd68344e90c1b1e54fcb |
| BIND-SIG-003-C_30_Domain_Event_Bus | b8127f20558a19441eda4a314ba550fe5c6599f2d0f7a8ef6486f77843b8f8f3 |
| BIND-SIG-004-C_29_Platform_Monorepo_Container | 89d3ee360cb02846d7eb1e5020f7ffda23424a9fae1d3b29dcabd8e896f2c96d |
| BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure | 4b27e1e8d5a1bf3b3eb083a56724c5a81f3b101b0881970e7eac2ce4565ebe8f |

Artifact-level checksum: `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`

---

## Output Artifact

Path: `docs/pios/43.3/validated_binding_payload.json`
artifact_checksum: `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`
contract_version: `43.31-v1`
execution_version: `43.32-v1`
total: 5 | valid: 5 | invalid: 0

---

## Replay Equivalence Conditions

Per reproducibility_contract.md §Replay Equivalence Rule, a reproduction is governed-equivalent to this execution if and only if:

1. All input file checksums match exactly those listed in the Input Inventory table above
2. contract_version is `43.31-v1`
3. The replay follows the exact step order: R-1 → R-2 → R-3 → R-4 (per reproducibility_contract.md)
4. The output artifact_checksum matches `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`

If any of the four conditions differ, the reproduction is a NEW materialization, not a replay of this run.
