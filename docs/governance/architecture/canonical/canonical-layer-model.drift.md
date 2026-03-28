# Canonical Layer Model — Drift Record

Stream: 00.2 — Canonical Layer Model Restoration
Artifact: canonical-layer-model.drift.md
Date: 2026-03-22
Status: PROVISIONAL

────────────────────────────────────

## 1. Purpose

Explicitly identify where Streams 40.x, 41.x, 42.x, and 51 introduced architectural drift, state the nature of each drift, explain why it occurred, and provide corrective positioning.

────────────────────────────────────

## 2. Drift Inventory

────────────────────────────────────

### Drift 00.2-D1 — SSZ / SSI Derivation at L6 (Streams 42.x, 51)

Streams: 42.x (topology adapter), 51 (SSZ implementation)
Introduced: Stream 51 runtime delta implementation (2026-03-22)

Nature of drift:
SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are conceptually L3 derivation constructs. The implementation placed computeSSZ() in utils/ssz.js inside the ExecLens runtime (L6), deriving SSZ from the topology API response inside the UI layer.

Why it occurred:
Stream 51 was scoped as a minimal runtime delta to close presentation gaps within the existing UI. The fastest compliant path was to derive SSZ at the point of consumption (UI) from already-available topology data, rather than requiring a new L3 artifact and adapter modification. Speed of closure caused layer boundary to be crossed.

Drift severity: MODERATE
Violated rule: L6 must not perform L3 computation
Evidence First impact: Derivation is still evidence-bound (topology data from 42.7 adapter). No evidence fabrication. Drift is structural, not epistemic.

Corrective positioning:
- Define SSZ/SSI formally at L3 as a governed derivation artifact
- Expose SSZ in the topology adapter output (or equivalent L3 output) as a pre-computed field
- Remove computeSSZ() from L6 once L3 specification is complete
- ExecLens (L6) receives SSZ as a payload field, not as a self-derived result

────────────────────────────────────

### Drift 00.2-D2 — Executive Interpretation Semantic Shaping at L6 (Stream 51)

Streams: 51
Introduced: Stream 51 runtime delta implementation (2026-03-22)

Nature of drift:
Executive Interpretation semantic shaping (choice of language, structural framing, relevance mapping) was implemented in ExecutiveInterpretationPanel.js at L6. L4 (Semantic Shaping Layer) has no formal specification in this program.

Why it occurred:
Stream 51 required a controlled, evidence-bound executive explanation. In the absence of a formal L4 specification, template-based rendering was implemented directly in the L6 component as the most evidence-safe option. The template approach prevents fabrication while filling the gap created by the absent L4 layer.

Drift severity: LOW-MODERATE
Violated rule: Semantic shaping belongs at L4, not L6
Mitigating factor: Template is non-speculative, wording is fixed, source fields are explicitly enumerated. No semantic inflation occurs.

Corrective positioning:
- Define formal L4 semantic shaping specification for structural interpretation
- Govern allowed vocabulary, framing rules, and evidence binding requirements at L4
- L6 renders only — receives governed semantic payload from L4/L5

────────────────────────────────────

### Drift 00.2-D3 — Contract Prose as Architecture Carrier (Streams 42.x)

Streams: 42.x
Introduced: Progressively across 42.1–42.19

Nature of drift:
Stream contracts (docs/pios/contracts/42.x/) began carrying layer boundary definitions, component ownership statements, and architectural scope descriptions as prose. This caused contracts to function as de facto architecture references rather than execution control surfaces.

Why it occurred:
No canonical architecture artifact existed prior to Stream 00.2. Contracts filled the vacuum by specifying not only what each stream was authorized to do but also implying what layers owned which behaviors. This was unavoidable given the absence of a formal architecture reference.

Drift severity: LOW (no runtime violation; documentation drift only)
Violated rule: Contracts are L8 governance artifacts, not architecture carriers

Corrective positioning:
- All future contracts must reference canonical-layer-model.md rather than re-specifying layer boundaries
- Existing contracts remain valid as execution records but are not architectural authorities
- Layer boundary questions resolve against canonical-layer-model.md

────────────────────────────────────

