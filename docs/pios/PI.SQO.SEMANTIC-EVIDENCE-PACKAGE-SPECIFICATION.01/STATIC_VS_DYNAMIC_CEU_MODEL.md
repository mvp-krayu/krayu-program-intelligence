# Static vs Dynamic CEU Model

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Definitions

### Static CEU

Static CEU (Component Evidence Unit) is the canonical certified semantic
binding produced by the deterministic structural pipeline (PATH A) and
the semantic processing pipeline.

Static CEU:
- is deterministically derived from source material
- is produced by pipeline execution (40.2 → 40.4 → semantic bundle → crosswalk)
- is replay-safe and hash-verified
- is immutable once certified
- constitutes the certified substrate

Static CEU examples:
- canonical topology cluster assignments
- DPSIG signal set derivations
- semantic domain assignments from semantic bundle production
- crosswalk mappings produced by crosswalk production
- decision validation results
- reproducibility verdicts

Static CEU is what currently drives Q-class resolution:
```
Q-class = f(backed_count, total_count, semantic_continuity_status, evidence_availability)
```

Where `backed_count` is the count of domains with EXACT or STRONG lineage
status as determined by Static CEU.

### Dynamic CEU

Dynamic CEU is an evidence-activated additive semantic overlay derived from
governed external evidence packages. Dynamic CEU extends the semantic
envelope without mutating the deterministic structural substrate.

Dynamic CEU:
- is derived from Semantic Evidence Packages (SEPs)
- is additive to the certified substrate
- is independently removable
- is provenance-bound to external source authority
- is versioned and revocable
- augments semantic qualification resolution
- NEVER mutates the deterministic substrate

Dynamic CEU examples:
- business label assignments derived from ADR documentation
- lineage upgrades derived from architecture records
- continuity mappings derived from capability models
- domain typing refinements derived from operational runbooks

---

## 2. Separation Boundary

```
┌─────────────────────────────────────────────────┐
│                 CERTIFIED SUBSTRATE               │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │            STATIC CEU                     │    │
│  │                                           │    │
│  │  canonical_topology_40_4                  │    │
│  │  dpsig_signal_set                         │    │
│  │  semantic_topology_model                  │    │
│  │  semantic_continuity_crosswalk            │    │
│  │  decision_validation                      │    │
│  │  reproducibility_verdict                  │    │
│  │                                           │    │
│  │  IMMUTABLE. PIPELINE-DERIVED.             │    │
│  │  HASH-VERIFIED. REPLAY-SAFE.              │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│             SEMANTIC OVERLAY LAYER                │
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │           DYNAMIC CEU                     │    │
│  │                                           │    │
│  │  SEP-fastapi-run_02-001.v1.json          │    │
│  │  SEP-fastapi-run_02-002.v1.json          │    │
│  │  SEP-blueedge-run_01-001.v1.json         │    │
│  │                                           │    │
│  │  ADDITIVE. EXTERNALIZED. REMOVABLE.       │    │
│  │  PROVENANCE-BOUND. VERSIONED.             │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
└─────────────────────────────────────────────────┘
```

The boundary between Static CEU and Dynamic CEU is absolute:

| Property | Static CEU | Dynamic CEU |
|----------|-----------|-------------|
| Source | Pipeline execution | External evidence packages |
| Mutability | Immutable once certified | Additive, removable, versioned |
| Authority | Pipeline artifacts | SEP provenance chain |
| Persistence | Certified artifact store | Overlay artifact store |
| Removal impact | System destruction | Graceful qualification reversion |
| Replay behavior | Deterministic from source | Deterministic from SEP |
| Substrate modification | IS the substrate | NEVER modifies substrate |

---

## 3. What Dynamic CEU May Do

Dynamic CEU may ONLY augment semantic qualification resolution:

1. **Enrich domain labels.** Assign business-readable labels to domains
   that currently carry only structural identifiers.

2. **Upgrade lineage status.** Elevate a domain's lineage from NONE or
   WEAK to STRONG or EXACT when external evidence provides verifiable
   structural correspondence.

3. **Extend crosswalk coverage.** Add new structural-to-business
   vocabulary mappings that were not producible from the original
   source material alone.

4. **Refine domain typing.** Assign or refine semantic domain types
   (FUNCTIONAL, INFRASTRUCTURE, OPERATIONAL, etc.) based on
   architectural documentation.

5. **Resolve semantic debt items.** Provide evidence that resolves
   specific debt items in the semantic debt inventory.

---

## 4. What Dynamic CEU MUST NEVER Do

Dynamic CEU must NEVER mutate:

| Protected Element | Why |
|-------------------|-----|
| Topology | Structural cluster assignments are pipeline-certified |
| Propagation | DPSIG pressure signals are deterministic derivations |
| Conditions | Condition correlation is pipeline-derived |
| Concentration | Cluster concentration is a structural property |
| Reproducibility | Replay safety is a pipeline guarantee |
| Substrate derivation | 40.2 → 40.4 chain is immutable |
| Q-class formula | The Q-class resolver function is governance-locked |
| PATH A artifacts | Structural pipeline outputs are protected |
| PATH B projection chain | Actor hydration, rendering metadata derivation |

Dynamic CEU may cause the INPUTS to Q-class resolution to change
(e.g., `backed_count` increases because a lineage upgrade is applied),
but it MUST NOT modify the Q-class FORMULA or bypass the resolution gate.

---

## 5. Resolution Model

When both Static CEU and Dynamic CEU are present, qualification evaluation
operates as follows:

```
1. Load certified substrate (Static CEU)
   → canonical topology, signals, semantic model, crosswalk, etc.

2. Load active overlays (Dynamic CEU)
   → all ACTIVATED SEPs in package_registry.json

3. Compute composite semantic state
   → Static CEU as base
   → Dynamic CEU entries applied additively
   → Each Dynamic CEU entry flagged as OVERLAY (not CERTIFIED)

4. Resolve Q-class from composite state
   → same formula: f(backed_count, total_count, continuity, evidence)
   → backed_count may include overlay-contributed domains
   → overlay contributions are separately tracked

5. Emit qualification result with overlay attribution
   → Q-class result includes:
     - static_backed_count (from certified substrate only)
     - overlay_backed_count (from Dynamic CEU only)
     - composite_backed_count (static + overlay)
   → executive surface shows composite with overlay disclosure
```

---

## 6. Composite vs Certified Distinction

The system MUST always distinguish between:

- **Certified grounding:** domains backed by Static CEU only
- **Composite grounding:** domains backed by Static CEU + Dynamic CEU
- **Overlay-only grounding:** domains backed only by Dynamic CEU

This distinction MUST be preserved in:
- qualification state artifacts
- debt inventory re-evaluation
- executive projection surfaces
- governance audit trails

An overlay-contributed domain MUST NEVER be presented as
certified-substrate grounding. The overlay provenance MUST be visible.
