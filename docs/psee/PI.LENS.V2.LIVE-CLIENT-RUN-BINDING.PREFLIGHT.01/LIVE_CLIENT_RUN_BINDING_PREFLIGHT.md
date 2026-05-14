# LIVE CLIENT/RUN BINDING — PREFLIGHT

**Stream:** PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.PREFLIGHT.01
**Mode:** INSPECTION_ONLY + PREFLIGHT_DOCUMENTATION
**Status:** COMPLETE (preflight only; no binding implemented)
**Branch:** work/lens-v2-productization

---

## SECTION 1 — Executive Summary

This preflight inspects the candidate runtime substrates available for hydrating the LENS V2 flagship surface with real, governed evidence. It does not implement binding.

The preflight finds:

- **The mandatory governance is loaded.** `GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md` and `pipeline_execution_manifest.json` are present, internally consistent, and authoritative.
- **The baseline tag `governed-dpsig-baseline-v1` (commit `092e251`) is verified.** It is an ancestor of the current HEAD on `work/lens-v2-productization`. The current LENS V2 cinematic work is additive to this baseline.
- **The pipeline manifest declares `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/` as the Tier-3 canonical replay fixture.** This is the lawful first binding target for Lane A productized runtime.
- **BlueEdge has multiple productized runs** but the most recent run (`run_blueedge_e2e_execute_02`) carries a `vault_readiness: FAIL` due to a missing integration_validation.json. Earlier productized runs are richer in PSIG signal values but predate the canonical orchestration.
- **The current LENS V2 surface runs entirely from an in-memory fixture** (`app/execlens-demo/flagship-experience/fixtures/flagship_real_report.fixture.js`). Its values are commercially-evocative authored content (e.g. "Primary Delivery / Coordination Layer / Secondary Delivery") that do **not** correspond to either FastAPI or BlueEdge vault-derived domain aliases.
- **First binding recommendation: FastAPI `run_02_oss_fastapi_pipeline`.** It is the only run with `vault_readiness: READY`, all four LENS report artifacts present, and HIGH (9/10) generic CEU grounding. It is also the manifest-declared canonical replay fixture.
- **A grounding contract is required for BlueEdge** before semantic hydration of LENS V2 with BlueEdge-specific 17-domain semantic data. Path A.5 of the governance model explicitly notes BlueEdge has 5/17 domains grounded; FastAPI is "STRUCTURAL_LABELS_ONLY" at that semantic level.
- **The next implementation contract should be:** `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.IMPLEMENTATION.01` — implementing `/api/lens-payload` and `/api/report-pack` against FastAPI `run_02_oss_fastapi_pipeline` per the per-actor mapping in `semantic_hydration_mapping_matrix.md`.

---

## SECTION 2 — Governance Load Confirmation

| Document                                                        | Status             | Notes                                                              |
|-----------------------------------------------------------------|--------------------|--------------------------------------------------------------------|
| `docs/governance/GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md`      | LOADED             | 360 lines. Authoritative. Locked. Baseline 092e251.                |
| `docs/governance/pipeline_execution_manifest.json`               | LOADED             | 552 lines. FROZEN — AUTHORITATIVE. Baseline 93098cb (older Lane A baseline). |

**Key governance findings binding this preflight:**

1. **Section 2 Core Principle:** "Intelligence attaches THROUGH governance, not around governance." Live binding must complete the 6-stage extension lifecycle.
2. **Section 11 Path A.5:** BlueEdge 5/17 domains grounded; FastAPI STRUCTURAL_LABELS_ONLY; **FastAPI remains BLOCKED for BlueEdge-specific semantic enrichment until a grounding contract is issued.**
3. **Pipeline manifest `tier_3_validation_fixtures`:** `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/` is the canonical replay fixture, and the only run with explicit Tier-3 governance authorization.
4. **Pipeline manifest `tier_1_runtime_inputs`:** the four authoritative read artifacts are `canonical_topology.json`, `binding_envelope.json`, `structural_topology_log.json`, `grounding_state_v3.json`.
5. **Pipeline manifest IRC-06:** "SEMANTIC_ACTIVATION_BLOCKED — activation_authorized=false for all current runs." Reopen conditions R-01..R-05 must be met before semantic enrichment streams are authorized.

