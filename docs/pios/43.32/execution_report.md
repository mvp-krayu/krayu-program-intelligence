# Stream 43.32 — Execution Report

Stream: 43.32 — Controlled Materialization Execution (43.3)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Execution timestamp: 2026-03-23T11:23:46Z
Contract source: 43.31 (LOCKED)
Execution version: 43.32-v1
Status: COMPLETE

---

## Execution Summary

Stream 43.32 executed the controlled materialization of the canonical governed binding artifact under the 43.31 contract. All steps completed without fail-closed triggers. The canonical artifact is written and post-write validated.

---

## Step Execution Record

**Step 1 — Input Inventory Load**

All 9 file-based mandatory inputs verified present and readable. Pie vault directories confirmed present with .md files. SHA-256 checksums recorded for all inputs at time of read.

| Input | Checksum (SHA-256) |
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
| docs/pios/41.2/pie_vault/02_Capabilities/ (directory) | PRESENT — 42 .md files confirmed |

Result: PASS — no missing inputs, no fail-closed trigger.

**Step 2 — Binding Candidate Resolution**

Binding candidates derived from signal_registry.json (5 signals: SIG-001 through SIG-005). All 5 signals present in evidence_mapping_index.json. Each signal maps to one capability-level structural node via its semantic_anchor.capability_id, exactly resolved to the file stem in pie_vault/02_Capabilities/.

No inference. No gap filling. All bindings have exact node matches.

| Signal | Node Resolution | Vault File |
|---|---|---|
| SIG-001 | CAP-02 → C_02_Network_Security_Intelligence_Collection | 02_Capabilities/C_02_Network_Security_Intelligence_Collection.md |
| SIG-002 | CAP-27 → C_27_Caching_Layer | 02_Capabilities/C_27_Caching_Layer.md |
| SIG-003 | CAP-30 → C_30_Domain_Event_Bus | 02_Capabilities/C_30_Domain_Event_Bus.md |
| SIG-004 | CAP-29 → C_29_Platform_Monorepo_Container | 02_Capabilities/C_29_Platform_Monorepo_Container.md |
| SIG-005 | CAP-40 → C_40_Delivery_and_Quality_Infrastructure | 02_Capabilities/C_40_Delivery_and_Quality_Infrastructure.md |

Result: PASS — 5 binding candidates, all exactly resolved.

**Step 3 — Record Validation (43.2 + 43.3)**

Each of the 5 records evaluated against all five 43.3 validation dimensions independently.

| Record | SV-001 | SI-001 | EC-001 | DC-001 | BC-001 | Outcome |
|---|---|---|---|---|---|---|
| BIND-SIG-001-C_02_... | PASS | PASS | PASS | PASS | PASS | VALID |
| BIND-SIG-002-C_27_... | PASS | PASS | PASS | PASS | PASS | VALID |
| BIND-SIG-003-C_30_... | PASS | PASS | PASS | PASS | PASS | VALID |
| BIND-SIG-004-C_29_... | PASS | PASS | PASS | PASS | PASS | VALID |
| BIND-SIG-005-C_40_... | PASS | PASS | PASS | PASS | PASS | VALID |

No records rejected. No fail-closed trigger.

**Step 4 — Record Construction**

5 records constructed with all required fields. Provenance chain carried verbatim from evidence_mapping_index.json. signal_state carried from upstream source object states. association_basis carried from semantic_anchor. No synthetic content introduced.

Per-record checksums computed (SHA-256, canonical JSON, sort_keys, no whitespace, excluding checksum field).

| Binding ID | Checksum (SHA-256) |
|---|---|
| BIND-SIG-001-C_02_Network_Security_Intelligence_Collection | 58555a38009476aeab9eaf553fab6914a3bbc850504abdf90f4996423f25af52 |
| BIND-SIG-002-C_27_Caching_Layer | f7d1e64cb3d124c5205417ed60582f003ce9c4cdbdd0cd68344e90c1b1e54fcb |
| BIND-SIG-003-C_30_Domain_Event_Bus | b8127f20558a19441eda4a314ba550fe5c6599f2d0f7a8ef6486f77843b8f8f3 |
| BIND-SIG-004-C_29_Platform_Monorepo_Container | 89d3ee360cb02846d7eb1e5020f7ffda23424a9fae1d3b29dcabd8e896f2c96d |
| BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure | 4b27e1e8d5a1bf3b3eb083a56724c5a81f3b101b0881970e7eac2ce4565ebe8f |

**Step 5 — Determinism Enforcement**

Records sorted lexicographically by binding_id. Canonical JSON serialization: sort_keys=True, separators=(',', ':'), no whitespace variation.

Sorted order confirmed:
1. BIND-SIG-001-C_02_Network_Security_Intelligence_Collection
2. BIND-SIG-002-C_27_Caching_Layer
3. BIND-SIG-003-C_30_Domain_Event_Bus
4. BIND-SIG-004-C_29_Platform_Monorepo_Container
5. BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure

**Step 6 — Canonical Artifact Write**

Written to: `docs/pios/43.3/validated_binding_payload.json`
Artifact-level checksum: `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`

**Step 7 — Post-Write Validation**

Re-read artifact. Recomputed artifact-level SHA-256. Compared to stored artifact_checksum.

10/10 validation checks PASS:
- Top-level schema completeness
- contract_version = 43.31-v1
- 5 records, all VALID
- All per-record fields present
- Provenance completeness (all 4 evidence embedding fields)
- Lexicographic ordering confirmed
- Per-record checksums verified (all 5)
- Artifact-level checksum verified
- All validation_status = VALID
- validation_trace: 5 rules per record, all expected rule_ids, all PASS

---

## Fail-Closed Trigger Log

No fail-closed triggers fired during this execution.

FC-001 (missing mandatory input): NOT TRIGGERED
FC-002 (schema mismatch): NOT TRIGGERED
FC-003 (missing evidence mapping): NOT TRIGGERED
FC-004 (orphaned evidence): NOT TRIGGERED
FC-005 (empty evidence chain): NOT TRIGGERED
FC-006 (checksum failure): NOT TRIGGERED
FC-007 (non-deterministic ordering): NOT TRIGGERED
FC-008 (ambiguous mapping): NOT TRIGGERED
FC-009 (missing temporal reference): NOT TRIGGERED
FC-010 (missing semantic anchor fields): NOT TRIGGERED
FC-011 (zero valid records): NOT TRIGGERED
FC-012 (contract version mismatch): NOT TRIGGERED

---

## Output Artifact

Path: `docs/pios/43.3/validated_binding_payload.json`
artifact_checksum: `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69`
contract_version: `43.31-v1`
execution_version: `43.32-v1`
total: 5 | valid: 5 | invalid: 0
