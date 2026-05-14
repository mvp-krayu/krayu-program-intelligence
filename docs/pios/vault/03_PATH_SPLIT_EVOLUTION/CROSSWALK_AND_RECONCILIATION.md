# Crosswalk and Reconciliation

> **The bridge between structural proof and semantic meaning.**

---

## What Crosswalk Does

SemanticCrosswalkMapper translates technical domain identifiers (DOM-XX) to human-readable business labels. It uses `semantic_continuity_crosswalk.json` as its translation table.

**Critical distinction:** The crosswalk mapper is a **display-layer translator.** It is NOT a reconciliation engine. It translates labels. It does not verify structural correspondence.

## What Reconciliation Will Do

Crosswalk reconciliation (Phase 3 of strategic roadmap) will be a **compiler** that:
1. Takes HYDRATED semantic output (PATH B)
2. Takes structural registries (PATH A)
3. Produces a correspondence report showing which semantic claims have structural evidence
4. Each domain gets a reconciliation status

## Reconciliation ≠ Proof

| Operation | What It Proves | Layer |
|---|---|---|
| Crosswalk translation | Nothing — it's display | L4 display |
| Crosswalk reconciliation | Correspondence exists | L4 reconciliation |
| Structural grounding | Structure is verified | L3-L4 verification |
| Authority promotion | Governance gate passed | L8 governance |

Reconciliation produces correspondence evidence. Correspondence ≠ structural proof. Structural proof ≠ authority.

## Current State

| Component | Status |
|---|---|
| SemanticCrosswalkMapper | OPERATIONAL — label translation |
| semantic_continuity_crosswalk.json | OPERATIONAL — entity mappings |
| Crosswalk reconciliation compiler | NOT IMPLEMENTED — Phase 3 territory |
| Graduated grounding model | NOT IMPLEMENTED — binary only |

## Planned Evolution (from Strategic Roadmap)

### Step 1 — Registry Correspondence
Map DOM-01→DOM-17 semantic clusters to CLU/CAP/vault registries. Produce correspondence table.

### Step 2 — Evidence Binding
For each correspondence, identify strongest evidence:
- Vault anchor → STRUCTURALLY_GROUNDED
- Topology report → OBSERVATIONALLY_CORROBORATED
- Operator evidence → UPSTREAM_EVIDENCE_BOUND
- No evidence → UNMAPPED

### Step 3 — Graduated Confidence
Replace binary grounding with 5-level model.

## Cross-References

- [[PATH_A_EMERGENCE]] — structural grounding (reconciliation target)
- [[PATH_B_EMERGENCE]] — semantic reconstruction (reconciliation source)
- [[TOPOLOGY_AND_HYDRATION_SPLIT]] — how these concerns separated
- [[../04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION]] — state progression through reconciliation
