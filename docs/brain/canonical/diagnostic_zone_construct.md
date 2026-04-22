# Brain Node — Canonical
# Diagnostic Zone Construct

**Authority:** TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01
**Brain:** CANONICAL
**Status:** DEFINED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md

---

## CONSTRUCT DEFINITION

A **diagnostic zone** is a structural boundary within the canonical program topology where one or more of the following conditions is evidence-observable:

1. Grounding state is not `GROUNDED` (i.e., `WEAKLY GROUNDED` or `UNGROUNDED`)
2. Signal patterns across the zone indicate conflict or contradiction
3. Evidence coverage is absent or insufficient to determine structural state
4. Structural pressure concentrates in this zone relative to adjacent topology

Diagnostic zones are NOT invented. They are derived exclusively from canonical data sources.

---

## CANONICAL SOURCES

| Data source | Field | Zone derivation |
|---|---|---|
| `canonical_topology.json` | `domains[].grounding` | Domains where `grounding` ≠ `GROUNDED` become zone candidates |
| `signal_registry.json` | `signals[].confidence`, `signals[].state` | Signal patterns determine zone_type classification |
| `gauge_state.json` | `score.band_label`, `confidence.lower/upper` | Confidence band informs zone severity |

---

## ZONE TYPE VOCABULARY

| zone_type | Observable condition |
|---|---|
| `pressure_concentration` | Structural score pressure concentrated in this zone relative to total program scope |
| `signal_conflict` | Two or more signals within zone scope carry contradictory states |
| `structural_inconsistency` | Domain grounding state is inconsistent with its structural role in the topology |
| `evidence_gap` | Signal coverage for zone scope is absent or below resolvability threshold |

Zone types are enumerated. No zone_type outside this vocabulary is permitted.

---

## DERIVATION RULES

1. A domain is a zone candidate if its `grounding` field is not `GROUNDED`
2. The focus domain (highest structural pressure) is always a zone candidate regardless of grounding state
3. Zone type is assigned deterministically from signal pattern — not inferred
4. A zone may have only ONE primary zone_type; secondary types are not supported in v1
5. Zone identification is per-run — zones are not persistent across runs

---

## BOUNDARY

- Diagnostic zones are L3/L4 constructs (derivation + semantic shaping layer)
- They are exposed at L6 (Runtime) via the Tier-2 Diagnostic Narrative
- They are NOT advisory constructs — they expose structural state only
- Zone existence does NOT imply remediability

---

## INVARIANTS

- `zone_id` format: `ZONE-{NN}` (two-digit zero-padded integer)
- Zones are ordered by severity descending, then `zone_id` ascending
- Every zone MUST link to at least one domain from `canonical_topology.json`
- Zone count is bounded by total domain count (cannot exceed number of domains)
