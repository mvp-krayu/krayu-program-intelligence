# ENL-002 — Minimal Graph Example
## ENL-002-CONTRACT-v1 · run_01_blueedge

---

## Purpose

This document explains the minimal valid ENL graph defined in
`ENL-002_minimal_graph_example.json`.

The example demonstrates:
- the 4-layer chain INTEL → SIG-41 → SIG-40 → EVID
- correct use of `derived_from` for layer traversal
- run-awareness enforcement (all nodes share `run_01_blueedge`)
- evidence termination (EVID as terminal node with empty `derived_from`)

---

## Chain Structure

```
INTEL-GQ003-001   (INTEL)
    ↓ derived_from
SIG41-SIG003-001  (SIG-41)
    ↓ derived_from
SIG40-SIG003-001  (SIG-40)
    ↓ derived_from
EVID-ST007-001    (EVID)   ← terminal
```

---

## Node Descriptions

### INTEL-GQ003-001 — `INTEL`

**Title:** Blast radius if a core platform component fails or is changed

**Grounded in:** `docs/pios/41.5/query_response_templates.md#GQ-003`

This is the intelligence output — the narrative insight produced in response
to query GQ-003. It sits at the highest abstraction layer and expresses
program-level understanding.

**Why valid:** Declares `derived_from: ["SIG41-SIG003-001"]`. The referenced
node is of type SIG-41, which is the only permitted upstream type for INTEL
per `enl_graph_rules_v1.json`.

---

### SIG41-SIG003-001 — `SIG-41`

**Title:** Dependency Load — semantic signal (SIG-003)

**Grounded in:** `docs/pios/41.4/signal_registry.json#SIG-003`

This is the semantic signal layer. SIG-41 nodes represent interpreted signals
that have been bound to intelligence queries. SIG-003 (Dependency Load) is
sourced from the signal registry and carries its confidence and statement
values.

**Why valid:** Declares `derived_from: ["SIG40-SIG003-001"]`. The referenced
node is of type SIG-40, the only permitted upstream type for SIG-41.

---

### SIG40-SIG003-001 — `SIG-40`

**Title:** Dependency Load — computed signal (SIG-003 evidence binding)

**Grounded in:** `docs/pios/41.4/evidence_mapping_index.json#SIG-003`

This is the computed signal layer. SIG-40 nodes represent signals at the
point of evidence binding — where structural telemetry artifacts are mapped
to signals. The evidence mapping index for SIG-003 links the dependency
computation to specific telemetry artifacts.

**Why valid:** Declares `derived_from: ["EVID-ST007-001"]`. The referenced
node is of type EVID, the only permitted upstream type for SIG-40.

---

### EVID-ST007-001 — `EVID`

**Title:** ST-007: Structural telemetry — dependency relationship map

**Grounded in:** `docs/pios/40.x/structural_telemetry#ST-007`

This is the terminal evidence node. EVID nodes represent raw, verifiable
evidence artifacts. ST-007 is a structural telemetry record capturing the
dependency relationship map of the BlueEdge platform.

**Why valid (as terminal node):**
- `derived_from` is an empty array — the only node type for which this is
  permitted per `enl_graph_rules_v1.json`
- It is of type EVID — the only permitted terminal node type
- All prior nodes in the chain derive (directly or transitively) from this
  node, satisfying the evidence-termination requirement

---

## How Derivation Is Resolved

Derivation is resolved by traversing `derived_from` arrays downstream to
upstream:

1. Start at INTEL-GQ003-001
2. Follow `derived_from` → SIG41-SIG003-001 (exists, type=SIG-41 ✓)
3. Follow `derived_from` → SIG40-SIG003-001 (exists, type=SIG-40 ✓)
4. Follow `derived_from` → EVID-ST007-001 (exists, type=EVID ✓)
5. EVID-ST007-001 has empty `derived_from` → traversal terminates ✓

At no point is any relationship inferred. Every link is declared explicitly
in the consuming node's `derived_from` field.

---

## Why EVID Is the Terminal Endpoint

Per ENL-001 Principle 3 (Evidence First Enforcement):

> Every navigation path must terminate in verifiable evidence.
> No evidence → no navigation endpoint.

EVID nodes represent raw structural telemetry or other verifiable artifact
anchors. They cannot derive from ENL node types (their `derived_from` must
be empty in v1). This makes them structurally terminal — traversal cannot
continue past EVID within the ENL layer.

This is not a convention. It is enforced by `validate_enl_example.py`.

---

## Run-Awareness

All four nodes carry `run_id: "run_01_blueedge"`. The validator confirms that
every node referenced in a `derived_from` array belongs to the same `run_id`
as the referencing node. Cross-run links are rejected in v1.

---

## Validation Summary

This example passes all checks in `validate_enl_example.py`:

- ✓ all required fields present on all 4 nodes
- ✓ all node_type values are canonical
- ✓ all layer transitions are permitted (INTEL→SIG-41→SIG-40→EVID)
- ✓ no forbidden transitions
- ✓ EVID is the only node with empty derived_from
- ✓ all derived_from references resolve to existing nodes
- ✓ all nodes share the same run_id
- ✓ graph terminates in EVID
- ✓ no duplicate node_ids