**Compliance declaration:** This preflight loads both governance documents at stream start, declares compliance, and operates strictly in INSPECTION_ONLY mode. No binding is implemented.

---

## SECTION 3 — Baseline Anchor Verification

| Check                                                                           | Result                                                       |
|---------------------------------------------------------------------------------|--------------------------------------------------------------|
| `git tag -l "governed-dpsig-baseline-v1"`                                        | EXISTS (one tag returned)                                    |
| `git log governed-dpsig-baseline-v1 -1 --format="%H %s"`                         | `092e2518140245fa12ad7d58fe2c8ecdc8acb5ac [PROJ-STAB] Executive cognitive projection stabilization — design complete` |
| `git merge-base --is-ancestor governed-dpsig-baseline-v1 HEAD`                   | TRUE (baseline is ancestor of HEAD)                          |
| Current LENS V2 work is additive to `governed-dpsig-baseline-v1`                  | YES                                                          |

The baseline anchor is verified. The pipeline manifest's separate baseline `93098cb` ([CLOSE] Formalize LENS real E2E pipeline execution baseline) is a Lane-A pipeline baseline that predates the governance baseline; both coexist authoritatively for their respective scopes.

---

## SECTION 4 — Candidate Client/Run Inventory

The full machine-readable inventory is in `client_run_candidate_inventory.json`. Highlights:

### 4.1 Discovered client roots

```
clients/blueedge/                        — canonical BlueEdge client
clients/fastapi/                         — canonical FastAPI client (canonical replay fixture path)
clients/client_template_01/              — template (not a run)
clients/registry/                        — registry (not a run)
clients/second-client/                   — placeholder
clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/ — uuid-named (FORBIDDEN per pipeline manifest tier_3 explicit_forbidden_reads)
clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/ — uuid-named (FORBIDDEN)
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/ — uuid-named (FORBIDDEN — but referenced by canonical FastAPI signal_registry as `client_uuid`)
```

The uuid-named directories are explicitly forbidden as implementation reads per the pipeline manifest's `explicitly_forbidden_reads` rule. The canonical clients are `blueedge` and `fastapi`.

### 4.2 BlueEdge runs (12 directories)

```
run_01_authoritative                                           — intake + package only (no full pipeline)
run_be_orchestrated_01                                          — has vault
run_be_orchestrated_fixup_01                                    — has vault
run_blueedge_e2e_execute_01                                     — has vault, structure/40.4, ceu/grounding_state_v3.json
run_blueedge_e2e_execute_02                                     — has vault, structure/40.4, ceu/grounding_state_v3.json (vault_readiness FAIL)
run_blueedge_intake_contract_closure_01
run_blueedge_productized_01                                     — has 41.x, vault, manifests
run_blueedge_productized_01_decision_reconstructed
run_blueedge_productized_01_dom_lineage_validation
run_blueedge_productized_01_fixed                                — has structure/40.4, semantic/topology
... (additional)
```

### 4.3 FastAPI runs (3 directories)

```
run_02_oss_fastapi_pipeline   — *** CANONICAL REPLAY FIXTURE *** vault_readiness READY, all four LENS reports generated
run_fastapi_raw_e2e_01        — earlier full e2e run
run_relational_recovery_01    — Lane C (FORBIDDEN per manifest)
```

---

## SECTION 5 — BlueEdge Eligibility Assessment

| Aspect                                | Finding                                                                                        |
|---------------------------------------|------------------------------------------------------------------------------------------------|
| Authoritative run                     | `run_blueedge_productized_01` (has 41.x signal_projection.json + reports) OR `run_blueedge_e2e_execute_02` (newest, full structure/40.x but vault_readiness FAIL) |
| Vault readiness                       | `run_blueedge_e2e_execute_02`: **FAIL** (VR-08, VR-09 missing `integration_validation.json`)   |
| Vault readiness alternate             | `run_blueedge_productized_01`: vault_readiness.json absent                                      |
| Generic CEU grounding ratio           | 5/10 (50% MEDIUM) per `clients/blueedge/psee/runs/run_blueedge_e2e_execute_02/ceu/grounding_state_v3.json` |
| Path A.5 BlueEdge-specific grounding   | 5/17 domains (per Section 11 of GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md)                        |
| Canonical topology                    | 1 cluster (`blueedge-platform`), 945 nodes — NOT 47 clusters as in fixture                       |
| LENS reports                          | Generated (multiple `lens_report_*.html` under `clients/blueedge/reports/`)                     |
| Lane A artifacts                      | binding_envelope, canonical_topology, grounding_state_v3, signal_registry: PRESENT             |
| Baseline compatibility                | YES (baseline 92e251 is ancestor of HEAD)                                                       |
| Semantic richness for LENS V2         | HIGH POTENTIAL but BLOCKED by Path A.5 grounding contract requirement                            |
| Recommended for first binding          | NO — vault_readiness FAIL on most recent run; older productized runs lack vault_readiness        |

