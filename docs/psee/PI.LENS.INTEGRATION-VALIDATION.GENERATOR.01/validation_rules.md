# Validation Rules
## PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01

**Version:** 1.0
**Method:** existence_and_consistency_checks
**Evaluation:** all_checks_independent

---

## Rule Table

| Check ID | Name | Type | Logic |
|----------|------|------|-------|
| IV-01 | intake_manifest_exists | existence | `intake/intake_manifest.json` must exist |
| IV-02 | source_inventory_exists | existence | `intake/source_inventory.json` must exist |
| IV-03 | structural_node_inventory_exists | existence | `structure/40.2/structural_node_inventory.json` must exist |
| IV-04 | structural_topology_log_exists | existence | `structure/40.3/structural_topology_log.json` must exist |
| IV-05 | canonical_topology_exists | existence | `structure/40.4/canonical_topology.json` must exist |
| IV-06 | grounding_state_exists | existence | `ceu/grounding_state_v3.json` must exist |
| IV-07 | dom_layer_exists | existence | `dom/dom_layer.json` must exist |
| IV-08 | binding_envelope_exists | existence | `binding/binding_envelope.json` must exist |
| IV-09 | node_count_consistency | consistency | `len(structural_node_inventory["nodes"]) == dom_layer["total_nodes"]` |
| IV-10 | ceu_count_consistency | consistency | `grounding_state["total_ceu"] == binding_envelope["summary"]["component_entity_count"]` |
| IV-11 | dom_node_coverage | coverage | `set(structural_node_inventory node_ids) ⊆ set(dom_layer["node_to_domain_map"].keys())` |
| IV-12 | no_blueedge_contamination_for_fastapi | isolation | `binding_envelope["client_alias"] == client_id AND dom_layer["client"] == client_id` |

---

## Status Derivation

- `validation_status = PASS` if all checks pass (failed == 0)
- `validation_status = PARTIAL` if some checks pass and some fail (passed > 0 and failed > 0)
- `validation_status = FAIL` if all checks fail (passed == 0)

---

## Design Notes

**All checks independent:** Failures do not cascade. All 12 checks are always run regardless
of earlier results. The summary accurately reflects each check's individual result.

**Consistency checks require both artifacts present:** IV-09, IV-10, IV-11 produce FAIL if
either required artifact is missing (existence check failure upstream indicates the issue).

**IV-12 isolation check scope:** Only verifies client-specific runtime fields (`client_alias` in
binding_envelope, `client` in dom_layer). Orchestrator-internal labels (e.g., `artifact_id`,
`stream` fields) are not checked — they are pipeline constants, not per-client data.

**No semantic inference:** All checks are structural — file existence, integer comparison, set
membership. No content analysis or domain meaning is evaluated.

**Deterministic:** Same inputs always produce same check results. No timestamps or random values
affect check outcomes. Generated timestamp (`generated_at`) is metadata only, not a check input.

---

## Required Inputs (fail-closed if absent)

The generator requires at minimum:
- `intake/intake_manifest.json`
- `structure/40.2/structural_node_inventory.json`
- `ceu/grounding_state_v3.json`
- `dom/dom_layer.json`

If any of the above are missing, the generator exits 1 before running checks. Other inputs
(source_inventory, topology_log, canonical_topology, binding_envelope) produce check-level FAIL
if absent but do not halt execution.
