# PATH B Productization Model

**Stream:** PI.LENS.V2.SEMANTIC-ENVELOPE-AND-PROVENANCE.BASELINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This document formally defines the role of PATH B in the Program
Intelligence platform. It establishes the canonical distinction between
structural truth production (PATH A) and semantic projection
stabilization (PATH B).

---

## 1. PATH A: structural truth production

PATH A produces the foundational structural evidence chain:

```
Source material
  → 40.2  Structural intake (source inventory, node classification)
  → 40.3  Structural topology (component relationships, edge typing)
  → 40.4  Canonical topology (cluster assignment, node membership)
  → 75.x  Condition correlation / pressure candidates / pressure zones
  → 41.x  Signal projection
  → vault  Signal registry, evidence trace, vault readiness
  → DPSIG  Deterministic Pressure Signals (CPI, CFA)
  → reports  HTML report generation
```

PATH A outputs:
- Canonical topology with cluster assignments.
- DPSIG signal sets (TAXONOMY-01 replay-safe).
- Signal registry (PSIG sovereign).
- HTML reports (decision surface, narrative briefs, evidence briefs).
- Binding envelope (graph model; READ ONLY for all consumers).
- CEU grounding state.

PATH A is governed by `pipeline_execution_manifest.json`. Its protected
artifacts are immutable. Its thresholds are locked. Its execution order
is frozen.

PATH A does NOT:
- Assign business labels.
- Produce semantic continuity crosswalks.
- Validate decision rules against business vocabulary.
- Resolve Q-classes.
- Hydrate semantic actors.
- Authorize executive projection.

PATH A produces structural truth. It does not produce semantic
intelligence.

---

## 2. PATH B: semantic projection stabilization

PATH B begins where PATH A ends. It operates on the structural
substrate and the semantic artifacts produced by the semantic processing
pipeline (semantic bundle production, crosswalk production, decision
validation, reproducibility verification).

PATH B is what LENS v2 implements. It consists of:

```
Manifest registration
  → Artifact loading (GenericSemanticArtifactLoader)
  → DPSIG signal projection (DPSIGSignalMapper)
  → Semantic crosswalk indexing (SemanticCrosswalkMapper)
  → 15-actor hydration (SemanticActorHydrator)
  → Q-class resolution (QClassResolver)
  → Rendering metadata hydration
  → Canonical payload assembly (GenericSemanticPayloadResolver)
  → Executive projection (LENS v2 flagship surface)
```

PATH B outputs:
- Canonical semantic payload (`lens_semantic_payload` schema).
- 15-actor hydration registry.
- Q-class with governance-true language.
- Rendering metadata (vault artifact, replay-safe).
- Executive-facing surface with disclosure compliance.

---

## 3. What PATH B does NOT do

PATH B does NOT invent semantics.

This is the foundational constraint. Every semantic claim in the
PATH B output must be traceable to a real artifact in the PATH A
substrate or the semantic processing pipeline.

Specifically, PATH B:

- **Does not fabricate business labels.** If the crosswalk does not
  contain a label for DOM-03, the domain is shown with its structural
  identifier. No AI generates a plausible business name.

- **Does not synthesize grounding.** If a domain's `lineage_status`
  is NONE, it is reported as NONE. No interpolation upgrades NONE to
  STRONG based on proximity to grounded domains.

- **Does not generate narrative from speculation.** The narrative
  section reads: "Reproducibility verdict for this run:
  FULL_REPRODUCIBILITY." It does not say: "This codebase appears to
  be well-structured." The narrative is assembled from artifact fields.

- **Does not override Q-classes.** The Q-class is a pure function of
  `(backed_count, total_count, semantic_continuity_status,
  evidence_availability)`. No manual override. No admin promotion.

- **Does not fill gaps with synthetic data.** If `rendering_metadata`
  is absent, the IP actor shows PLACEHOLDER_BINDING_PENDING. It does
  not show ENFORCED with a footnote saying "metadata pending."

---

## 4. Core concepts

### Semantic gravity

The tendency of semantically rich substrates to produce
self-reinforcing evidence chains.

When a client provides rich source material:
- Business labels emerge from the semantic processing pipeline.
- The crosswalk connects structural IDs to business vocabulary.
- Decision validation confirms the semantic surface end-to-end.
- Reproducibility confirms the chain is replay-safe.
- Each artifact validates the others.

When a client provides thin source material:
- Structural labels remain as cluster IDs.
- No crosswalk is produced.
- Decision validation cannot execute.
- The chain breaks at the first missing link.
- The resolver fails closed.

Semantic gravity is cumulative. Each additional semantic artifact
strengthens the entire chain.

### Semantic continuity

The property that connects a client's business vocabulary to the
structural topology through a validated mapping.

Semantic continuity is VALIDATED when:
- A crosswalk artifact exists.
- The crosswalk contains at least one mapping with a lineage status.
- The mapping connects structural identifiers to business labels.

Semantic continuity is ABSENT when:
- No crosswalk artifact exists, OR
- The crosswalk is empty or trivial.

The Q-class resolver uses semantic continuity as a primary input.
Without VALIDATED semantic continuity, the maximum achievable Q-class
is Q-03 (SEMANTIC_ONLY).

### Semantic stabilization

The process of converting raw semantic evidence into a stable,
deterministic, replay-safe projection surface.

