# tier2_query_engine — Canonical Constraints for Tier-2 Live Query Engine

**Authority:** brain/canonical  
**Stream:** TIER2.RUNTIME.QUERY.ENGINE.01  
**Status:** DEFINITION  
**Depends on:** tier2_workspace_model.md, diagnostic_zone_construct.md, trace_graph_model.md

---

## Canonical Role

This document defines the structural invariants that govern what the Tier-2 query engine may and may not produce. These are not configurable. They derive from the evidence model, the inference boundary, and the zone derivation rules already established in prior canonical brain nodes.

---

## WHY Mode — Canonical Derivation Contract

A WHY response for a zone must be constructed exclusively from these fields in the canonical data:

| Claim in WHY response | Canonical source |
|---|---|
| Zone type classification | `grounding` field + signal presence → `_derive_tier2_zones()` logic |
| Focus domain status | `domain_id == FOCUS_DOMAIN_T2` check |
| Signal count and IDs | `signal_registry.json` filtered by `domain_id` |
| Evidence confidence per signal | `signal.evidence_confidence` field |
| Capability scope | `domain.capability_ids` field |
| Structural scope (cap count) | `len(domain.capability_ids)` |
| Grounding status | `domain.grounding` field |

**What WHY cannot claim:**
- Why the grounding state exists (that would require root cause analysis)
- What would resolve the zone condition (that is advisory)
- How the condition affects runtime behavior (that is inference beyond evidence)
- Any claim not directly derivable from the fields listed above

**WHY derivation for current zones (canonical ground truth):**

*ZONE-01 (DOMAIN-10, pressure_concentration):*
- Focus domain: true
- Grounding: WEAKLY GROUNDED
- Signals bound: 2 (SIG-002: STRONG; SIG-004: MODERATE)
- Capabilities: CAP-26, CAP-27, CAP-28, CAP-29 (4 nodes)
- Classification trigger: focus domain + signal presence → pressure_concentration
- Severity: HIGH (focus domain rule)
- Confidence: STRONG (highest signal confidence)

*ZONE-02 (DOMAIN-02, evidence_gap):*
- Focus domain: false
- Grounding: WEAKLY GROUNDED
- Signals bound: 0
- Capabilities: CAP-05, CAP-06 (2 nodes)
- Classification trigger: no signals → evidence_gap
- Severity: MODERATE (evidence_gap non-focus rule)
- Confidence: WEAK (no signals)

---

## EVIDENCE Mode — Canonical Data Contract

An EVIDENCE response must be constructed exclusively from these fields:

| Item in EVIDENCE response | Canonical source |
|---|---|
| Available trace links | `signal.trace_links` list per signal in zone's domain |
| Signal coverage summary | presence/absence of `trace_links` per signal |
| Missing evidence items | absence of signals for domain + absence of trace links |
| Evidence strength | `signal.evidence_confidence` (per signal) |

**EVIDENCE for current zones (canonical ground truth):**

*ZONE-01 (DOMAIN-10):*
- SIG-002: STRONG confidence, 3 trace links → available
- SIG-004: MODERATE confidence, 3 trace links → available
- Total available links: 6
- Signal coverage: FULL for bound signals
- Missing: runtime telemetry (7 operational dimensions not observable from static evidence — declared in uncertainty block)
- Evidence strength: STRONG (highest signal)

*ZONE-02 (DOMAIN-02):*
- No signals bound → no trace links
- Total available links: 0
- Signal coverage: NONE
- Missing: any signal coverage for domain
- Evidence strength: WEAK

**What EVIDENCE cannot claim:**
- Evidence items from outside the signal_registry.json trace_links field
- Presence of evidence not listed in trace_links
- A timeline or path for obtaining missing evidence

---

## TRACE Mode — Canonical Deferral Rationale

TRACE mode is deferred because the `edges` field in `canonical_topology.json` contains edge type labels only (`["domain_capability", "capability_component"]`) — not actual adjacency data. Constructing traversal paths requires:

1. Inferring domain-to-capability adjacency from `domain.capability_ids` (available)
2. Inferring capability-to-component adjacency from component listings (partially available)
3. Inferring cross-domain edges from signal domain co-location (requires interpretation)

Step 3 involves structural inference beyond what is directly artifact-backed. A traversal engine must classify each path as ARTIFACT-BACKED or INFERRED — and the INFERRED path classification logic requires its own validation stream before it can be considered canonical.

**Known canonical paths (to be encoded in traversal engine when built):**

*ZONE-01 paths:*
- `DOMAIN-10 → CAP-27 → CAP-29`: STRONG (capability containment — direct from topology)
- `DOMAIN-10 → DOMAIN-11`: PARTIAL (SIG-002 references FleetEventsModule, which is DOMAIN-11 scope — component-confirmed, not topology-edge-confirmed)

*ZONE-02 paths:*
- No artifact-backed paths — any path from DOMAIN-02 is INFERRED

---

## Inference Prohibition — Canonical Enforcement Rules

These rules apply to every query engine response, regardless of mode.

1. **No generative text** — all text in responses must be template-constructed from canonical field values. No interpolation, no paraphrase, no summarization beyond what the field directly provides.

2. **No structural claims beyond evidence** — if a structural fact is not present in canonical_topology.json or signal_registry.json, it cannot be claimed. It must be listed in `uncertainty.unresolved`.

3. **No resolution framing** — the query engine must not frame missing evidence as a problem to be solved or a gap to be filled. It is a structural fact about the current evidence set.

4. **INFERRED is final in Phase 1** — an INFERRED classification cannot be promoted. The engine must not suggest that INFERRED paths are "likely" or "probable."

5. **Uncertainty always populated** — for the current run (2 WEAKLY GROUNDED domains, 0 fully grounded zones), uncertainty is never empty. An empty `uncertainty.unresolved` block is a schema violation for any zone in this run.

---

## Response Validity Invariants

A query engine response is structurally valid if and only if:

- `inference_prohibition: "ACTIVE"` is present as a top-level field
- `result` fields reference only data derivable from canonical sources listed above
- `evidence_basis.available` contains only items present in signal trace_links
- `evidence_basis.missing` is populated for any zone with absent signal coverage or absent trace links
- `uncertainty.unresolved` is non-empty for all current zones (both WEAKLY GROUNDED)
- No field contains: recommendations, root cause claims, forward projections, resolution guidance

A response failing any of these invariants is invalid and must not be surfaced to the user.

---

## Run Anchor

All query engine outputs are anchored to:  
`run_id: run_authoritative_recomputed_01`

This must appear in every response. Cross-run comparison is not within scope. If canonical data files are not present, the engine must return `CANONICAL_DATA_MISSING` — not a partial response.
