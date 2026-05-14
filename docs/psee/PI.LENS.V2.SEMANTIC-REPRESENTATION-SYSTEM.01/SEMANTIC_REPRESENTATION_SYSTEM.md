# SEMANTIC REPRESENTATION SYSTEM — Architectural Document

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Authority:** Defines the move from "same primitive in different wrappers" to a true semantic representation system.

---

## 1. The diagnosis

Prior to this stream, all four lens modes — BALANCED / DENSE / INVESTIGATION / BOARDROOM — visually repeated the same primitive:

```
Primary Delivery → Coordination Layer → Secondary Delivery
```

in different visual shapes (horizontal anchors, spatial nodes, vertical trace bands, atmospheric mark). This created the *illusion* of semantic richness while the underlying representation remained a single triad.

The contract for this stream identified this as the structural failure that prevents LENS V2 from being a real semantic representation system.

---

## 2. The architecture

LENS V2 is now organized around a **Semantic Actor Registry** of 15 named actors. Each lens mode is a *distinct subset* of these actors. Modes do not share content; they share a visual grammar of actor panels.

### 2.1 The 15 actors

| ID | Code | Actor                       |
|----|------|------------------------------|
| A  | DP   | Decision Posture             |
| B  | CB   | Confidence Boundary          |
| C  | PA   | Pressure Anchor              |
| D  | PP   | Propagation Path             |
| E  | AL   | Absorption Load              |
| F  | RE   | Receiver Exposure            |
| G  | ST   | Semantic Topology            |
| H  | SB   | Structural Backing           |
| I  | SO   | Semantic-Only Exposure       |
| J  | CC   | Cluster Concentration        |
| K  | SS   | Signal Stack                 |
| L  | ET   | Evidence Trace               |
| M  | RB   | Resolution Boundary          |
| N  | IP   | Inference Prohibition        |
| O  | RA   | Report Artifact Access       |

The full registry definition lives in source as `SEMANTIC_ACTORS` and is documented authoritatively in `SEMANTIC_ACTOR_REGISTRY.md`.

### 2.2 Mode → actor composition

```
LENS_MODE_SEMANTICS = {
  EXECUTIVE_BALANCED:  [A, B, M, C, O]   = Decision Posture · Confidence Boundary · Resolution Boundary · Pressure Anchor · Report Artifact Access
  EXECUTIVE_DENSE:     [G, H, I, J, E, C] = Semantic Topology · Structural Backing · Semantic-Only Exposure · Cluster Concentration · Absorption Load · Pressure Anchor
  INVESTIGATION_DENSE: [L, K, N, B, M]   = Evidence Trace · Signal Stack · Inference Prohibition · Confidence Boundary · Resolution Boundary
  BOARDROOM:           [A, B, C, O]      = Decision Posture · Confidence Boundary · Pressure Anchor · Report Artifact Access (compact)
}
```

Two modes share BALANCED's reading lens (BALANCED and BOARDROOM both anchor on Decision Posture and Confidence Boundary), but the visual rendering is completely different — BOARDROOM uses a Confidence Envelope ring, BALANCED uses tile/bar/anchor compositions.

The modes share *zero* visual elements with each other beyond the persona-tag chrome and the support rail.

---

## 3. What materially changed

### 3.1 BALANCED

**Before:** Three horizontal anchors (Source / Coordination / Secondary) connected by a pressure-graded rail.
**After:** Four distinct semantic actor panels:
- **Decision Posture** — readiness state in 22px display weight + qualifier-class chip with advisory note.
- **Resolution Boundary** — 3-cell grid (Known / Partial / Execution-not-yet-validated) with explicit domain counts.
- **Confidence Boundary** — bar with grounded segment + diagonally-hatched advisory segment + percentage readout.
- **Pressure Anchor (origin only)** — single line (not a triad) showing the source domain and pressure tier.

The Primary/Coordination/Secondary triad no longer appears in BALANCED's center canvas.

### 3.2 DENSE

**Before:** Three weighted nodes (Origin / Pass-through / Receiver) connected by a gradient pressure rail; cluster concentration sub-panel; dense note.
**After:** Three distinct semantic actor panels:
- **Semantic Topology + Structural Backing + Semantic-Only Exposure (G + H + I combined)** — three cells that explicitly distinguish *structurally backed* (Q-00) vs *semantic-only · advisory* (Q-01) domains, with role-, tier-, and backing-state encoding per cell. Summary footer states "2 of 3 structurally backed · 1 semantic-only exposure."
- **Cluster Concentration** — large 32px headline ("47 clusters monitored") + grounded ratio bar + operational meta line.
- **Absorption Load** — dedicated panel for Coordination Layer's role: "68%" headline + horizontal bar + pattern note.

The triad is now annotated with structural-backing semantics, NOT just spatially repositioned.

### 3.3 INVESTIGATION

