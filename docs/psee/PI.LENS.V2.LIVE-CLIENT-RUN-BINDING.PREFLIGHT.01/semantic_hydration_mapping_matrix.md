# SEMANTIC HYDRATION MAPPING MATRIX

**Stream:** PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.PREFLIGHT.01
**Scope:** Per-region mapping from real artifacts to LENS V2 semantic surface; no implementation.

Target run for first binding: **`clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/`**.

---

## 1. Per-region matrix

Hydration status legend:
- **HYDRATABLE_NOW** — direct mapping from a Tier-1 artifact in the canonical replay fixture; can bind today.
- **HYDRATABLE_WITH_MAPPING** — bindable but requires a derivation rule (e.g. grounding_ratio → Q-class).
- **BLOCKED_MISSING_ARTIFACT** — required artifact not yet generated for this client/run.
- **FIXTURE_ONLY** — currently fixture-only; cannot be replaced without a separate contract.
- **SHOULD_REMAIN_DERIVED_FROM_RENDERING_LAYER** — should remain authored / rendering-layer derived.

| LENS V2 region                                        | Current fixture/source                                                | Required live artifact (FastAPI run_02)                                        | Available | Mapping complexity | Governance risk | Hydration status                       | Notes                                                                                  |
|-------------------------------------------------------|-----------------------------------------------------------------------|--------------------------------------------------------------------------------|:---------:|--------------------|-----------------|-----------------------------------------|----------------------------------------------------------------------------------------|
| Readiness posture                                     | `header_block.readiness_badge.state_label` in fixture                  | `vault/vault_readiness.json` + readiness gate evaluation                        | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Map vault_readiness.status (READY/FAIL) + signal_registry to render_state               |
| Qualifier ribbon                                      | `qualifier_class: "Q-01"` in fixture                                   | `ceu/grounding_state_v3.json` (grounding_ratio) + qualifier derivation rule    | YES       | MEDIUM             | MEDIUM          | HYDRATABLE_WITH_MAPPING                  | Need governance rule: `grounding_ratio == 1.0 → Q-00`, `[0.6, 1.0) → Q-01`, `< 0.6 → Q-02`; current fastapi 0.9 → Q-01 |
| Executive declaration                                 | `narrative_block.executive_summary` (authored prose)                   | None (no live narrative source)                                                 | NO        | HIGH               | HIGH            | SHOULD_REMAIN_DERIVED_FROM_RENDERING_LAYER | Narrative-generation contract is out of scope for first binding; keep authored prose for now |
| Evidence substrate (per-domain evidence_blocks)        | `evidence_blocks[]` in fixture (3 fictional domains)                   | `vault/signal_registry.json` + `vault/evidence_trace.json` + `ceu/grounding_state_v3.json` | YES       | MEDIUM             | LOW             | HYDRATABLE_NOW                          | Map signals to evidence_blocks; use grounding_state_v3 for grounding_status per domain |
| Propagation field (PA / D / E / F)                    | `evidence_blocks[].propagation_role: ORIGIN/PASS_THROUGH/RECEIVER`     | `binding/binding_envelope.json` (nodes, edges) + signal_registry primary_entity | YES       | MEDIUM             | LOW             | HYDRATABLE_NOW                          | Each PSIG entry has `primary_entity`; use to identify ORIGIN/PASS-THROUGH/RECEIVER nodes |
| Topology field (G — Semantic Topology)                | `evidence_blocks[].domain_alias` (3 fictional)                         | `structure/40.4/canonical_topology.json` (clusters)                             | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | clusters[].name is the domain alias; clusters[].node_count gives weight                 |
| Topology field (H — Structural Backing)                | `grounding_status: Q-00` flag                                          | `ceu/grounding_state_v3.json` per CEU `grounded: true/false`                    | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | CEU mapping to clusters needed; available via `evidence_paths[]` join                  |
| Topology field (I — Semantic-Only Exposure)            | `grounding_status: Q-01` flag                                          | `ceu/grounding_state_v3.json` per CEU `grounded: false`                          | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Inverse of structural backing                                                            |
| Trace/lineage field (L — Evidence Trace)               | `trace_linkage.evidence_object_hash`/`derivation_hash`/`baseline_anchor`/`run_id` | `vault/evidence_trace.json` + `vault/vault_manifest.json` + `manifests/run_initialization_manifest.json` | YES | LOW | LOW | HYDRATABLE_NOW | Read evidence_trace + vault_manifest; concatenate to lineage chain |
| Confidence envelope (B — Confidence Boundary)         | `topology_scope.grounding_label: "Partial Coverage"` + percentage       | `ceu/grounding_state_v3.json.grounding_ratio` (0.9)                              | YES (partial) | MEDIUM | MEDIUM | HYDRATABLE_WITH_MAPPING | Boardroom Confidence Envelope ring uses `grounding_ratio`; UI rendering already derives ratio |
| Governance contour (N — Inference Prohibition)         | `rendering_metadata.qualifier_rules_applied/ali_rules_applied` (fixture) | rendering_metadata is currently fixture-only                                    | NO (per-run) | MEDIUM | LOW | BLOCKED_MISSING_ARTIFACT | The rendering pipeline does not yet write rendering_metadata to a vault artifact for direct read; this is a governance gap |
| Cluster Concentration (J)                             | `topology_scope.cluster_count: 47` (fixture)                            | `structure/40.4/canonical_topology.json.cluster_count`                          | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Direct read; FastAPI run_02 cluster count differs from fixture and must be honored      |
| Signal Stack (K — per-signal flat list)                | `evidence_blocks[].signal_cards[]` flattened                            | `vault/signal_registry.json.signals[]`                                          | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | signal_registry.signals[] is already flat; map directly                                  |
| Resolution Boundary (M)                                | Authored 3-cell grid (Known/Partial/Execution-not-yet-validated)        | `ceu/grounding_state_v3.json` (grounded vs ungrounded)                          | YES       | MEDIUM             | LOW             | HYDRATABLE_WITH_MAPPING                  | Known/Partial cells derived from grounding_state_v3; "execution-not-yet-validated" cell needs gate-evaluation source |
| Decision Posture (A)                                   | `header_block.readiness_badge.state_label` (fixture)                    | `vault_readiness.status` + readiness gate evaluation                            | YES       | LOW                | LOW             | HYDRATABLE_WITH_MAPPING                  | Posture is composed from readiness state + qualifier — both available                  |
| Pressure Anchor (C)                                    | `evidence_blocks[role=ORIGIN].domain_alias` + tier                       | `binding/binding_envelope.json` + `signal_registry.signals[role=ORIGIN]`        | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Origin domain identifiable via signal_registry primary_entity                           |
| Propagation Path (D)                                    | `trace_block.propagation_path` (fictional)                              | `vault/evidence_trace.json` + binding_envelope traversal                        | YES       | MEDIUM             | LOW             | HYDRATABLE_NOW                          | Construct path from binding_envelope edges where pressure flows through CEUs            |
| Absorption Load (E)                                     | "68%" (fixture-derived from narrative)                                  | Derivable from binding_envelope inbound_coupling at PASS-THROUGH node            | YES       | MEDIUM             | LOW             | HYDRATABLE_NOW                          | Pipeline manifest authorizes binding_envelope.json reads for fan-in/fan-out             |
| Receiver Exposure (F)                                   | `evidence_blocks[role=RECEIVER]`                                         | `signal_registry.signals[role=RECEIVER]`                                         | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Same mapping as Pressure Anchor but for RECEIVER role                                    |
| Investigation mode lineage (L)                          | Fixture trace_linkage hashes                                            | `vault/evidence_trace.json.evidence_object_hash` + `derivation_hash` + `vault_manifest.baseline_anchor` + `manifests/run_initialization_manifest.json.run_id` | YES | LOW | LOW | HYDRATABLE_NOW | Concatenate four artifact reads into the lineage chain |
| Boardroom mode confidence envelope                       | Fixture grounded_domain_count/domain_count ratio                         | `ceu/grounding_state_v3.json.grounding_ratio`                                    | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Direct read; conic-gradient already computes from ratio                                  |
| Dense mode topology + concentration                      | Fixture (3 domains, 47 clusters)                                         | canonical_topology.json (clusters) + grounding_state_v3 (CEUs)                  | YES       | LOW                | LOW             | HYDRATABLE_NOW                          | Per-cluster + per-CEU grounding state available                                          |
| Balanced mode posture + boundary                         | Fixture posture + grid                                                   | vault_readiness + grounding_state_v3                                             | YES       | MEDIUM             | LOW             | HYDRATABLE_WITH_MAPPING                  | Posture derived from vault_readiness; resolution boundary cells from grounding state    |

