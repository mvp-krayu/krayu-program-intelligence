# PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01 — Implementation

**Stream:** PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
**Branch:** work/lens-v2-productization
**Baseline commit:** 76939e7 (governance) · 93098cb (BlueEdge productized run)
**Binding target:**
- Client: `blueedge`
- Run: `run_blueedge_productized_01_fixed`
- Substrate root: `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/`
- DPSIG vault: `artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json`

This document records how the LENS V2 flagship route at `/lens-v2-flagship`
was bound to the live BlueEdge productized substrate, replacing the prior
fixture (`flagship_real_report.fixture.js`) as the truth surface.

---

## 1. Authority and scope

The contract authorises a single client/run pair. The resolver and both API
endpoints reject anything else with `CLIENT_NOT_ALLOWED` /
`RUN_NOT_ALLOWED`.

| Constraint                  | Value                                              |
|-----------------------------|----------------------------------------------------|
| Allowed client              | `blueedge` (only)                                  |
| Allowed run                 | `run_blueedge_productized_01_fixed` (only)         |
| Path traversal              | rejected (`..` and non-alphanumeric characters)    |
| Fixture fallback            | DISABLED (`fixture_fallback_disabled = true`)      |
| Topology mutation           | forbidden (resolver is read-only)                  |
| Semantic mutation           | forbidden (resolver is read-only)                  |
| AI calls / prompt surfaces  | forbidden (no runtime inference)                   |

The substrate is loaded through `process.env.REPO_ROOT` so that the runtime
can never read files outside the repository.

---

## 2. Components added

| File                                                                  | Lines | Purpose                                                                 |
|-----------------------------------------------------------------------|-------|-------------------------------------------------------------------------|
| `app/execlens-demo/lib/lens-v2/SemanticArtifactLoader.js`             |   99  | Path-traversal-safe JSON / text reads anchored to REPO_ROOT             |
| `app/execlens-demo/lib/lens-v2/SemanticCrosswalkMapper.js`            |  111  | DOM-XX → business label translation via semantic_continuity_crosswalk    |
| `app/execlens-demo/lib/lens-v2/DPSIGSignalMapper.js`                  |  132  | Projects DPSIG TAXONOMY-01 signals into the LENS V2 signal stack         |
| `app/execlens-demo/lib/lens-v2/SemanticActorHydrator.js`              |  390  | 15-actor hydration with explicit binding-status disclosure               |
| `app/execlens-demo/lib/lens-v2/BlueEdgePayloadResolver.js`            |  564  | Top-level orchestrator: gating, artifact resolution, payload assembly    |
| `app/execlens-demo/lib/lens-v2/index.js`                              |   14  | Barrel export                                                            |
| `app/execlens-demo/pages/api/lens-payload.js`                         |   69  | `GET /api/lens-payload?client=...&run=...`                               |
| `app/execlens-demo/pages/api/report-pack.js`                          |   80  | `GET /api/report-pack?client=...&run=...&artifact=...`                   |
| `app/execlens-demo/flagship-experience/tests/live-binding.test.js`    |  336  | 37-case live-binding regression suite                                    |

`app/execlens-demo/pages/lens-v2-flagship.js` was migrated from fixture
import to `getServerSideProps` calling `resolveBlueEdgePayload`. The
fixture import was removed entirely. There is no fallback path: when the
resolver fails the page renders a `LIVE_BINDING_FAILED` visible state.

---

## 3. Hydration map (15 actors)

