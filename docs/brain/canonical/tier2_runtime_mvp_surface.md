# Brain Node — Canonical
# Tier-2 Runtime MVP Surface

**Authority:** TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
**Brain:** CANONICAL
**Status:** DEFINED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01.md
**Upstream:** docs/brain/canonical/diagnostic_zone_construct.md

---

## CANONICAL SUPPORT FOR TIER-2 MVP

The following canonical artifacts are sufficient to support Phase 1 of the Tier-2 runtime surface. No new canonical sources are required.

| Canonical artifact | Path | Supports |
|---|---|---|
| `canonical_topology.json` | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/` | Zone candidate derivation, node IDs, grounding states, edges |
| `signal_registry.json` | same package dir | Signal-to-domain binding, evidence state, artifact references |
| `gauge_state.json` | same package dir | Score, band_label, confidence bounds for header context |

---

## ZONE CANDIDATE DERIVATION RULES

Tier-2 zones in Phase 1 are derived as follows:

```
1. Load canonical_topology.json
2. Iterate domains[]
3. For each domain where grounding != "GROUNDED":
   → domain is a zone candidate
4. Focus domain (highest structural pressure — DOMAIN-10 in current run):
   → always a zone candidate regardless of grounding state
5. Assign zone_id sequentially: ZONE-01, ZONE-02, ...
   ordered by: severity descending, then domain_id ascending
6. Derive zone_type from signal_registry:
   - No signals for domain → evidence_gap
   - Signals with conflicting states → signal_conflict
   - Signals present but all WEAK confidence → structural_inconsistency
   - Focus domain with score pressure → pressure_concentration
```

---

## EVIDENCE STATE DERIVATION RULES

For each zone's per-zone block (Section 3D), evidence state derives from signal_registry:

```
evidence_strength = STRONG  if:
  all signals in zone scope have confidence != WEAK
  AND at least one signal has an artifact reference

evidence_strength = PARTIAL if:
  at least one signal has confidence == WEAK
  OR at least one signal has no artifact reference

evidence_strength = WEAK    if:
  no signals found for zone scope
  OR all signals have confidence == WEAK and no artifact references
```

---

## PROPAGATION PATH DERIVATION

For Phase 1, propagation paths in Section 3C are derived statically from topology:

```
node_chain construction:
  1. Start from zone's primary domain node
  2. Traverse edges[] in canonical_topology to adjacent domains
  3. Attach SIGNAL nodes from signal_registry by domain_id binding
  4. Mark evidence_support per segment per evidence state rules above
  5. Segments without signal backing → evidence_support = INFERRED
     → inferred_declaration required
```

Phase 2 will replace static derivation with live traversal engine (`tier2_trace_graph.py`). Phase 1 static derivation is canonical-compliant and deterministic.

---

## CONSTRAINT

Phase 1 static derivation MUST produce the same zone inventory and path structure as Phase 2 traversal engine will produce for the same canonical inputs. Any deviation between Phase 1 static and Phase 2 dynamic outputs is a canonical consistency failure.