### Drift 00.2-D4 — Shorthand Signal Vocabulary Without L3 Anchor (Streams 40.x, 42.x)

Streams: 40.x, 42.x
Introduced: Across stream execution

Nature of drift:
Terms such as SSZ, ESI, RAG state, structural density, and structural concentration were used in contracts, UI labels, and documentation without formal derivation specifications at L3. These terms circulated as understood shorthand without a governing formal definition.

Why it occurred:
Signal vocabulary evolved organically through stream execution. Stream mandates introduced terminology that was conceptually coherent but not formally grounded in L3 derivation artifacts.

Drift severity: MODERATE
Violated rule: No derived claim without derivation lineage (Invariant 2)

Corrective positioning:
- Each signal construct (SSZ, SSI, ESI, RAG if applicable) must receive a formal derivation specification at L3
- Vocabulary in contracts, UI labels, and documentation must trace to L3 specifications
- Shorthand terms without L3 anchors must be marked PROVISIONAL until specifications are complete

────────────────────────────────────

### Drift 00.2-D5 — Demo Constructs Absorbing Presentation Architecture (Stream 51)

Streams: 51
Introduced: Stream 51 artifact series (2026-03-22)

Nature of drift:
Stream 51 produced killer-shot documents, demo sequence specifications, and narrative rules that were correctly scoped to L7. However, the presentation choreography (demo_sequence.md, demonstration_model_v2.md) began to resemble a product architecture specification rather than a demo packaging artifact.

Why it occurred:
Stream 51 was a rigorous governance reconstruction of demo layer content. The artifacts are detailed and disciplined. Their level of rigor caused them to appear architecture-like. They remain correctly scoped to L7 but require clear demarcation to prevent future promotion to canonical architecture status.

Drift severity: LOW (correctly placed; appearance risk only)
Violated rule: No violation. Risk is future misclassification.

Corrective positioning:
- All Stream 51 artifacts are explicitly classified as L7 in canonical-layer-model.classification.md
- Demo artifacts must include explicit L7 classification headers on future revision
- No Stream 51 artifact may be promoted to canonical architecture without formal Stream 00.x governance revision

────────────────────────────────────

### Drift 00.2-D6 — Validation Outcomes Without Durable Archive (Streams 42.x)

Streams: 42.x
Introduced: Across stream execution

Nature of drift:
Stream validation outcomes (validator PASS results, acceptance criteria confirmations) exist inside contract records and stream discussion artifacts but are not consolidated into a governed validation archive with structured retrieval.

Why it occurred:
Stream execution moved faster than governance archival practices. Validation was thorough within streams but was not systematically filed into a persistent, structured governance memory.

Drift severity: LOW (no architectural violation; operational governance gap)
Violated rule: Validation memory belongs durably at L8

Corrective positioning:
- Establish a governed validation archive under evidence/ or governance/ with structured index
- Future stream validation outcomes must be filed into the archive at stream close
- This evidence index (evidence/architecture/00.2_canonical-layer-model/index.json) initiates this pattern

────────────────────────────────────

## 3. Drift Summary

| ID | Stream | Nature | Severity | Status |
|---|---|---|---|---|
| D1 | 42.x / 51 | SSZ/SSI derivation at L6 | MODERATE | OPEN — L3 spec required |
| D2 | 51 | Executive Interpretation shaping at L6 | LOW-MODERATE | OPEN — L4 spec required |
| D3 | 42.x | Contract prose as architecture carrier | LOW | CONTAINED — canon reference now exists |
| D4 | 40.x / 42.x | Shorthand signal vocabulary without L3 anchor | MODERATE | OPEN — L3 specs required per term |
| D5 | 51 | Demo constructs appearing architecture-like | LOW | CONTAINED — classified L7 |
| D6 | 42.x | Validation outcomes without durable archive | LOW | OPEN — archive pattern initiated |

────────────────────────────────────

## 4. Confidence Summary

| Dimension | Confidence |
|---|---|
| Drift identification completeness | 88% |
| Drift severity accuracy | 85% |
| Corrective positioning completeness | 90% |

Overall drift confidence: 87%
Status: PROVISIONAL — open drift items D1, D2, D4, D6 require resolution streams before drift record can be closed.