| Code | Actor                       | Status                        | Source                                                       |
|------|-----------------------------|-------------------------------|--------------------------------------------------------------|
| DP   | Decision Posture            | HYDRATED                      | `semantic/decision/decision_validation.json` (VF-01)          |
| CB   | Confidence Boundary         | HYDRATED_WITH_DERIVATION      | qualifier_summary derivation (Q-01 / exploratory Q-02)        |
| PA   | Pressure Anchor             | HYDRATED                      | DPSIG cluster pressure index → max-cluster anchor             |
| PP   | Propagation Path            | HYDRATED                      | semantic_topology_model + canonical_topology_40_4             |
| AL   | Absorption Load             | HYDRATED                      | semantic_topology_model cluster distribution                  |
| RE   | Receiver Exposure           | HYDRATED                      | semantic_topology_model receiver classification               |
| ST   | Semantic Topology           | HYDRATED                      | semantic_topology_model                                       |
| SB   | Structural Backing          | HYDRATED                      | canonical_topology_40_4                                       |
| SO   | Semantic-Only Exposure      | HYDRATED                      | semantic_topology_model lineage_status                        |
| CC   | Cluster Concentration       | HYDRATED                      | dpsig_signal_set normalization basis                          |
| SS   | Signal Stack                | HYDRATED                      | dpsig_signal_set entries (TAXONOMY-01 preserved)              |
| ET   | Evidence Trace              | HYDRATED                      | evidence_trace + decision_validation cross-references         |
| RB   | Resolution Boundary         | HYDRATED_WITH_DERIVATION      | readiness_summary band + posture                              |
| IP   | Inference Prohibition       | PLACEHOLDER_BINDING_PENDING   | rendering_metadata (vault artifact not yet written)            |
| RA   | Report Artifact Access      | PRESENTATION_LAYER_DERIVED    | report-pack endpoint surface (no semantic mutation)           |

Distribution: `HYDRATED 11 · HYDRATED_WITH_DERIVATION 2 ·
PLACEHOLDER_BINDING_PENDING 1 · PRESENTATION_LAYER_DERIVED 1 = 15`.

Inference Prohibition is intentionally exposed as a placeholder. The page
visibly carries an `INFERENCE PROHIBITION: BINDING PENDING` banner so the
gap is never softened.

---

## 4. Qualifier derivation

Computed in `SemanticActorHydrator.deriveQualifierClass`:

```
ratio = backed_count / total_domains
if ratio == 1.0  → qualifier_class = Q-00 ("Fully Grounded")
else             → qualifier_class = Q-01 ("Partial Grounding · advisory bound")
                   derived_qualifier_class = (ratio < 0.6) ? Q-02 : Q-01
```

For `run_blueedge_productized_01_fixed`:
- backed_count = 4 / total_count = 17 → ratio ≈ 0.235
- `qualifier_class = Q-01` (current governance only supports Q-00 / Q-01)
- `derived_qualifier_class = Q-02` (exposed as exploratory candidate;
  pending governance amendment — not used for orchestrator gating)

The qualifier note explicitly carries the exploratory marker so executive
readers cannot mistake the partial-grounding state for full grounding.

---

## 5. DPSIG provenance preservation

The DPSIG mapper preserves all TAXONOMY-01 fields per signal entry:

- `signal_id`, `signal_class`, `signal_name`
- `replay_class = TAXONOMY-01`
- `signal_value`, `activation_state`, `severity`
- `denominator_guard.{guard_condition, guard_action, denominator_zero_flag}`
- `derivation_trace.{numerator_*, denominator_*}`
- `derivation_summary`, `executive_summary`, `engineering_summary`
- `explainability_render`

Top-level provenance (`provenance_chain`) is carried through:
- `stream = PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01`
- `design_contract`, `architecture_ref`, `manifest_ref`
- `baseline_commit`, `lane_a_impact`

`derivation_context.canonical_topology_hash` is recorded on the payload
binding so adapter consumers can verify topology immutability.

---

## 6. API endpoints

### `GET /api/lens-payload?client=blueedge&run=run_blueedge_productized_01_fixed`

- 200 — JSON payload (`Content-Type: application/json; charset=utf-8`,
  `Cache-Control: no-store`)
- 400 — `INVALID_CLIENT_PARAM` / `INVALID_RUN_PARAM` (length, charset, traversal)
- 404 — `CLIENT_NOT_ALLOWED` / `RUN_NOT_ALLOWED`
- 424 — `REQUIRED_ARTIFACT_MISSING` (with `detail`)
- 500 — `RESOLVER_INTERNAL` / `PAYLOAD_NOT_OK`