**Before:** Three trace bands (Observed pressure / Propagation absorption / Qualified receiver state) with evidence text and confidence rows.
**After:** Three distinct semantic actor panels:
- **Evidence Trace · lineage** — vertical chain of lineage hashes (evidence_object_hash → derivation_hash → baseline_anchor → run_id), drawing from `trace_linkage` data NOT used in prior iterations.
- **Signal Stack · N active** — flattens *all* `signal_cards` across blocks into individual signal rows. The current fixture has 4 distinct signals (Cluster Execution Pressure, Delivery Capacity Signal, Coordination Throughput Pressure, Secondary Throughput Signal). Each row carries pressure tier, evidence text, domain, and confidence row. This is signal-level, not domain-level.
- **Inference Prohibition** — explicit "MUST NOT infer / MUST NOT recommend / MUST NOT overstate" statement + applied qualifier rules (Q-01) + ALI rules (ALI-01..04) as monospace chips.

The investigation lens no longer mirrors the evidence-blocks triad; it surfaces lineage, signals, and the inference-prohibition contract.

### 3.4 BOARDROOM

**Before:** Decorative 168px state-color ring with surrounding glow halo. Calm but semantically empty.
**After:** **Confidence Envelope ring** — a 220px ring rendered with a `conic-gradient` showing:
- A filled state-color arc for the structurally-backed portion (e.g. 67%).
- A yellow-tinted arc for the advisory-bounded portion (e.g. 33%).
- An inner mask creating a donut shape.
- An inner center label showing the qualifier class (e.g. "Q-01") with sub-label "qualified-ready."

Below the ring: a two-row readout — "67% structurally backed" and "33% advisory bound" — making the ring's semantic meaning explicit.

The ring is no longer decoration. It is a Confidence Boundary visualization with explicit grounded-ratio and advisory-ratio.

---

## 4. The Propagation Structure correction

**Before:** Full-width horizontal chain of three weighted nodes below the IntelligenceField — duplicated the triad already in the center canvas.
**After:** Demoted to a thin single-line "selected path strip":

```
SELECTED PATH    Primary Delivery → Coordination Layer → Secondary Delivery   ·   HIGH origin   ·   2 chains captured
```

No more weighted nodes. No more duplication. The strip is contextual metadata; it does not compete with the canvas.

---

## 5. The Evidence Layer correction

**Before:** Full-width row of 3 evidence blocks (1 dominant + 2 supporting) below the Propagation Structure Zone — repeated the same domain-level evidence already covered semantically by the rep field.
**After:** Gated to **INVESTIGATION mode only**. In BALANCED, DENSE, and BOARDROOM the evidence layer is hidden. In INVESTIGATION it is preserved as the contextual descent zone (where the analyst register justifies the supplementary evidence cards).

---

## 6. The Vault future positioning

The vault is documented as the future semantic substrate (see `VAULT_TO_SEMANTIC_CANVAS_MODEL.md`). The current iteration uses an in-memory fixture; the binding to a vault-backed payload remains pending.

When live binding lands, the 15 semantic actors will be hydrated from vault-derived payloads:

- Decision Posture from `header_block.readiness_badge`
- Confidence Boundary from `topology_scope.grounded_domain_count` / `domain_count`
- Pressure Anchor from `evidence_blocks` filtered by `propagation_role === 'ORIGIN'`
- Propagation Path from `trace_block.propagation_path`
- Absorption Load from `evidence_blocks` filtered by `propagation_role === 'PASS_THROUGH'`
- Receiver Exposure from `evidence_blocks` filtered by `propagation_role === 'RECEIVER'`
- Semantic Topology from `evidence_blocks[].domain_alias`
- Structural Backing from `grounding_status === 'Q-00'` per block
- Semantic-Only Exposure from `grounding_status !== 'Q-00'` per block
- Cluster Concentration from `topology_scope.cluster_count`
- Signal Stack from `evidence_blocks[].signal_cards`
- Evidence Trace from `trace_linkage`
- Resolution Boundary from `topology_scope.grounding_label` + `qualifier_class`
- Inference Prohibition from `rendering_metadata.qualifier_rules_applied` + `ali_rules_applied`
- Report Artifact Access from `REPORT_PACK_ARTIFACTS` (with future per-artifact availability)

This is a complete mapping. The semantic system is ready for live binding.

---

## 7. What did NOT change

- Cinematic doctrine compliance (humanist sans, atmospheric ground, anti-dashboard floor).
- The three-column IntelligenceField layout (Executive Interpretation / Semantic Canvas / Support Rail).
- Persona-line microcopy under the lens controls.
- Render-state vocabulary, qualifier semantics, propagation logic, governance verdict logic — all untouched.
- Static report tier (still accessed via Report Pack in the support rail, never inlined).
- Fixture data — no inventions; all panels read existing data.

---

## 8. Authority

This document is authoritative for the semantic representation architecture. Future contracts that introduce a new actor must:

1. Assign a stable id (next available: P).
2. Assign a 2-letter code.
3. Specify the actor's data source.
4. Specify which lenses surface it.
5. Add it to `SEMANTIC_ACTORS` and update `LENS_MODE_SEMANTICS`.
6. Update `SEMANTIC_ACTOR_REGISTRY.md`.

Future contracts that propose collapsing actors or reusing the Primary/Coordination/Secondary triad as the dominant render must explicitly override this document.

---

**End of semantic representation system.**
