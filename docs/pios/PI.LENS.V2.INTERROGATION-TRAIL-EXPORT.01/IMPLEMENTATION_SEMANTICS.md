# Implementation Semantics — PI.LENS.V2.INTERROGATION-TRAIL-EXPORT.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| buildTrailHTML | InterrogationTrailBuilder.js | Generates self-contained HTML Structural Evidence Record | Reusable — primary export primitive |
| buildPostureSection | InterrogationTrailBuilder.js | §0 Decision Posture with executive summary, stability badge, snapshot ID | Internal — consumed by buildTrailHTML |
| buildConfidenceEnvelopeSection | InterrogationTrailBuilder.js | Structural Confidence Envelope (5-axis grid) | Internal — consumed by buildTrailHTML |
| buildPosturePathSection | InterrogationTrailBuilder.js | §1 Structural Path to Posture (7 chain elements, progressive disclosure) | Internal — consumed by buildTrailHTML |
| buildGovernanceBoundarySection | InterrogationTrailBuilder.js | §2 Governance Boundary (4 categories, collapsible prohibitions) | Internal — consumed by buildTrailHTML |
| buildEvidenceReviewSection | InterrogationTrailBuilder.js | §3 Structural Evidence Review (merged evidence chains, progressive disclosure) | Internal — consumed by buildTrailHTML |
| buildTopologySection | InterrogationTrailBuilder.js | Structural Semantic Topology (SVG) or Semantic-to-Structural Mapping (fallback) | Internal — consumed by buildTrailHTML |
| buildFooter | InterrogationTrailBuilder.js | Governed Structural Derivation footer with snapshot ID | Internal — consumed by buildTrailHTML |
| buildStyles | InterrogationTrailBuilder.js | Inline CSS (dark theme + print) | Internal — consumed by buildTrailHTML |
| derivePostureStability | InterrogationTrailBuilder.js | STABLE/SENSITIVE/TRANSITIONAL/VOLATILE from structural metrics | Reusable — stability assessment primitive |
| deriveConfidenceEnvelope | InterrogationTrailBuilder.js | 5-axis confidence assessment (grounding, continuity, visibility, posture, authority) | Reusable — confidence derivation primitive |
| computeSnapshotId | InterrogationTrailBuilder.js | Deterministic 8-char hex hash for temporal identity | Reusable — run-to-run comparison primitive |
| humanize | InterrogationTrailBuilder.js | Confidence language normalization via STRUCTURAL_LANGUAGE map | Internal — dual-surface rendering |
| confidenceBar | InterrogationTrailBuilder.js | Inline CSS severity visualization bar | Internal — consumed by section builders |
| STRUCTURAL_LANGUAGE | InterrogationTrailBuilder.js | Term → executive explanation mapping | Internal — normalization source |
| FORMAT_VERSION | InterrogationTrailBuilder.js | Version constant ('1.1') for evolution tracking | Reusable — consumed by future streams |

## 2. Input Contracts

### buildTrailHTML
- **Input:** Options object with 16 fields
- **Session state:** `exploredQueries` (Set\<string\>), `interrogationTrail` (Set\<number\>)
- **Registries:** `denseZonePaths`, `guidedQueryAnswers`, `interrogationExpansionRegistry`, `expansionTypeLabels`, `denseZoneRegistry`, `tonePalette`
- **Payload:** `fullReport` object
- **Context:** `client`, `run`, `qualifierClass`, `authorityTier`, `densityClass`, `boardroomMode`
- **Output:** HTML string — complete self-contained document

### fullReport consumed fields
- `readiness_summary`: score, band, posture, decision_validation_passed, decision_validation_total
- `topology_summary`: semantic_domain_count, structurally_backed_count, semantic_only_count, cluster_count, grounding_ratio
- `propagation_summary`: primary_zone_business_label, primary_zone_evidence, psig_signals
- `signal_interpretations[]`: severity, signal_name, label
- `evidence_blocks[]`: structural_backing
- `semantic_topology_edges[]`: source_domain, target_domain, relationship_type
- `semantic_domain_registry[]`: business_label, domain_id, grounding_status
- `qualifier_summary`: qualifier_class
- `client_name`, `client`, `run_id`

## 3. Output Contracts

### HTML Document Structure
- §0 Decision Posture — always generated, session-independent. Executive summary (4-5 severity-colored bullets), posture label with stability badge, confidence envelope metadata, snapshot ID.
- Structural Confidence Envelope — always generated, session-independent. 5-axis grid (grounding, continuity, visibility, posture confidence, interpretive authority) with visual confidence bars.
- Structural Semantic Topology — conditional on `semantic_topology_edges.length > 0`. Inline SVG with domain nodes (color-coded by grounding status and propagation role), edges (solid=causal, dashed=dependency), legend, and summary stats. Fallback: Semantic-to-Structural Mapping when no edges but domains exist (classifies as backed/semantic-only/unmapped). Omitted entirely when no domain data.
- §1 Structural Path to Posture — always generated, 7 derivation chain elements. Progressive disclosure via `<details open>`. Confidence bars for grounding and signal metrics. Humanized ontology terms.
- §2 Governance Boundary — always generated, 4 categories (known/unresolved/outside review scope/prohibited). Collapsible prohibitions list via `<details>`.
- §3 Structural Evidence Review — session-dependent, omits if no session activity. Merged evidence chains (formerly §3+§4). Evidence traces rendered as progressive disclosure per finding.
- Footer — Governed Structural Derivation branding, snapshot ID, evidence boundary statement.
- `<meta name="format-version" content="1.1">`
- `<meta name="snapshot-id" content="{8-char-hex}">`

### Determinism Contract
Same `fullReport` + same session state → same HTML output (except generation timestamp).

## 4. Calibration Assumptions

| Parameter | Value | Governed vs Tuned |
|-----------|-------|-------------------|
| FORMAT_VERSION | '1.1' | Governed — versioned evolution |
| Max domains shown in §2 | 8 | Tuned — display cap |
| Max signals shown in §1 | 5 | Tuned — display cap |
| 13 prohibitions | Fixed list | Governed — from 75.x contract |
| Stability thresholds | score ≥6 STABLE, ≥4 SENSITIVE, ≥2 TRANSITIONAL, <2 VOLATILE | Tuned — scoring algorithm |
| Confidence classification | ≥0.7 HIGH, ≥0.4 MODERATE, ≥0.15 LOW, <0.15 INSUFFICIENT | Tuned — axis thresholds |
| Snapshot ID hash | djb2 variant, 8-char hex | Governed — deterministic identity |
| STRUCTURAL_LANGUAGE map | 12 entries | Governed — dual-surface rendering |

## 5. Extension Points

- **New document sections:** Add builder function + call in `buildTrailHTML` orchestrator
- **New export formats:** Future streams can consume same section builders for PDF/JSON/ZIP
- **Format versioning:** Increment FORMAT_VERSION when document structure changes
- **Comparative trails:** Future streams can diff two `buildTrailHTML` outputs by section. `computeSnapshotId()` enables run-to-run identity comparison.
- **Confidence language:** Extend `STRUCTURAL_LANGUAGE` map for new ontology terms
- **Stability calibration:** Adjust `derivePostureStability()` scoring thresholds as empirical data accumulates
- **Confidence axes:** Add axes to `deriveConfidenceEnvelope()` for new structural dimensions

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| InterrogationTrailBuilder.js | All document generation logic, styling, section assembly |
| IntelligenceField.jsx | Export trigger (SupportRail block), handler (Blob download), prop threading |
| lens-v2-flagship.js | CSS for export trigger UI in SupportRail |