---

## 2. Per-actor classification summary

| Actor                                  | Code | Hydration status                       |
|----------------------------------------|------|-----------------------------------------|
| A · Decision Posture                    | DP   | HYDRATABLE_WITH_MAPPING                  |
| B · Confidence Boundary                 | CB   | HYDRATABLE_WITH_MAPPING                  |
| C · Pressure Anchor                     | PA   | HYDRATABLE_NOW                          |
| D · Propagation Path                    | PP   | HYDRATABLE_NOW                          |
| E · Absorption Load                     | AL   | HYDRATABLE_NOW                          |
| F · Receiver Exposure                    | RE   | HYDRATABLE_NOW                          |
| G · Semantic Topology                    | ST   | HYDRATABLE_NOW                          |
| H · Structural Backing                   | SB   | HYDRATABLE_NOW                          |
| I · Semantic-Only Exposure               | SO   | HYDRATABLE_NOW                          |
| J · Cluster Concentration                | CC   | HYDRATABLE_NOW                          |
| K · Signal Stack                         | SS   | HYDRATABLE_NOW                          |
| L · Evidence Trace                       | ET   | HYDRATABLE_NOW                          |
| M · Resolution Boundary                  | RB   | HYDRATABLE_WITH_MAPPING                  |
| N · Inference Prohibition                | IP   | BLOCKED_MISSING_ARTIFACT (per-run rendering_metadata not yet vault-written) |
| O · Report Artifact Access               | RA   | SHOULD_REMAIN_DERIVED_FROM_RENDERING_LAYER (handled by `/api/report-pack`) |