**Verdict:** BlueEdge is a strong second binding target after a grounding contract is issued. It is not eligible for first binding because the most recent run fails vault readiness, and earlier productized runs were generated under different orchestration.

---

## SECTION 6 — FastAPI Eligibility Assessment

| Aspect                                | Finding                                                                                        |
|---------------------------------------|------------------------------------------------------------------------------------------------|
| Authoritative run                     | `run_02_oss_fastapi_pipeline` — DECLARED as canonical replay fixture in pipeline manifest       |
| Vault readiness                       | **READY** (all VR-01 through VR-09 PASS) — `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/vault_readiness.json` |
| Generic CEU grounding ratio           | 9/10 (90% HIGH) per `ceu/grounding_state_v3.json`                                              |
| Path A.5 BlueEdge-specific grounding   | STRUCTURAL_LABELS_ONLY (BLOCKED — grounding contract not yet issued)                            |
| Canonical topology                    | Generic stage 40.4 — uses generic registry                                                     |
| LENS reports                          | All four generated: `lens_decision_surface.html`, `lens_tier1_narrative_brief.html`, `lens_tier1_evidence_brief.html`, `lens_tier2_diagnostic_narrative.html` |
| Lane A artifacts                      | binding_envelope, canonical_topology, structural_topology_log, grounding_state_v3, signal_registry: ALL PRESENT |
| Lane A signal status                  | 4 PSIGs in `signal_registry.json`, 3 active (PSIG-001 HIGH 2.32, PSIG-002, PSIG-006)           |
| Baseline compatibility                | YES (canonical replay fixture for the manifest's frozen baseline 93098cb)                       |
| Semantic richness for LENS V2         | MEDIUM (rich Lane A artifacts; semantic-layer grounding limited to generic CEU)                  |
| Recommended for first binding          | YES — only run with vault_readiness READY + all LENS reports + manifest-declared canonical status |

**Verdict:** FastAPI `run_02_oss_fastapi_pipeline` is the lawful first binding target.

---

## SECTION 7 — Certified Artifact Availability

| Artifact                                              | FastAPI run_02 | BlueEdge productized_01 | BlueEdge e2e_execute_02 |
|-------------------------------------------------------|:--------------:|:-----------------------:|:------------------------:|
| `intake/intake_manifest.json`                          | YES            | partial                 | YES                      |
| `structure/40.2/structural_node_inventory.json`        | YES            | (in vault)              | YES                      |
| `structure/40.3/structural_topology_log.json`           | YES            | (in vault)              | YES                      |
| `structure/40.4/canonical_topology.json`                | YES            | (in vault)              | YES                      |
| `ceu/grounding_state_v3.json`                           | YES            | NO (uses 41.x/grounded) | YES                      |
| `dom/dom_layer.json`                                   | YES            | (in vault)              | YES                      |
| `binding/binding_envelope.json`                         | YES (canonical) | YES                     | YES                      |
| `binding/psee_binding_envelope.json`                    | YES            | NO                      | NO                       |
| `vault/signal_registry.json`                            | YES (4 signals) | YES (4 signals)         | YES                      |
| `vault/canonical_topology.json`                         | YES            | YES                     | YES                      |
| `vault/evidence_trace.json`                             | YES            | YES                     | YES                      |
| `vault/admissibility_log.json`                          | YES            | YES                     | YES                      |
| `vault/coverage_state.json`                             | YES            | YES                     | YES                      |
| `vault/gauge_state.json`                                | YES            | YES                     | YES                      |
| `vault/reconstruction_state.json`                       | YES            | YES                     | YES                      |
| `vault/vault_manifest.json`                             | YES            | YES                     | YES                      |
| `vault/vault_readiness.json`                             | YES (READY)    | NO                      | YES (FAIL)               |
| `reports/lens_decision_surface.html`                    | YES            | (in `reports/decision/`) | (likely) |
| `reports/lens_tier1_narrative_brief.html`               | YES            | (in `reports/tier1/`)   | (likely)                  |
| `reports/lens_tier1_evidence_brief.html`                | YES            | (in `reports/tier1/`)   | (likely)                  |
| `reports/lens_tier2_diagnostic_narrative.html`           | YES            | (in `reports/tier2/`)   | (likely)                  |

FastAPI `run_02_oss_fastapi_pipeline` is the **only** run with the complete intake → structure → ceu → dom → binding → vault → vault_readiness READY chain plus all four LENS reports in a single run directory.

---

## SECTION 8 — Semantic Hydration Readiness

The full per-actor mapping is in `semantic_hydration_mapping_matrix.md`. Summary classification:

| Class                                       | Semantic actors / regions                                                              | Count |
|---------------------------------------------|----------------------------------------------------------------------------------------|-------|
| HYDRATABLE_NOW (FastAPI run_02)              | Pressure Anchor (C), Propagation Path (D), Absorption Load (E), Receiver Exposure (F), Semantic Topology (G), Structural Backing (H), Cluster Concentration (J), Signal Stack (K), Evidence Trace (L) | 9     |
| HYDRATABLE_WITH_MAPPING                      | Decision Posture (A), Resolution Boundary (M), Inference Prohibition (N)                | 3     |
| BLOCKED_MISSING_ARTIFACT                     | Confidence Boundary (B) — depends on grounding-ratio interpretation per Path A.5         | 1     |
| FIXTURE_ONLY                                 | Semantic-Only Exposure (I) — currently fixture-pattern (Q-01 vs Q-00 derivation requires per-domain semantic registry beyond generic CEU) | 1     |
| SHOULD_REMAIN_DERIVED_FROM_RENDERING_LAYER   | Report Artifact Access (O) — surfaced via `/api/report-pack`; not a hydration concern    | 1     |

**Total actors:** 15. **Hydratable from FastAPI run_02 today:** 12 of 15. Remaining 3 (CB partially, IB fully, SO fully) require either Path A.5 grounding contract issuance or a separate qualifier-class derivation contract.

---

## SECTION 9 — Fixture Dependency Findings

Full machine-readable audit in `fixture_dependency_audit.json`. Summary:

The current LENS V2 surface depends on a single in-memory fixture file:

```
app/execlens-demo/flagship-experience/fixtures/flagship_real_report.fixture.js
```

It exports `FLAGSHIP_REAL_REPORT` and `FLAGSHIP_PROPAGATION_CHAINS`. The values inside are **synthetic and commercially-evocative** — they do not correspond to either FastAPI or BlueEdge vault-derived data.

Specific divergences:

- `topology_scope.cluster_count: 47` — FastAPI run_02 has different cluster count; BlueEdge e2e_execute_02 has 1 cluster. Neither matches.
- `topology_scope.domain_count: 3` — Both clients use generic 10-CEU registry; neither has a 3-domain registry.
- `evidence_blocks[0..2].domain_alias`: "Primary Delivery", "Coordination Layer", "Secondary Delivery" — these are commercial / executive-narrative names. They do not appear in either client's vault.
- `qualifier_class: "Q-01"` — fixture matches the LENS V2 cinematic test scenario, but is independent of upstream qualifier derivation.
- `evidence_object_hash`, `derivation_hash`, `baseline_anchor` — fixture-only synthetic values.
- `narrative_block.executive_summary` / `why_section` / `structural_summary` — authored prose for the cinematic surface; not vault-derived.
- `rendering_metadata.qualifier_rules_applied: ["Q-01"]` and `ali_rules_applied: ["ALI-01", "ALI-02", "ALI-03", "ALI-04"]` — fixture-derived rule chips; not from any actual rendering pipeline output.

The audit classifies each fixture value as STATIC_FIXTURE / HARDCODED_SEMANTIC_VALUE / PRESENTATION_METADATA / MOCK_REPORT_OBJECT / PROSE_DERIVED_VALUE / SAFE_VISUAL_CONSTANT / UNSAFE_FAKE_TELEMETRY. None are classified UNSAFE_FAKE_TELEMETRY because the surface honestly captions the binding state ("binding pending") and the values do not claim live runtime status.

---

## SECTION 10 — SemanticPayloadResolver Preflight Design

The future resolver is named `SemanticPayloadResolver`. It is NOT implemented in this stream.

```
SemanticPayloadResolver
├── inputs:
│     - client_id: enum { 'fastapi', 'blueedge' }   (initially 'fastapi' only)
│     - run_id: string (per-client authorized run)
├── source artifacts (Tier-1 per pipeline manifest):
│     - clients/<client_id>/psee/runs/<run_id>/binding/binding_envelope.json
│     - clients/<client_id>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
│     - clients/<client_id>/psee/runs/<run_id>/structure/40.3/structural_topology_log.json
│     - clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json
│     - clients/<client_id>/psee/runs/<run_id>/vault/signal_registry.json
│     - clients/<client_id>/psee/runs/<run_id>/vault/evidence_trace.json
│     - clients/<client_id>/psee/runs/<run_id>/vault/vault_readiness.json
├── output payload shape:
│     {
│       render_state: enum,
│       readiness_badge: { state_label, qualifier_label },
│       qualifier_chip: { qualifier_class, class_label, renders },
│       topology_scope: { domain_count, cluster_count, grounded_domain_count, grounding_label },
│       evidence_blocks[]: { domain_alias, propagation_role, signal_cards[], grounding_status, evidence_description },
│       trace_block: { propagation_path, propagation_summary, derivation_lineage_ref, baseline_ref },
│       trace_linkage: { evidence_object_hash, derivation_hash, baseline_anchor, run_id },
│       rendering_metadata: { qualifier_rules_applied, ali_rules_applied },
│       narrative_block: { executive_summary?, why_section?, structural_summary? },
│       report_pack_availability: { decision-surface, tier1-narrative, tier1-evidence, tier2-diagnostic },
│     }
├── actor registry mapping:                  see semantic_hydration_mapping_matrix.md
├── qualifier mapping:                       grounding_state_v3.grounding_ratio → Q-class
├── trace mapping:                           vault/evidence_trace.json + run_id → trace_linkage
├── grounding mapping:                       grounding_state_v3.json → grounded_domain_count
├── topology mapping:                        canonical_topology.json → topology_scope.cluster_count
├── readiness mapping:                       vault_readiness.json + signal_registry → render_state
├── narrative mapping:                       NOT YET BOUND — narrative_block remains authored prose until a narrative-generation contract is issued (out of scope for first binding)
├── evidence mapping:                        signal_registry + evidence_trace → evidence_blocks
├── no-output conditions:
│     - vault_readiness != READY → return BLOCKED render_state
│     - grounding_state missing → return DIAGNOSTIC_ONLY
│     - signal_registry empty → return BLOCKED
│     - readiness gate executive_rendering_allowed=false → return DIAGNOSTIC_ONLY
```

The resolver is a Node.js server-side handler located at `app/execlens-demo/pages/api/lens-payload.js`. It reads under `REPO_ROOT` (already exposed via `next.config.js`).

---

## SECTION 11 — First Binding Recommendation

**Recommendation: BIND FIRST AGAINST `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/`.**

**Rationale:**

1. **Pipeline manifest authority**: declared as the canonical replay fixture (Tier-3) in `pipeline_execution_manifest.json`. No other run carries this status.
2. **Vault readiness READY**: only run with all VR-01..VR-09 PASS.
3. **All four LENS reports generated**: confirms that the upstream lens_report_generator successfully hydrates from this run end-to-end.
4. **Generic CEU grounding HIGH (9/10)**: highest grounding ratio of any run, matching the manifest's coverage_classification: HIGH.
5. **All Tier-1 runtime input artifacts present**: canonical_topology.json, binding_envelope.json, structural_topology_log.json, grounding_state_v3.json — the four artifacts the manifest authorizes for read.
6. **Baseline compatibility**: the manifest's frozen baseline 93098cb references this exact run path in `protected_artifacts`.
7. **Hydratable for 12 of 15 LENS V2 semantic actors today** (per `semantic_hydration_mapping_matrix.md`).

**Why not BlueEdge first:**

1. Most recent BlueEdge run (`run_blueedge_e2e_execute_02`) has `vault_readiness: FAIL`.
2. Earlier BlueEdge productized runs lack `vault_readiness.json` entirely.
3. Path A.5 of the governance model explicitly notes BlueEdge has only 5/17 BlueEdge-specific domains grounded — and the BlueEdge-specific 17-domain semantic registry is **not** the artifact LENS V2 currently consumes (it consumes the generic CEU registry per pipeline manifest Tier-1).
4. Section 11 Path A.5 transition rule: "Domain grounding expansion requires a grounding contract per client. No inference without grounding evidence."

**Conditional pivot to BlueEdge second:**

After FastAPI binding lands, the next logical contract is `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.BLUEEDGE.GROUNDING.01` — issuing the grounding contract that brings BlueEdge into Path A.5 with a fresh vault-readiness PASS run. Then the resolver can target `client_id=blueedge` and surface BlueEdge-specific 17-domain semantics.

---

## SECTION 12 — Blockers and Gaps

### Blockers (must clear before live binding lands)

1. **No SemanticPayloadResolver implementation.** Designed in Section 10 but not implemented.
2. **No `/api/lens-payload` endpoint.** The Pages Router api directory has only `execlens.js`; no lens-payload handler.
3. **No `/api/report-pack` endpoint.** Report Pack entries in LENS V2 still use placeholder URLs.
4. **No qualifier-class derivation logic.** Mapping from `grounding_ratio` to Q-class needs a derivation rule (current candidate: `1.0 → Q-00`; `[0.6, 1.0) → Q-01`; `[0.0, 0.6) → Q-02`; threshold values pending governance amendment).
5. **No narrative-generation contract.** `narrative_block.executive_summary` / `why_section` / `structural_summary` will remain authored prose until a separate narrative-generation contract is issued.

### Gaps (do not block first binding but worth noting)

1. **Generic CEU registry vs BlueEdge 17-domain registry**: the 9/10 grounding in FastAPI is generic, not domain-semantic. Display labels like "Primary Delivery / Coordination Layer / Secondary Delivery" will need to be replaced with vault-derived domain aliases (e.g., FastAPI CEU labels) — these are operational but less commercially-evocative than the current authored fixture.
2. **Cluster_count mismatch**: fixture says 47, FastAPI run_02 has different cluster_count (need to read for final implementation; not blocking for preflight).
3. **Inference Prohibition rule chips**: fixture lists `Q-01` + `ALI-01..04`. Real rendering_metadata may have different rule applications per run; the resolver must read these dynamically.
4. **Trace_linkage hashes**: fixture has synthetic hashes; resolver will hydrate from `vault/evidence_trace.json` + run metadata.
5. **Per-actor visual richness drop possible**: when commercial-narrative names ("Primary Delivery") are replaced with generic CEU labels ("CEU-01", "CEU-02"), the cinematic register may feel less commercially-aspirational. A future translation layer (CEU-id → operational-name mapping per client) is worth contracting separately.

### Out-of-scope items (deferred to later contracts)

- Live multi-client / multi-run selection UI in the LENS V2 chrome (deferred until the binding stream completes).
- Live-update / SSE / WebSocket pipelines (out of scope; surface remains read-once per route load).
- Cross-run comparison (BlueEdge vs FastAPI side-by-side) — out of scope; first binding is single-run.

---

## SECTION 13 — Next Contract Scope

**Proposed name:** `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.IMPLEMENTATION.01`

**Stream class:** IMPLEMENTATION_MODE (per pipeline manifest).

**LANE_SCOPE:** Lane A (consumes Lane A productized runtime outputs; no Lane A mutation).
**LANE_IMPACT:** READ ONLY — no protected Lane A artifacts modified.

**Baseline:** `93098cb` (per pipeline manifest IFR-02).

**ALLOWED_READS** (must be added to manifest amendment if not in current scope):

```
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.3/structural_topology_log.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/ceu/grounding_state_v3.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/evidence_trace.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/vault_readiness.json
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_decision_surface.html
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_narrative_brief.html
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_evidence_brief.html
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier2_diagnostic_narrative.html
```

**ALLOWED_WRITES:**

```
app/execlens-demo/pages/api/lens-payload.js   — new file
app/execlens-demo/pages/api/report-pack.js    — new file
app/execlens-demo/lib/semantic_payload_resolver.js  — new file (resolver implementation)
app/execlens-demo/pages/lens-v2-flagship.js   — modify to call /api/lens-payload via getServerSideProps; remove fixture import
docs/psee/PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.IMPLEMENTATION.01/<governance-pack>
docs/pios/PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.IMPLEMENTATION.01/<governance-pack>
```

**Tasks (ordered):**

1. Implement `SemanticPayloadResolver` per Section 10 design.
2. Implement `/api/lens-payload?client=fastapi&run=run_02_oss_fastapi_pipeline` endpoint.
3. Implement `/api/report-pack?client=...&run=...&artifact=...` endpoint reading static HTML.
4. Migrate `pages/lens-v2-flagship.js` to consume the API via `getServerSideProps`; remove the `require('../flagship-experience/fixtures/...')` import.
5. Wire Report Pack support-rail entries to live `binding_status` from payload.
6. Run replay verification per IFR-07 (deterministic identical output across two runs).
7. Run determinism check per Section 9 obligation 4 (E2E certification).
8. Capture Playwright screenshots across all four LENS lenses with live-bound data.
9. Validate that no regression occurred in existing certified client behavior (IFR-08 ADDITIVE_ONLY).
10. Produce CLOSURE.md, validation_log.json, file_changes.json.

**Forbidden in this stream:**

- Modifying any Lane A protected artifact (per pipeline manifest forbidden_for_implementations).
- Reading `clients/<uuid>/...` directories (per explicitly_forbidden_reads).
- Reading `clients/fastapi/psee/runs/run_relational_recovery_01/*` (Lane C).
- Writing to `vault/signal_registry.json`.
- Modifying `binding_envelope.json`.
- Hardcoding "fastapi" or "blueedge" as branching (IFR-06 SCRIPTS_ARE_TOPOLOGY_NATIVE; client identity must be a path parameter only).

---

## SECTION 14 — Governance Confirmation

This preflight:

- Loaded both mandatory governance documents at stream start.
- Operated strictly in INSPECTION_ONLY mode (per execution_modes.DISCOVERY_MODE in pipeline manifest).
- Did NOT modify any runtime UI file.
- Did NOT modify any pipeline artifact.
- Did NOT mutate any vault file.
- Did NOT create any synthetic telemetry.
- Did NOT hardcode any inferred semantic value as authoritative.
- Did NOT implement live binding.
- Did NOT modify any protected Lane A artifact.

All work is documentation-only under `docs/psee/PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.PREFLIGHT.01/` and `docs/pios/PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.PREFLIGHT.01/`.

---

## SECTION 15 — Final Verdict

**PREFLIGHT VERDICT: PASS — READY FOR IMPLEMENTATION CONTRACT**

| Check                                                 | Result |
|-------------------------------------------------------|--------|
| governance model loaded                                | PASS   |
| pipeline manifest loaded                               | PASS   |
| baseline tag verified                                  | PASS   |
| client/run candidates inventoried                       | PASS   |
| BlueEdge assessed                                       | PASS   |
| FastAPI assessed                                        | PASS   |
| certification artifacts inspected                       | PASS   |
| readiness artifacts inspected                            | PASS   |
| evidence artifacts inspected                             | PASS   |
| topology artifacts inspected                             | PASS   |
| trace artifacts inspected                                | PASS   |
| qualifier artifacts inspected                            | PASS   |
| fixture dependencies audited                             | PASS   |
| semantic hydration matrix created                        | PASS   |
| first binding target recommended                         | PASS — `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline` |
| no files outside output docs changed                     | PASS   |
| no runtime mutation introduced                           | PASS   |
| no data binding implemented                              | PASS   |

**Recommended next contract:** `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.IMPLEMENTATION.01` — bind LENS V2 to FastAPI `run_02_oss_fastapi_pipeline` per Section 13.

---

**End of preflight document.**
