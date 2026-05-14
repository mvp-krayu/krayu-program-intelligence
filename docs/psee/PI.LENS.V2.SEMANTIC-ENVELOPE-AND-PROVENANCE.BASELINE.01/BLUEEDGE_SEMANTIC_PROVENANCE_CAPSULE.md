# BlueEdge Semantic Provenance Capsule

**Stream:** PI.LENS.V2.SEMANTIC-ENVELOPE-AND-PROVENANCE.BASELINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This document explains why BlueEdge succeeded semantically and became
the first client to achieve LENS v2 executive projection. Every claim
is grounded in real artifacts.

---

## 1. PATH A → PATH B semantic transition

PATH A produced BlueEdge's structural truth:

- **40.2** — raw source intake, structural inventory (123 nodes for
  FastAPI; BlueEdge equivalent scale).
- **40.3** — structural topology log: component relationships,
  CONTAINS/IMPORTS edges, inter-module dependencies.
- **40.4** — canonical topology: cluster assignment, node membership,
  structural group formation.

This is the structural baseline. Every client that completes the PATH A
pipeline gets this far. FastAPI completed PATH A successfully.

PATH B begins where PATH A ends. PATH B does not invent semantics. It
stabilizes, contextualizes, qualifies, and projects the semantic
substrate that emerges when the structural topology is enriched with
domain-level semantic metadata from the client's own source material.

BlueEdge's PATH B transition succeeded because its source material
carried enough semantic content for the platform to:

1. Assign 17 named semantic domains (not just cluster IDs).
2. Map structural groups to business-readable labels.
3. Establish lineage status per domain (EXACT, STRONG, NONE, WEAK).
4. Build a semantic continuity crosswalk connecting structure to
   business vocabulary.
5. Validate decision rules across the full semantic topology.
6. Confirm reproducibility under deterministic replay.

FastAPI's source material did not carry equivalent semantic content. Its
semantic topology remained at `STRUCTURAL_LABELS_ONLY`.

---

## 2. DPSIG contribution

The DPSIG signal set (`artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json`) provides:

- **Normalization basis:** 7 non-singleton clusters, max cluster
  `src` at 89 nodes out of 123 total structural nodes.
- **Derivation context:** canonical topology hash
  (`08480c17...`), topology snapshot hash, 123 structural nodes,
  19 clusters.
- **Provenance chain:** stream anchor
  `PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01`,
  TAXONOMY-01 replay-safe fields preserved.
- **Signal set:** CPI (Cluster Pressure Index) and CFA (Cluster
  Fan Asymmetry) signals per cluster, deterministically derived
  from the canonical topology.
- **Generated timestamp:** anchored for replay-safety.

DPSIG is the structural intelligence layer. It contextualizes the
topology in terms of pressure distribution, concentration, and
asymmetry. Without DPSIG, the executive surface has no propagation
summary, no zone evidence, and no derivation lineage.

Both BlueEdge and FastAPI have DPSIG signal sets. The difference is
not in DPSIG — it is in what happens above DPSIG.

---

## 3. CEU grounding contribution

CEU (Component Evidence Unit) grounding determines what proportion of
the semantic topology is anchored to real structural evidence.

BlueEdge's grounding profile (from the semantic topology model):

| Lineage status | Domain count | Meaning |
|----------------|-------------|---------|
| EXACT          | 3           | Direct structural correspondence |
| STRONG         | 1           | High-confidence structural linkage |
| NONE           | 12          | Semantic domain without structural backing |
| WEAK           | 1           | Minimal structural evidence |

**Grounding ratio:** 4/17 (EXACT + STRONG) = 23.5% structurally backed.

This ratio directly drives the Q-class resolution:
- `backed_count = 4`
- `total_count = 17`
- `0 < 4/17 < 1.0`
- `semantic_continuity_status = VALIDATED`
- → Q-02 (PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY)

FastAPI's grounding profile: all 9 domains at lineage_status NONE.
Even if FastAPI had a crosswalk and decision validation, its grounding
ratio would be 0/9 → Q-03 (SEMANTIC_ONLY) at best.

---

## 4. Semantic continuity crosswalk contribution

The crosswalk (`semantic/crosswalk/semantic_continuity_crosswalk.json`)
is what transforms structural identifiers into business vocabulary:

- **13 entities** mapped: DOM-XX → COMP-NN → CAP-NN → DOMAIN-NN.
- **9 of 13** carry a resolved `business_label` (69.2% label
  coverage).
- **4 entities** fall back to technical labels (DOM-01, DOM-03,
  DOM-05, DOM-09).
- Lineage distribution across crosswalk entries: 1 EXACT, 5 STRONG,
  2 PARTIAL, 1 NONE, 4 WEAK.