**Hydratable today (HYDRATABLE_NOW + HYDRATABLE_WITH_MAPPING):** 14 of 15 actors.
**Blocked:** 1 actor (Inference Prohibition · IP) — pending an upstream contract to write rendering_metadata to the vault.
**Should remain derived:** 1 actor (Report Artifact Access · RA) — handled separately via the `/api/report-pack` endpoint with future binding paths.

---

## 3. Required derivation rules (to be specified in implementation contract)

### 3.1 Grounding ratio → Qualifier class

The current LENS V2 fixture uses Q-01 for "Partial Grounding". A derivation rule must be specified:

| grounding_ratio range | qualifier_class | label                                     |
|-----------------------|-----------------|-------------------------------------------|
| `[1.0, 1.0]`          | Q-00            | Full Grounding                            |
| `[0.6, 1.0)`          | Q-01            | Partial Grounding · advisory bound        |
| `[0.0, 0.6)`          | Q-02            | Insufficient Grounding · diagnostic only  |

This rule must be ratified in a governance amendment before live qualifier derivation is enabled.

### 3.2 Vault readiness status → render_state

| vault_readiness.status | gate.executive_rendering_allowed | render_state                          |
|------------------------|----------------------------------|---------------------------------------|
| READY                  | true                             | EXECUTIVE_READY                       |
| READY                  | true (with qualifier)            | EXECUTIVE_READY_WITH_QUALIFIER        |
| READY                  | false                            | DIAGNOSTIC_ONLY                       |
| FAIL                   | (any)                            | BLOCKED                               |

The gate evaluation is the authoritative source for `executive_rendering_allowed` per pipeline manifest IRC-06.

### 3.3 CEU role inference

The `signal_registry.signals[*].primary_entity` field identifies the dominant CEU/cluster for each signal. Combined with `binding_envelope.edges[]`, the resolver can infer ORIGIN / PASS-THROUGH / RECEIVER roles per CEU. The exact algorithm needs specification in the implementation contract.

---

## 4. Risks and gaps

| Risk                                                              | Severity | Mitigation                                                                  |
|-------------------------------------------------------------------|:--------:|-----------------------------------------------------------------------------|
| Inference Prohibition (N) cannot be hydrated until rendering_metadata is vault-written | MEDIUM | Issue a separate contract to expose `rendering_metadata.qualifier_rules_applied` and `ali_rules_applied` as a per-run vault artifact |
| Grounding-ratio → Q-class derivation rule needs governance ratification | MEDIUM | Issue a governance amendment proposing the threshold values in §3.1; requires Path A.5 grounding contract |
| Domain aliases shift from "Primary Delivery / Coordination Layer / Secondary Delivery" to generic CEU labels (e.g. CEU-01) | LOW | Implementation contract should ship with a CEU-id → operational-name translation map per client |
| Cluster_count in fixture (47) does not match FastAPI run_02 actual count | LOW | Resolver reads canonical_topology.cluster_count; UI honors it directly |
| Narrative_block remains authored prose post-binding | LOW | Out of scope for first binding; future narrative-generation contract |

---

## 5. Authority

This matrix is authoritative for the per-actor mapping decisions. Any future binding implementation MUST consult this document and either (a) honor the mappings as specified, or (b) explicitly amend this document with rationale.

---

**End of semantic hydration mapping matrix.**
