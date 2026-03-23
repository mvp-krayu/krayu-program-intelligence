# Stream 43.33 — Execution Report

Stream: 43.33 — Controlled Materialization Execution (44.2)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Execution timestamp: 2026-03-23T12:39:36Z
Contract source: 43.31 (LOCKED)
Execution version: 43.33-v1
Status: COMPLETE

---

## Execution Summary

Stream 43.33 executed the controlled materialization of the canonical governed projection attachment artifact under the 43.31 contract. All steps completed without fail-closed triggers. The canonical artifact is written and post-write validated.

---

## Step Execution Record

**Step 1 — Input Inventory Load**

All 6 mandatory file-based inputs verified present and readable. SHA-256 checksums recorded at time of read.

| Input | Checksum (SHA-256) |
|---|---|
| docs/pios/43.3/validated_binding_payload.json | 71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b |
| docs/pios/44.1/structural_overlay_projection_definition.md | 08e298ac171e5db585043ae15c51a53c4a992c9ca2be57ba8c61951fa88bc951 |
| docs/pios/44.2/projection_attachment_contract.md | f6ca91a48708b0d0cb5e0fc52f3b899ca336d3994464567cd173c21129f41e17 |
| docs/pios/contracts/43.31_execution_contract.md | 0ae54ffaae289424ef788f96da5f110f0beef38debaad0ac96fe1f06f1fbfe67 |
| docs/pios/43.31/materialization_contract.md | 0747ae0e33854f49cea1d3bb69f1ba6b58346c3b634256920101c052341946de |
| docs/pios/43.31/reproducibility_contract.md | 26e95e18afa8d295f7a6549a6789017667a078c5639f50eebbe91e27d8a8244f |

Provenance support (not authoritative, used for verification only):

| Input | Checksum (SHA-256) |
|---|---|
| docs/pios/43.32/validation_log.json | dc558b5117b8cb4d7cde7ffb4b9bc080c538726ba97c7fd1e644416785522963 |
| docs/pios/43.32/replay_record.md | 1593774a950c66eee904f160e451d43eae5b5e514b65d6d7b6159855816231d4 |

Result: PASS — no missing inputs. FC triggered: NONE.

**Step 2 — Upstream Artifact Load and Verification**

Read `docs/pios/43.3/validated_binding_payload.json`.
Verified:
- artifact_id: PIOS-43.3-RUN01-VALIDATED-BINDING-PAYLOAD
- contract_version: 43.31-v1
- execution_version: 43.32-v1
- stats: total=5, valid=5, invalid=0
- input file SHA-256 (authoritative): `71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b`
- embedded artifact_checksum field (binding array integrity seal): `25c2e9dc04dd6f06dacf4a6f973b6b2306c15067aa9e5d09a24b9d4783009f69` (confirmed as internal field value only; not the input file checksum)
- all 5 per-record checksums recomputed and matched
- all 5 records validation_status = VALID

Result: PASS — canonical upstream artifact confirmed. FC triggered: NONE.

**Step 3 — Projection Attachment Candidate Resolution**

5 attachment candidates derived — one per VALID binding record. Each binding record maps to exactly one node_id already resolved in the upstream record. Exact node_id match confirmed against pie_vault/02_Capabilities/ (same resolution as 43.32). No inference. No gap filling.

| Binding ID | Node ID | Attachment ID |
|---|---|---|
| BIND-SIG-001-C_02_Network_Security_Intelligence_Collection | C_02_Network_Security_Intelligence_Collection | PROJ-BIND-SIG-001-C_02_...-C_02_... |
| BIND-SIG-002-C_27_Caching_Layer | C_27_Caching_Layer | PROJ-BIND-SIG-002-C_27_...-C_27_... |
| BIND-SIG-003-C_30_Domain_Event_Bus | C_30_Domain_Event_Bus | PROJ-BIND-SIG-003-C_30_...-C_30_... |
| BIND-SIG-004-C_29_Platform_Monorepo_Container | C_29_Platform_Monorepo_Container | PROJ-BIND-SIG-004-C_29_...-C_29_... |
| BIND-SIG-005-C_40_Delivery_and_Quality_Infrastructure | C_40_Delivery_and_Quality_Infrastructure | PROJ-BIND-SIG-005-C_40_...-C_40_... |

Result: PASS — 5 candidates, all exactly resolved. FC triggered: NONE.

**Step 4 — Record Validation (44.2)**

Each of the 5 records evaluated against all five 44.2 attachment rules independently.