The crosswalk is the bridge between structural truth and executive
cognition. Without it:

- The executive surface has no business-readable domain labels.
- The propagation summary uses cluster IDs instead of human terms.
- The qualifier system cannot assert semantic continuity validation.
- The Q-class resolver falls to Q-03 or Q-04.

FastAPI has no crosswalk. Its domains carry identifiers like
`DOM-01`, `DOM-02` with no business labels, no capability mapping,
no component linkage. The structural topology exists, but the
semantic translation layer does not.

---

## 5. Domain lineage contribution

BlueEdge's 17 semantic domains include:

- Named domain types: FUNCTIONAL, INFRASTRUCTURE, OPERATIONAL,
  CROSS-CUTTING, INTEGRATION.
- Business labels: "Fleet Operations", "Vehicle Lifecycle",
  "Operational Intelligence", "Platform Infrastructure",
  "Integration Services", etc.
- Zone anchors: DOMAIN-10 is the active pressure zone anchor,
  connecting the DPSIG propagation surface to the semantic domain
  that represents the coordination layer.
- 5 named clusters mapping to the 17 domains: Operational
  Intelligence, Fleet Operations, Emerging Capabilities, Platform
  Infrastructure, Platform Services.

This domain structure is what the 15 LENS v2 actors hydrate from.
The DP (Decision Posture) actor reads the domain count. The CB
(Confidence Basis) actor reads the grounding ratio. The AL
(Aliasing Layer) actor reads the business labels. The PA
(Propagation Awareness) actor reads the zone anchors.

Without this domain structure, the actors have nothing to hydrate
from. The LENS v2 surface shows empty panels.

---

## 6. decision_validation contribution

BlueEdge's decision validation
(`semantic/decision/decision_validation.json`) contains:

- **14 checks** (VF-01 through VF-14), all PASS.
- Checks cover: score/band/posture derivation correctness,
  terminology compliance, semantic coverage display accuracy, zone
  rendering validity, signal binding integrity, baseline signal
  handling, unsupported metric gating, runtime boundary enforcement,
  recommendation prohibition, zone count accuracy, label hierarchy
  consistency, client-agnostic rendering compliance.

The decision validation is consumed by:

- The generic resolver, which reads `VF-05` evidence to identify the
  active pressure zone anchor business label.
- The generic resolver, which reads `VF-07` evidence for active PSIG
  propagation evidence.
- The readiness summary, which reports decision_validation_passed /
  decision_validation_total.

Without decision validation:
- The resolver cannot determine the active zone anchor.
- The readiness summary reports 0/0 checks.
- The loader returns `REQUIRED_ARTIFACT_MISSING` → binding REJECTED.

---

## 7. reproducibility_verdict contribution

BlueEdge's reproducibility verdict
(`semantic/report_inputs/reproducibility_verdict.json`) confirms:

- **Verdict:** `FULL_REPRODUCIBILITY`
- **5 criteria:** structural_match, decision_match,
  report_generation_clean, no_drift, no_patching — all PASS.
- **graph_state:** MD5 hash identical across replay runs.

The reproducibility verdict is consumed by:

- The generic resolver's `evidence_summary.reproducibility_verdict`
  field.
- The narrative `why_section`: "Reproducibility verdict for this
  run: FULL_REPRODUCIBILITY."
- The `trace_summary.reproducibility_verdict` field.

Without it:
- The resolver cannot confirm replay safety.
- The loader returns `REQUIRED_ARTIFACT_MISSING` → binding REJECTED.

---

## 8. rendering_metadata contribution

The rendering metadata
(`vault/rendering_metadata.json`, hash
`sha256:869d49549f8fd894...`) provides:

- **grounding_class:** Q-02
- **inference_prohibition_status:** ENFORCED
- **semantic_continuity_status:** VALIDATED
- **derivation_inputs:** `{ backed_count: 4, total_count: 17, ... }`
- **unresolved_semantic_gaps:** 12 entries for non-structurally-backed
  domains
- **disclosure_requirements:** contract-mandated executive language
- **actor_projection_status:** all 15 actors at HYDRATED or
  HYDRATED_WITH_DERIVATION; IP at HYDRATED
- **self-hash:** replay-safe, additive-only

The rendering metadata is what transitions the IP (Inference
Prohibition) actor from `PLACEHOLDER_BINDING_PENDING` to `HYDRATED`
with `inference_prohibition_status = ENFORCED`. Without it, the
executive surface shows "INFERENCE PROHIBITION: BINDING PENDING"
instead of "INFERENCE PROHIBITION: ENFORCED".

---

