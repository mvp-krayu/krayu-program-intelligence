# DOM Layer Source Trace
## PI.LENS.REAL-E2E-PIPELINE.BLOCKER-11-CLOSURE.01

**Date:** 2026-05-03
**Contract:** PI.LENS.REAL-E2E-PIPELINE.BLOCKER-11-CLOSURE.01
**Result:** FAIL-CLOSED — NO_GOVERNED_SOURCE

---

## Required Artifact

```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
```

Referenced in `source_manifest.json["dom_layer_path"]`.

---

## Search Performed

All four contract-authorized governed locations searched:

### Location 1: clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/

All files in run:
- `41.x/pressure_zone_projection.json`
- `41.x/signal_projection.json`
- `75.x/condition_correlation_state.json`
- `75.x/pressure_candidate_state.json`
- `75.x/pressure_zone_state.json`
- `binding/binding_envelope.json`
- `vault/admissibility_log.json`
- `vault/binding_envelope.json`
- `vault/canonical_topology.json`
- `vault/coverage_state.json`
- `vault/evidence_trace.json`
- `vault/gauge_state.json`
- `vault/reconstruction_state.json`
- `vault/signal_registry.json`
- `vault/vault_manifest.json`

**No dom_path_domain_layer.json or equivalent dom_groups artifact present.**

Note: `vault/canonical_topology.json` was built FROM `dom_path_domain_layer.json` (confirmed by
its `source_authority` field), but the source itself is absent from this run. It uses
a different schema (`domains[]` with `domain_id`, `domain_name`, `component_ids`) that
does not satisfy Phase 8a's requirement for `dom_groups[]` with `dom_id`, `dom_label`,
`included_nodes`.

### Location 2: clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/

File found: `dom/dom_layer.json`

Inspected:
- `contract_id`: `PI.LENS.DOM-LAYER.GENERATOR.01` (not FastAPI conformance)
- `dom_groups` count: 1 (ROOT domain, 945 nodes)
- Generated from generic 945-node topology for extraction run

**INVALID SOURCE**: wrong contract identity, wrong topology (945 nodes/1 domain vs 35 nodes/13 domains).

### Location 3: docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/

**Directory does not exist.** Stream was never committed to this repo path.

### Location 4: docs/psee named DOM/domain/recompute-from-evidence artifacts

Searched docs/psee for: `*dom*`, `*domain*`, `*dom_path*`, `*domain_layer*`

Found only:
- `PI.LENS.DOM-LAYER.GENERATOR.01/dom_layer_schema.json` — schema documentation, no actual data
- `PI.LENS.DOM-LAYER.GENERATOR.01/dom_layer_findings.md` — documentation
- `PI.LENS.DOM-LAYER.GENERATOR.01/domain_derivation_rules.md` — documentation

No `dom_path_domain_layer.json` equivalent data artifact found.

---

## Provenance Note

The `dom_path_domain_layer.json` was the authoritative input used to produce:
- `run_be_orchestrated_fixup_01/vault/canonical_topology.json` (13 domains, 35 nodes)
- `run_be_orchestrated_fixup_01/binding/binding_envelope.json` (references dom_source field)

The file was part of `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` and was
referenced in source_manifest.json, but its directory was never committed to the repo or has
been removed. It cannot be derived, transformed, or synthesized under current contract rules.

---

## Conclusion

**NO_GOVERNED_SOURCE** — FAIL-CLOSED per contract rule.
