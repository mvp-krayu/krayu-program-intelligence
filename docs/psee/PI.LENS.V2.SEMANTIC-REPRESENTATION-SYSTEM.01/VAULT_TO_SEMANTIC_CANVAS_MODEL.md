# VAULT → SEMANTIC CANVAS MODEL

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Status:** DESIGN — defines the future role of the vault as the semantic substrate for LENS V2. **Not implemented in this stream.**

---

## 1. The vault as semantic substrate

The Krayu vault is the canonical evidence store for the Program Intelligence system. It contains:

- evidence references and lineage
- claims and their backing
- artifact identifiers and hashes
- semantic domain definitions
- structural entity relationships
- pressure anchors and propagation lineage
- signal lineage (active, inactive, baseline, non-activated)
- topology relations (structural and semantic)
- confidence lineage and grounding state

The vault is **not** a graph playground. The vault is the substrate from which LENS V2 reads its semantic actors.

---

## 2. The future architecture

```
┌──────────────────────────────────────────────────────────────┐
│ Krayu Vault (canonical evidence store)                       │
│                                                               │
│ - evidence refs        - signal lineage                       │
│ - claims               - topology relations (structural)      │
│ - artifacts            - topology relations (semantic-only)   │
│ - semantic domains     - confidence lineage                   │
│ - structural entities  - grounding state                      │
│ - pressure anchors     - propagation lineage                  │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ LENS V2 Semantic Payload Resolver                            │
│ (future: /api/lens-payload?client=<id>&run=<id>)             │
│                                                               │
│ Hydrates the 15 semantic actors from vault data:             │
│   DP ← header_block.readiness_badge                           │
│   CB ← topology_scope.grounded_domain_count / domain_count    │
│   PA ← evidence_blocks[role=ORIGIN]                           │
│   PP ← trace_block.propagation_path                           │
│   AL ← evidence_blocks[role=PASS_THROUGH] + absorption %      │
│   RE ← evidence_blocks[role=RECEIVER] + grounding_status      │
│   ST ← evidence_blocks[].domain_alias + propagation_role      │
│   SB ← grounding_status === 'Q-00' per block                  │
│   SO ← grounding_status !== 'Q-00' per block                  │
│   CC ← topology_scope.cluster_count + grounded ratio          │
│   SS ← evidence_blocks[].signal_cards[]                       │
│   ET ← trace_linkage (hashes)                                 │
│   RB ← grounding_label + qualifier_class + execution gates    │
│   IP ← rendering_metadata.qualifier_rules + ali_rules         │
│   RA ← static report artifact registry + availability         │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ LENS V2 Flagship Surface (this iteration)                    │
│                                                               │
│ Renders the 15 actors per the persona-weighted lens.         │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. What this stream did NOT implement

This stream:

- Defined the 15 semantic actors and their data sources.
- Implemented the rendering for those actors using the in-memory fixture.
- Documented the future binding architecture.

This stream did **not** implement:

- Any vault read API.
- Any /api/lens-payload endpoint.
- Any live binding from vault to surface.
- Any per-client / per-run resolution.
- Any background data fetching.

The semantic actor architecture is in place. The data substrate is still the in-memory fixture.

---

## 4. The future binding stream

The next stream (proposed name: `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.01`) should:

1. Implement `/api/lens-payload?client=<id>&run=<id>` returning the structured payload.
2. Implement `/api/report-pack?artifact=<id>&client=<id>&run=<id>` returning the static HTML.
3. Migrate the LENS V2 surface from `require('../flagship-experience/fixtures/...')` to `getServerSideProps` (or equivalent) calling `/api/lens-payload`.
4. Wire the Report Pack support-rail entries to the live `binding_status` field.
5. Preserve the visual surface unchanged — the binding is data plumbing, not visual change.

The binding stream MUST consult:

- This document (vault → canvas mapping).
- `SEMANTIC_ACTOR_REGISTRY.md` (per-actor data source specifications).
- `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md` (predecessor stream — API contract specification).

---

## 5. Vault relations the actors require

For the binding stream to succeed, the vault must expose (per evidence):

- **Run identity** — `run_id`, `evidence_object_hash`, `derivation_hash`, `baseline_anchor`.
- **Domain inventory** — `domain_alias`, `domain_id`, `propagation_role` per domain.
- **Grounding state** — per-domain `grounding_status`, `grounding_label`, `grounded_domain_count`.
- **Signal inventory** — `signal_cards[]` per domain with `signal_label`, `pressure_label`, `pressure_tier`, `evidence_text`, `qualifier_label`.
- **Topology scope** — `domain_count`, `cluster_count`, `grounded_domain_count`.
- **Trace block** — `propagation_path`, `propagation_summary`, `derivation_lineage_ref`.
- **Rendering metadata** — `qualifier_rules_applied`, `ali_rules_applied`.
- **Header block** — `readiness_badge.state_label`, `readiness_badge.qualifier_label`, `readiness_badge.tooltip_text`.

The current fixture provides all of these. The vault must provide them per real client/run for the binding to succeed without surface changes.

---

## 6. What the vault must NOT be

The contract is explicit:

- The vault is **not** a graph playground.
- The vault is **not** rendered as raw nodes-and-edges.
- The vault is **not** exposed directly to the operator.

LENS V2 reads from the vault. It does not let the operator read the vault.

---

## 7. The cleanest separation

The clean architecture has three layers:

1. **Vault** — canonical evidence substrate. Owned by upstream PiOS Core.
2. **Semantic Payload** — API resolver that selects the subset of vault data needed by LENS V2 for a given client/run.
3. **LENS V2 Surface** — renders the 15 semantic actors from the payload.

This stream defines layer 3 fully and layers 1–2 as documentation. The next stream implements layers 1–2 plumbing.

---

## 8. Authority

This document is authoritative for the vault → canvas relationship. Future contracts that touch either side must:

1. Preserve the actor-level mapping.
2. Preserve the separation between vault, payload, and surface.
3. Update this document if any actor's data source changes.

---

**End of vault → semantic canvas model.**