| Record | NR-001 | BI-001 | EL-001 | OB-001 | NT-001 | Outcome |
|---|---|---|---|---|---|---|
| PROJ-BIND-SIG-001-... | PASS | PASS | PASS | PASS | PASS | ATTACHED |
| PROJ-BIND-SIG-002-... | PASS | PASS | PASS | PASS | PASS | ATTACHED |
| PROJ-BIND-SIG-003-... | PASS | PASS | PASS | PASS | PASS | ATTACHED |
| PROJ-BIND-SIG-004-... | PASS | PASS | PASS | PASS | PASS | ATTACHED |
| PROJ-BIND-SIG-005-... | PASS | PASS | PASS | PASS | PASS | ATTACHED |

No records rejected. FC triggered: NONE.

**Step 5 — Record Construction**

5 records constructed. Per record:
- signal_reference: carried verbatim from upstream binding record
- node_reference: node_id + vault_path from upstream binding record
- evidence_reference: evidence_embedding carried verbatim from upstream binding record
- projection_reference: "{binding_id}:VALID:43.31-v1"
- emphasis field: not introduced; no emphasis logic applied
- upstream_artifact_checksum: 71c628d1... (authoritative file-level SHA-256 of validated_binding_payload.json)

No synthetic content. No transformation. No emphasis derivation.

Per-record checksums:

| Attachment ID (abbreviated) | Checksum (SHA-256) |
|---|---|
| PROJ-BIND-SIG-001-C_02_...-C_02_... | 0b920378495d317475213cf676570712b2715521fd9e8a5134f5f7c3e05fd9c3 |
| PROJ-BIND-SIG-002-C_27_...-C_27_... | 56f1fd58093b92420142051d915d86f04bba60caa8a7d03c803e6493b4828b5c |
| PROJ-BIND-SIG-003-C_30_...-C_30_... | 7e278b98a860d5e3a81271c0f8e2fef12a2a9b2a3c589442bcd9549c1f6b2351 |
| PROJ-BIND-SIG-004-C_29_...-C_29_... | 9b205b02ce3b3c55e433062a39b36b12ab1e56e737f49141981c29400d3d8352 |
| PROJ-BIND-SIG-005-C_40_...-C_40_... | 8213dc932ff9ec363d9731ef7e96d7ec62bd820c0f3aacb88ffdb74f62ad4834 |

**Step 6 — Determinism Enforcement**

Records sorted lexicographically by attachment_id. Canonical JSON serialization: sort_keys=True, separators=(',', ':'), no whitespace variation.

Sorted order confirmed:
1. PROJ-BIND-SIG-001-C_02_...-C_02_...
2. PROJ-BIND-SIG-002-C_27_...-C_27_...
3. PROJ-BIND-SIG-003-C_30_...-C_30_...
4. PROJ-BIND-SIG-004-C_29_...-C_29_...
5. PROJ-BIND-SIG-005-C_40_...-C_40_...

**Step 7 — Canonical Artifact Write**

Written to: `docs/pios/44.2/projection_attachment.json`
Artifact-level checksum: `bf20bec6f01dbca39e44233187214239e450e041e0f48516f5b016c890d090e8`

**Step 8 — Post-Write Validation**

12/12 validation checks PASS:
- Top-level schema completeness
- contract_version = 43.31-v1
- 5 records, all ATTACHED
- All per-record fields present
- Provenance completeness (all 4 evidence_reference fields)
- Upstream binding checksum continuity (all records)
- Emphasis = none for all records
- Lexicographic ordering confirmed
- Per-record checksums verified (all 5)
- Artifact-level checksum verified
- validation_trace: 5 rules per record, all expected rule_ids, all PASS
- Canonical path correct

---

## Fail-Closed Trigger Log

No fail-closed triggers fired during this execution.

All FC conditions monitored: no missing inputs, no schema mismatch, no missing binding reference, no missing projection reference, no invalid attachment linkage, no contract mismatch, no checksum failure, no non-deterministic ordering, no ambiguous attachment, no inference required.

---

## Output Artifact

Path: `docs/pios/44.2/projection_attachment.json`
artifact_checksum: `bf20bec6f01dbca39e44233187214239e450e041e0f48516f5b016c890d090e8`
upstream_binding_checksum (file-level SHA-256): `71c628d1ce0e4dd80800eaafe84ae3e5a922302adba9543d44f07ddad3c8aa7b`
contract_version: `43.31-v1`
execution_version: `43.33-v1`
total: 5 | attached: 5 | rejected: 0
