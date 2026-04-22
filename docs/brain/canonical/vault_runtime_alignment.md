# vault_runtime_alignment.md
# Canonical Brain Node — Vault ↔ Runtime Alignment

- Stream: PRODUCTIZE.GAUGE.VAULT.RUNTIME.ALIGNMENT.01
- Authority: brain/canonical
- Date: 2026-04-22

---

## CANONICAL TRUTH STATEMENT

There is one evidence truth. It lives in the canonical JSON package:

```
clients/<client>/psee/runs/<run_id>/package/
  canonical_topology.json   — structural topology, domains, capabilities, components
  signal_registry.json      — bound signals with evidence_confidence and trace_links
  gauge_state.json          — GAUGE score, band, confidence, domain-level scoring
```

Both the Tier-2 runtime and Evidence Vault V3 are read-only projections of this single source. Neither layer is authoritative over the other. Divergence is structurally impossible if both derive deterministically from the same canonical JSON.

---

## OBJECT TAXONOMY ALIGNMENT

### Canonical Objects → Vault Node Type

| Canonical Object | Vault Node Class | Vault Node Pattern |
|---|---|---|
| domain (topology node) | Entity node | Entity Topology Nodes.md |
| capability (structural unit) | Entity node | Entity Structural Units.md |
| component (sub-unit) | Entity node | Entity Structural Units.md |
| signal (signal registry entry) | Entity node | Entity Signals.md |
| gauge_state.json | Artifact node | ART-01 |
| canonical_topology.json | Artifact node | ART-04 |
| signal_registry.json | Artifact node | ART-05 |
| score computation | Transformation node | TRN-03 (Score Computation) |
| signal emission | Transformation node | TRN-05 (Signal Emission) |
| topology emission | Transformation node | TRN-04 (Topology Emission) |
| gauge score (CLM-09) | Claim node | CLM-09 |

### Canonical Objects → Runtime Object

| Canonical Object | Runtime Object | Derivation |
|---|---|---|
| domain + gauge grounding | zone | Derived: focus domain + weakly grounded domains |
| domain.capabilities | zone.structural_scope | Direct read |
| signal.evidence_confidence | zone.confidence | Deterministic selection |
| signal.trace_links | evidence result trace_links | Direct read |
| gauge_state.score | context.score | Direct read |
| gauge_state.band | context.band | Direct read |

### Zone — Derived Construct

A zone has no canonical identity. It is computed at query time:
- zone_id → assigned sequentially (ZONE-01, ZONE-02, ...) by derivation rules
- ZONE-01 = focus domain (DOMAIN-10 for BlueEdge run_authoritative_recomputed_01)
- ZONE-02+ = WEAKLY_GROUNDED domains in score_components

Zone derivation is deterministic — same canonical JSON always produces the same zone set.

---

## EVIDENCE CHAIN

```
canonical JSON
  └─ vault artifact node (ART-04, ART-05, ART-01)
       └─ vault entity nodes (Entity Topology, Entity Signals)
            └─ vault claim nodes (CLM-09, domain claims)
                 └─ WHY result (assembled dynamically at query time)
                      └─ EVIDENCE result (signal_coverage, trace_links)
```

The chain is directional: canonical JSON → vault → query result. No reverse mutation is permitted.

---

## INVARIANTS

1. Canonical JSON is the single source of truth. No other layer may define or mutate it.
2. Vault derives from canonical JSON — all claim values have a source_trace field path.
3. Runtime derives from canonical JSON — all query results have traceable field origins.
4. Vault and runtime independently derive from the same source → no divergence possible.
5. Zone construct is derived, not canonical — zones do not exist as vault nodes.
6. Missing evidence is negative space — not represented as vault nodes.
7. All derivations are deterministic — same inputs, same outputs, always.

---

## GROUNDING REFERENCE

Current locked canonical run:
- run_id: run_authoritative_recomputed_01
- client: blueedge
- vault builder stream: PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
- zone derivation: tier2_data.py (FOCUS_DOMAIN = DOMAIN-10)