Stabilization includes:
- Q-class resolution (pure function, deterministic).
- Rendering metadata emission (replay-safe, self-hashed).
- Actor hydration (deterministic from artifact inputs).
- Disclosure compliance (contract-mandated language).

Stabilization is NOT interpretation. It does not summarize, rank,
or infer meaning. It maps artifact fields to projection surface
elements through governed transforms.

### Projection eligibility

The determination of whether a client's semantic envelope is rich
enough for executive projection.

Eligibility is determined by:
1. All 6 required artifacts present (manifest gate).
2. Artifacts loadable and valid (schema gate).
3. Q-class resolvable (at least Q-03; ideally Q-02 or Q-01).
4. No unrecoverable validation failures.

A client at S0 or S1 is not eligible. A client at S2 or S3 is
eligible.

### Cognition stabilization

The property that ensures the executive surface does not present
contradictory, ambiguous, or misleading information.

Cognition is stabilized when:
- The Q-class accurately reflects the grounding state.
- Unresolved gaps are explicitly disclosed.
- Forbidden language is absent from the surface.
- The qualifier chip renders with contract-mandated text.
- The narrative is assembled from artifact fields, not generated.
- The IP actor correctly reflects whether rendering_metadata is
  hydrated or pending.

Cognition stabilization is what prevents the executive from
misinterpreting partial grounding as full grounding, or semantic-only
evidence as structural evidence.

### Executive projection gating

The gate that prevents the executive surface from rendering unless
projection eligibility is confirmed.

The gate operates at multiple levels:
1. **Manifest gate:** unregistered pairs → 404.
2. **Artifact gate:** missing required artifacts → 424/502.
3. **Resolver gate:** invalid artifacts → 502.
4. **Q-class gate:** Q-04 → absence notice (no projection).
5. **Disclosure gate:** Q-02/Q-03 → mandatory qualifier chip.

No level can be bypassed. No admin flag can override.

### Disclosure-first semantics

The principle that every qualification, gap, and limitation must be
visible to the executive before any commitment decision.

Disclosure-first means:
- Q-02 surfaces the partial grounding status.
- Unresolved gaps are enumerated.
- Advisory confirmation is required before commitment.
- Forbidden language (probabilistic, AI-confidence) is prohibited.
- The qualifier chip uses contract-mandated executive language.

Disclosure is not a footnote. It is the primary framing.

### Partial grounding viability

The principle that partial structural grounding is sufficient for
executive projection when:
1. At least one domain is structurally backed (the anchor).
2. Semantic continuity is validated (the crosswalk exists).
3. The partial nature is explicitly disclosed (Q-02 chip).
4. Advisory confirmation is required (executive note).

BlueEdge operates at 4/17 grounding (23.5%). This is viable because
the zone anchor (DOMAIN-10) is STRONG, the origin cluster has EXACT
lineage, and the remaining 12 domains are honestly disclosed as
semantic-only with advisory weight.

The threshold is not "majority grounded." It is: "enough anchoring
to make the propagation narrative credible, with honest disclosure
of what is not backed."

### Semantic confidence envelope

The total semantic surface area for which the system can make
grounding claims.

For BlueEdge:
- 4 domains inside the confidence envelope (EXACT/STRONG lineage).
- 13 domains outside the confidence envelope (NONE/WEAK lineage).
- The envelope covers the zone anchor and origin cluster.
- The propagation narrative is anchored within the envelope.
- Domains outside the envelope carry advisory weight only.

For FastAPI:
- 0 domains inside the confidence envelope.
- The envelope is empty.
- No propagation narrative is possible.
- Projection not authorized.

---

## 5. PATH B is a governed semantic projection layer

PATH B is:
- **Governed:** all behavior is defined by contracts, schemas, and
  the Q-02 governance amendment.
- **Semantic:** it operates on meaning (domains, business labels,
  lineage) not just structure (nodes, clusters, edges).
- **Projection:** it projects semantic evidence onto an executive
  surface. It does not create evidence.
- **Layered:** it sits above PATH A and the semantic processing
  pipeline. It consumes their outputs. It never modifies them.

PATH B is NOT:
- An AI hallucination layer.
- A generative summarization engine.
- An inference system.
- A speculation framework.
- A confidence estimation service.

The distinction is foundational. PATH B takes real artifacts with real
fields and maps them to an executive surface through deterministic,
replay-safe, auditable transforms. If the artifacts are absent, PATH B
fails closed. If the artifacts are thin, PATH B projects thinness
honestly. If the artifacts are rich, PATH B projects richness with
appropriate qualification.

PATH B never invents the answer. It projects the evidence.

---

## 6. Summary

| Concept | Definition |
|---------|-----------|
| Semantic gravity | Self-reinforcing evidence chains in rich substrates |
| Semantic continuity | Validated mapping from structure to business vocabulary |
| Semantic stabilization | Converting raw semantic evidence to stable projection |
| Projection eligibility | All 6 required artifacts present + Q-class resolvable |
| Cognition stabilization | No contradictory/misleading/ambiguous executive information |
| Executive projection gating | Multi-level gate preventing unauthorized projection |
| Disclosure-first semantics | Every limitation visible before commitment |
| Partial grounding viability | Partial backing + honest disclosure = viable projection |
| Semantic confidence envelope | The surface area with grounding claims |

PATH A produces structural truth.
PATH B projects semantic evidence.
Neither invents what the other does not provide.