## 9. Q-02 stabilization contribution

Q-02 stabilization (via `Q02_GOVERNANCE_AMENDMENT.md`) resolved a
critical cognitive ambiguity: what does it mean when 4 of 17 domains
are structurally backed and the rest are semantic-only?

Before Q-02 stabilization:
- The surface displayed `Q-01` (the legacy compat class), which
  was factually misleading.
- There was no contract-mandated executive language for the partial
  grounding case.
- The forbidden language list (no "probabilistic", no "AI confidence")
  was not formalized.

After Q-02 stabilization:
- `qualifier_summary.qualifier_class = Q-02` — governance-true.
- `qualifier_class = Q-01` — legacy compat (top-level).
- Contract-mandated executive language: "QUALIFIER Q-02 · Partial
  Grounding · Structural Continuity".
- Advisory confirmation required before executive commitment.
- Forbidden language formally locked.

This stabilization is what makes the surface honest. The executive sees
the actual grounding state, not a flattering abstraction.

---

## 10. Business-label emergence

Business labels did not emerge from AI inference. They emerged from the
client's own source material through the semantic processing pipeline:

1. **Structural intake (40.2):** source files scanned, components
   identified.
2. **Structural topology (40.3):** components grouped by relationship
   patterns (CONTAINS, IMPORTS, co-membership).
3. **Canonical topology (40.4):** clusters finalized.
4. **Semantic bundle production:** clusters mapped to semantic domains
   using evidence from the source material's own naming conventions,
   package structure, and documentation.
5. **Crosswalk production:** DOM-XX → COMP-NN → CAP-NN → DOMAIN-NN →
   business_label.

The business labels are: "Fleet Operations", "Vehicle Lifecycle",
"Operational Intelligence", "Platform Infrastructure", "Integration
Services", "Emerging Capabilities", etc. These are derived from how
BlueEdge names its own modules and packages — not from AI generation.

FastAPI's structural labels (`CLU-01`, `CLU-02`, ..., `CLU-19`) are
cluster IDs with no business vocabulary mapping. The semantic bundle
producer ran, but without the enrichment artifacts that would have
produced a crosswalk, the labels remained structural.

---

## 11. Semantic gravity explanation

Semantic gravity is the tendency of semantically rich substrates to
produce self-reinforcing evidence chains: business labels anchor
domain identifiers, which anchor crosswalk mappings, which anchor
decision validation checks, which anchor reproducibility verdicts,
which collectively validate semantic continuity.

BlueEdge has semantic gravity because:
- 17 named domains with typed relationships create a dense semantic
  field.
- 4 structurally backed domains create an anchor point for the rest.
- The crosswalk connects 13 structural entities to business vocabulary.
- Decision validation confirms 14/14 checks, validating the semantic
  surface end-to-end.
- The reproducibility verdict confirms the whole chain is replay-safe.

FastAPI lacks semantic gravity because:
- 9 unnamed domains with no edges create no semantic field.
- 0 structurally backed domains create no anchor.
- No crosswalk means no business vocabulary.
- No decision validation means no end-to-end semantic surface check.

Semantic gravity is not a binary. It accumulates. The more semantic
artifacts a client produces, the more the existing artifacts
cross-validate each other, and the stronger the grounding claim becomes.

---

## 12. Why 4–5 grounded domains were sufficient

BlueEdge has 4 structurally backed domains out of 17 (23.5%). This
is not full grounding. Under Q-02, it is explicitly disclosed as
partial grounding.

But 4 grounded domains are sufficient for executive projection because:

1. **The zone anchor (DOMAIN-10) is STRONG.** The most important
   structural pivot — the coordination layer — has verified structural
   backing. This means the pressure zone propagation narrative is
   grounded.

2. **The origin cluster has EXACT lineage.** The dominant pressure
   origin maps directly to the structural topology. The "where does
   pressure come from" narrative is grounded.

3. **The semantic-only domains are honestly disclosed.** The
   executive surface does not hide the 12 ungrounded domains. It shows
   them as advisory-weight domains requiring confirmation before
   commitment.

4. **The Q-02 qualifier makes the partial nature explicit.** The
   executive is told: this is partial grounding with structural
   continuity. Advisory confirmation is required. There is no pretense
   of full coverage.

The minimum viable threshold is not "majority grounded." It is:
"enough structural anchoring to make the propagation narrative
credible, combined with honest disclosure of what is not backed."

---

## 13. Why unresolved gaps did not collapse cognition

BlueEdge has 12 unresolved semantic gaps (domains at lineage_status
NONE or WEAK without structural backing). These are recorded in
`rendering_metadata.unresolved_semantic_gaps` and exposed through:

