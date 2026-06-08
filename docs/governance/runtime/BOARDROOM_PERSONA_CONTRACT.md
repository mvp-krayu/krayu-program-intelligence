# BOARDROOM Persona Contract

**Status:** LOCKED  
**Authority:** PIOS.CONSUMER-SUBSTRATE-PROJECTION.01  
**Effective:** 2026-06-08  

BOARDROOM is a conclusion surface. Not an evidence surface. Not a lighter DENSE.

BOARDROOM projects deterministic consequence-level cognition objects. The same objects THORR would produce when asked to present to the Board — rendered without an LLM.

---

## 1. Primary Projection Unit: Board Cognition Object

BOARDROOM may ONLY project Board Cognition Objects as primary content.

A Board Cognition Object is a consequence theme produced by the ConsequenceCompiler, qualified by the ProjectionAuthorityKernel.

Each Board Cognition Object answers:

| Question | Field | Example |
|---|---|---|
| **WHAT** should concern me? | theme_label | Systemic Operational Fragility |
| **WHY** should I care? | description | Multiple independent indicators converge through independent evidence paths |
| **WHERE** is it happening? | domain_narrative | Platform Infrastructure and Data — flow, concentration, coupling converging |
| **CONFIDENCE** — how proven? | authority + evidence_class | P2 / runtime-backed / 9 evidence items |
| **CONSEQUENCE** — what's at risk? | combined_synthesis | 16 dynamics create compounding instability |

## 2. Secondary: Domain Grounding

Each Board Cognition Object is grounded to one or more Domain Narratives from `forBoardroom().domain_narratives`. These answer WHERE the finding manifests in the specimen.

Domain Narratives are supporting evidence, not primary content.

## 3. Tertiary: Evidence Anchors

Evidence details (topology, pressure dimensions, signal families, attention zones, measurement evidence) are available as expandable drill-down. They are never primary BOARDROOM content.

## 4. Synthesis Elements

| Element | Source | Position |
|---|---|---|
| Executive Synthesis | `forBoardroom().executive_synthesis` | Lead narrative — one sentence |
| Board Cognition Objects | `forBoardroom().consequence_themes` | Primary content — CRITICAL/HIGH first |
| Domain Grounding | `forBoardroom().domain_narratives` | Supporting — where findings manifest |
| Convergence | `forBoardroom().combined_synthesis` | Closing — systemic summary |
| Reinforcement Flow | `forBalanced().reinforcement_flow` | Optional — how findings compound |
| Posture | `posture_label + posture_severity` | Authority badge |
| Topology | `TopologyGraph` | Visual anchor — always present |

## 5. What BOARDROOM Does NOT Project as Primary Content

- Domain lists or attention zone inventories
- Condition inventories or condition counts
- Pressure dimension grids
- Signal family chips or signal dot strips
- Runtime role lists
- Evidence path counts
- Measurement-level file details

These belong in DENSE (structural inspection) and OPERATOR (evidence inspection).

## 6. Rendering Order

1. **Posture badge** — severity + qualification state
2. **Executive synthesis** — one-sentence cross-domain conclusion
3. **Board Cognition Objects** — consequence themes as cards (CRITICAL/HIGH first, max 5 primary)
4. **Domain grounding** — where each finding manifests (collapsed, expandable)
5. **Convergence synthesis** — closing systemic statement
6. **Topology** — visual anchor
7. **Governed enrichment** — governance badges, signal pressure (BlueEdge only, below topology)

## 7. Parity Test

The BOARDROOM Persona Contract is satisfied when:

THORR Board Mode produces N conclusions for a specimen.
LENS BOARDROOM renders the same N conclusions deterministically.

Any gap between THORR Board output and LENS BOARDROOM output indicates missing cognition assembly, not missing rendering.

## 8. Authority Gating

Board Cognition Objects respect the ProjectionAuthorityKernel:
- Only authority-filtered consequence themes are projected
- Suppressed themes are counted but not rendered ("N findings beyond evidence authority")
- P-level determines which consequence themes survive filtering
