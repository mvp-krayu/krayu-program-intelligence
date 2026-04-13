# GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01 — Contract

## Contract Identity

- ID: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01
- Type: ONTOLOGY DEFINITION
- Mode: CONFIG-DRIVEN ONLY
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Define the canonical config-driven ontology that maps GAUGE/PiOS-native technical vocabulary and proven states into business-correct language for CTO/CEO-facing meaning projection — without adding interpretation beyond what GAUGE already proves.

This stream defines the ontology only. No UI page is created here.

---

## Authoritative Principle

**No config entry = no business-language output.**

All business language emitted by any future UI layer must trace to a phrase entry in `phrases.json`, which must trace to a concept in `concepts.json`, which must trace to explicit GAUGE input fields.

---

## Output Directory

```
app/gauge-product/lib/business-ontology/
  schema.json     — validation contract for all ontology files
  terms.json      — atomic term mappings (technical → business)
  concepts.json   — deterministic state-to-concept rules
  phrases.json    — controlled phrase template library
```

---

## Ontology Layer Definitions

### Layer A — Terms (`terms.json`)

Maps atomic technical terms to business-correct equivalents.

30 terms defined. Required minimum (15) covered plus additional topology, scoring,
and governance terms.

Key mappings:
| Technical term        | Business term                      |
|-----------------------|------------------------------------|
| coverage              | system visibility                  |
| reconstruction        | structural integrity verification  |
| unknown_space         | unmapped elements                  |
| structural_unit       | system component                   |
| binding_context       | structural domain                  |
| component_entity      | tracked system component           |
| capability_surface    | functional area                    |
| structural_overlap    | cross-domain dependency            |
| signal                | behavioral data signal             |
| execution_layer       | execution assessment layer         |
| structural_proof      | structural evidence record         |
| canonical_score       | proven structural score            |
| projected_score       | achievable score                   |
| band_label            | score classification               |

### Layer B — Concepts (`concepts.json`)

19 active concept rules + 3 deferred.

Each concept requires: `input_fields[]`, `predicate`, `business_concept`, `audience_scope`, `output_tags[]`.

All predicates are deterministic and explicit. No implicit or inferred logic.

Active concepts cover:
- Full/partial system visibility (DIM-01)
- Structural integrity confirmed/failed (DIM-02)
- No/present unmapped elements (DIM-04)
- Execution assessment not performed
- Escalation clear (DIM-03)
- Cross-domain dependencies present/absent
- Behavioral signals bound/unbound
- Score conditional (score.band_label)
- Source data complete (DIM-05)
- Structural pattern conformance (DIM-06)
- Confidence range computed
- Isolated structural elements (orphans)
- Multi-domain topology
- Unknown space in topology

Deferred concepts (3): axis-level reconstruction failure, projected score caveat, multi-phase execution state.

### Layer C — Phrases (`phrases.json`)

42 controlled phrase templates across all 19 active concepts.

Coverage:
- `shared` phrases: neutral factual statements for both audiences
- `cto` phrases: include metric counts, field references, state labels
- `ceo` phrases: shorter, higher-level, no internal terminology

Placeholder rules:
- Placeholders in `{curly_braces}` must be resolved from GAUGE data at render time
- If a placeholder cannot be resolved, the phrase must not be rendered
- Pluralization (`element_plural`, `record_plural`, etc.) resolved by rendering layer

### Layer D — Schema (`schema.json`)

Defines the validation contract for all 3 ontology files.

Contents:
- Required root keys per file
- Required and optional item keys per file
- Allowed values: `status`, `audience_scope`, `tone`, `predicate_operators`
- Traceability rules: phrase→concept, concept→input_fields, placeholder consistency
- Explicit prohibitions on narrative, recommendations, speculation

---

## Audience Model

| Scope    | Use case |
|----------|----------|
| `shared` | Neutral factual statements suitable for both CTO and CEO |
| `cto`    | Technical detail: counts, field references, state labels |
| `ceo`    | Summary form: no internal terminology, shorter phrasing |

---

## Unmapped Technical Terms

No technical terms from the required minimum list are unmapped.
All 15 required terms are covered.

Additional terms deferred to future streams:
- `reconstruction_axis` (axis-level failure detail — CONCEPT-D01)
- `projection.caveat` (free-form text field — requires extraction before mapping)
- Multi-phase `execution_status` values beyond PHASE_1_ACTIVE

---

## Governance

- No UI files modified
- No Gauge data contracts modified
- No ExecLens files modified
- No API endpoints created or modified
- All phrase entries traceable to concept_id
- All concept entries reference explicit input_fields
- No free-form narrative or recommendations in any phrase template
- Config-only — no hardcoded executive text in React or JS