- `unresolved_gaps` in the canonical payload.
- `qualifier_summary.qualifier_note`: "advisory confirmation required."
- The Q-02 chip on the executive surface.
- The disclosure requirements in the rendering metadata.

The gaps did not collapse cognition because:

1. **The resolver does not hide them.** Every gap is enumerated with
   `code`, `domain_id`, `reason`, and `impact: ADVISORY_REQUIRED`.

2. **The executive surface discloses them.** The qualifier mandate
   renders: "Partial Grounding · Structural Continuity." The executive
   note states the advisory requirement.

3. **The adapters do not suppress them.** The adapted display shows
   `qualifier_class_governance: Q-02`, not the compat Q-01.

4. **The rendering metadata records them.** 12 gaps are permanently
   recorded in the vault artifact with replay-safe hashing.

The system does not attempt to paper over partial grounding. It
projects partial grounding honestly and gates executive commitment
behind advisory confirmation. This is the Q-02 governance model.

---

## 14. Why FastAPI failed equivalent stabilization

FastAPI's structural pipeline succeeded (PATH A complete). But its
semantic envelope is insufficient for executive projection:

| Dimension | BlueEdge | FastAPI |
|-----------|----------|---------|
| semantic_level | Full semantic model | STRUCTURAL_LABELS_ONLY |
| Domain count | 17 (named, typed) | 9 (ID-only) |
| Business labels | Yes (crosswalk-derived) | No |
| Lineage EXACT/STRONG | 4 | 0 |
| Crosswalk | 13 entities mapped | Absent |
| Decision validation | 14/14 PASS | Absent |
| Reproducibility | FULL_REPRODUCIBILITY | Absent |
| Rendering metadata | HYDRATED, ENFORCED | Not emitted (writer fails) |
| Q-class eligible | Q-02 | Not resolvable (3 required artifacts absent) |

FastAPI failed semantic stabilization because:

1. **Its source material is a well-structured but documentation-thin
   OSS framework.** FastAPI's Python source produces clean structural
   clusters but minimal business vocabulary.

2. **No semantic continuity crosswalk was produced.** Without a
   crosswalk, there is no bridge from structural IDs to business
   language.

3. **No decision validation was run.** Without decision validation,
   there is no end-to-end semantic surface check.

4. **No reproducibility verdict was issued.** Without it, the
   resolver cannot confirm replay safety.

This is not a failure of FastAPI as a codebase. It is an expected
outcome for a codebase that has not been through the semantic
enrichment pipeline. FastAPI's role is `CONTROL_FIXTURE_NOT_FLAGSHIP`:
it proves that the system fails closed on thin substrates instead of
fabricating richness.

---

## 15. Canonical semantic provenance chain

```
CLIENT SOURCE MATERIAL (uploads, codebase, documentation)
    │
    ▼
STRUCTURAL INTAKE (40.2)
    │   Source inventory, structural node classification
    ▼
STRUCTURAL TOPOLOGY (40.3)
    │   Component relationships, edge typing
    ▼
CANONICAL TOPOLOGY (40.4)
    │   Cluster assignment, node membership
    ▼
DPSIG DERIVATION (Lane D)
    │   Pressure signals, concentration, asymmetry
    ▼
SEMANTIC BUNDLE PRODUCTION
    │   Domain naming, typing, business label mapping
    ▼
SEMANTIC CONTINUITY CROSSWALK
    │   DOM-XX → COMP-NN → CAP-NN → business vocabulary
    ▼
CEU GROUNDING
    │   Structural backing ratio per domain
    ▼
DECISION VALIDATION
    │   14 end-to-end checks (VF-01..VF-14)
    ▼
REPRODUCIBILITY VERDICT
    │   Deterministic replay confirmation
    ▼
Q-CLASS RESOLUTION (QClassResolver)
    │   Pure function: (backed, total, continuity, evidence) → Q-XX
    ▼
RENDERING METADATA EMISSION
    │   Vault artifact: Q-class, IP status, gaps, disclosure
    ▼
RUNTIME SEMANTIC HYDRATION (GenericSemanticPayloadResolver)
    │   Manifest-driven, 15-actor hydration
    ▼
EXECUTIVE PROJECTION (LENS v2 flagship surface)
    │   Contract-mandated language, honest disclosure
    ▼
LIVE BINDING
    BlueEdge: LIVE (Q-02, ENFORCED)
    FastAPI:  REJECTED (REQUIRED_ARTIFACT_MISSING)
```

This chain is the canonical explanation of how semantic richness
emerges in PATH B. No step invents semantics. Each step transforms,
validates, or contextualizes evidence that already exists. The chain
fails closed at the first missing required link.