### `GET /api/report-pack?client=...&run=...&artifact=...`

Allowed artifacts: `decision-surface`, `tier1-narrative`, `tier1-evidence`,
`tier2-diagnostic`. Streams the canonical static HTML report with
`Content-Type: text/html; charset=utf-8`.

- 400 — `INVALID_*_PARAM`
- 404 — `CLIENT_NOT_ALLOWED` / `RUN_NOT_ALLOWED` / `ARTIFACT_PATH_UNRESOLVED` /
  `ARTIFACT_NOT_GENERATED`
- 500 — `ARTIFACT_READ_FAILED`

---

## 7. Page binding (lens-v2-flagship.js)

`getServerSideProps` calls `resolveBlueEdgePayload(LIVE_BINDING_CLIENT,
LIVE_BINDING_RUN)`. The fixture import was removed. Three states are now
visible to the user:

1. **Live banner** — `LIVE SUBSTRATE · BlueEdge productized ·
   run_blueedge_productized_01_fixed · baseline 93098cb · INFERENCE
   PROHIBITION: BINDING PENDING`
2. **Operational posture** — `EXECUTIVE READY — QUALIFIED` with
   `QUALIFIER Q-01` chip
3. **Failure state** — `LIVE_BINDING_FAILED` (no fixture fallback)

Density toggles (`BALANCED`, `DENSE`, `INVESTIGATION`, `BOARDROOM`) all
operate on the live payload; no toggle re-introduces fixture data.

---

## 8. Governance compliance

- `topology_always_read_only`: enforced (resolver never writes; topology
  hashes preserved)
- `qualifier_never_suppressed`: Q-01 chip + qualifier_note rendered in all
  density classes (verified by smoke and live-binding test suites)
- `blocked_state_never_softened`: `LIVE_BINDING_FAILED` is a visible
  failure state, not a fallback
- `evidence_references_always_preserved`: DPSIG `derivation_trace`,
  `provenance_chain`, and source_artifact paths surfaced on the payload
- `no_ai_calls`, `no_prompt_surfaces`, `no_chatbot_ux`,
  `no_animated_propagation`: confirmed unchanged from fixture path
- `VAL-GOV-02` forbidden identifiers: narrative scrubbed of `DPSIG` /
  `signal_value` references; technical lineage carried in
  `dpsig_signal_summary`, not narrative copy
- `VAL-EXPLAIN-01`: 7-panel explainability bundle (`why_panel`,
  `evidence_panel`, `trace_panel`, `qualifiers_panel`, `lineage_panel`,
  `confidence_panel`, `readiness_state_panel`) built from the live payload
- `VAL-SCHEMA-01`: `module_registry` populated with one
  `MOD-LIVE-RUN_BLUEEDGE_PRODUCTIZED_01_FIXED` entry referencing the
  canonical topology hash

---

## 9. Evidence-to-output traceability

Every executive surface anchor maps back to an artifact:

| Surface element                  | Source artifact                                          |
|----------------------------------|----------------------------------------------------------|
| Score / band / posture           | `semantic/decision/decision_validation.json`             |
| 17 domains / 4 backed / 12 SO    | `semantic/topology/semantic_topology_model.json`          |
| Cluster pressure anchor          | `artifacts/dpsig/.../dpsig_signal_set.json`              |
| Reproducibility verdict          | `semantic/report_inputs/reproducibility_verdict.json`     |
| Domain business labels           | `semantic/crosswalk/semantic_continuity_crosswalk.json`   |
| Canonical topology hash          | `structure/40.4/canonical_topology.json`                  |
| Static HTML reports              | `reporting/report_pack/*.html` (via `/api/report-pack`)   |

---

## 10. Visual evidence

Captured at viewport `1440×900` against `http://localhost:3002/lens-v2-flagship`
under live binding (zero console errors):

- `screenshots/balanced_1440x900_live.png`
- `screenshots/dense_1440x900_live.png`
- `screenshots/investigation_1440x900_live.png`
- `screenshots/boardroom_1440x900_live.png`
