# BLUEEDGE LENS V2 HYDRATION MATRIX

**Stream:** PI.LENS.V2.BLUEEDGE-PRODUCTIZED-BINDING-RECONCILIATION.01
**Target run:** `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed`
**DPSIG path:** `artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed`

---

## 1. Per-region matrix

Hydration status legend:
- **HYDRATABLE_NOW** — direct mapping; can bind today.
- **HYDRATABLE_WITH_LIGHT_MAPPING** — bindable with a derivation rule or lookup.
- **BLOCKED_MISSING_ARTIFACT** — required artifact not yet generated for this run.
- **PRESENTATION_ONLY** — handled by presentation layer (e.g. Report Pack).
- **FIXTURE_ONLY** — current fixture remains until separate contract issued.

| LENS V2 region                                 | Current fixture source                                                | BlueEdge live source                                                                                                  | Mapping complexity | Hydration status                       | Governance risk | Notes                                                                                  |
|------------------------------------------------|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------|-----------------------------------------|-----------------|----------------------------------------------------------------------------------------|
| Decision Posture (A · DP)                      | `header_block.readiness_badge.state_label` (fixture)                  | `semantic/decision/decision_validation.json` VF-01 (score=60, band=CONDITIONAL, posture=INVESTIGATE) + render-state derivation rule | LOW                | HYDRATABLE_NOW                          | LOW             | Decision validation directly verifies the posture. Render state derived from band + qualifier. |
| Confidence Boundary (B · CB)                    | `topology_scope.grounding_label: "Partial Coverage"` + percentage       | 17-domain registry: 5 backed / 12 semantic-only → ratio 5/17 = 0.294 (vs Path A.5 expected MEDIUM-LOW)                  | LOW                | HYDRATABLE_WITH_LIGHT_MAPPING            | MEDIUM          | Compute grounding_ratio from semantic_topology_model.json (count lineage_status=EXACT/STRONG vs total). Derivation rule needed. |
| Pressure Anchor (C · PA)                        | `evidence_blocks[role=ORIGIN].domain_alias` (fixture)                  | DPSIG signal_set + decision_validation VF-05 (PZ-001 anchored on "Platform Infrastructure and Data" / DOM-04)          | LOW                | HYDRATABLE_NOW                          | LOW             | DPSIG normalization_basis identifies max_cluster_id=DOM-09 backend_modules; decision validation surfaces zone anchor explicitly. |
| Propagation Path (D · PP)                       | `trace_block.propagation_path` (fictional)                              | DPSIG signal_set entries + canonical_topology.json (DOM cluster connections via 1937 edges)                            | MEDIUM             | HYDRATABLE_NOW                          | LOW             | Construct path from DPSIG signal severity flow + 13 DOM cluster relations. |
| Absorption Load (E · AL)                        | "68%" hard-coded                                                      | DPSIG-031 normalization_basis (max=6, mean_non_singleton=2.83, ratio=2.12) + cluster pressure index                     | MEDIUM             | HYDRATABLE_NOW                          | LOW             | The "absorption" semantic for BlueEdge maps to cluster pressure ratio relative to mean non-singleton. |
| Receiver Exposure (F · RE)                      | `evidence_blocks[role=RECEIVER]`                                         | semantic_topology_model.json domains with lineage_status=NONE / WEAK + low confidence                                   | LOW                | HYDRATABLE_NOW                          | LOW             | 12 semantic-only domains are receiver-exposed (advisory bound). |
| Semantic Topology (G · ST)                       | `evidence_blocks[].domain_alias` (3 fictional)                           | `semantic/topology/semantic_topology_model.json` — 17 DOMAIN entries with business_label                                 | LOW                | HYDRATABLE_NOW                          | LOW             | Direct: 17 domains rendered as semantic neighborhood with business labels. |
| Structural Backing (H · SB)                      | `grounding_status: Q-00` flag (fixture)                                  | 17-domain registry: lineage_status=EXACT (5 of 17 — DOMAIN-01, DOMAIN-16, plus 3 others)                                | LOW                | HYDRATABLE_NOW                          | LOW             | Domains with lineage_status=EXACT are structurally backed. |
| Semantic-Only Exposure (I · SO)                   | `grounding_status: Q-01` flag (fixture)                                  | 17-domain registry: lineage_status=NONE / WEAK (12 of 17)                                                                | LOW                | HYDRATABLE_NOW                          | LOW             | Inverse of structural backing. |
| Cluster Concentration (J · CC)                    | `topology_scope.cluster_count: 47` (fixture)                              | 17-domain registry: 5 clusters (CLU-01..CLU-05) + DPSIG-031 normalization_basis (13 total clusters, 12 non-singleton)    | LOW                | HYDRATABLE_NOW                          | LOW             | Surface cluster_count + grounded_ratio + dominant cluster (DOM-09 backend_modules with 6 nodes). |
| Signal Stack (K · SS)                              | `evidence_blocks[].signal_cards[]` flattened (fixture)                   | DPSIG signal_set + decision_validation VF-07 (PSIG-001/002/004 active, PSIG-003/005 not activated, PSIG-006 baseline)    | LOW                | HYDRATABLE_NOW                          | LOW             | DPSIG-031 ELEVATED + 3 PSIGs active; full per-signal display via DPSIG signal_set entries. |
| Evidence Trace (L · ET)                           | `trace_linkage.evidence_object_hash`/`derivation_hash` (synthetic)        | DPSIG signal_set: canonical_topology_hash + topology_snapshot_hash + derivation_summary; report-input reproducibility verdict | LOW                | HYDRATABLE_WITH_LIGHT_MAPPING            | LOW             | Compose lineage chain from DPSIG hashes + reproducibility_verdict + semantic_continuity_crosswalk. |
| Resolution Boundary (M · RB)                       | Authored 3-cell grid (Known/Partial/Execution-not-yet-validated)           | `semantic/decision/decision_validation.json` 8 VF checks + decision_cross_report_alignment                              | MEDIUM             | HYDRATABLE_NOW                          | LOW             | Decision validation explicitly classifies known / partial / unvalidated. |
| Inference Prohibition (N · IP)                     | `rendering_metadata.qualifier_rules_applied/ali_rules_applied` (fixture)   | NOT YET WRITTEN — rendering_metadata not exposed as a vault artifact for any run                                          | HIGH               | BLOCKED_MISSING_ARTIFACT                 | MEDIUM          | Same blocker as in earlier preflight. Pending an upstream contract to vault-write rendering_metadata. First binding can ship with placeholder rule chips and a 'pending' caption for IP only. |
| Report Artifact Access (O · RA)                    | `REPORT_PACK_ARTIFACTS` registry (presentation)                          | `reports/lens_*.html` + `reports/publish/lens_*_pub.html` served via `/api/report-pack`                                   | LOW                | PRESENTATION_ONLY                        | LOW             | Handled by `/api/report-pack` endpoint. |

---

## 2. Per-actor classification summary

| Actor                                  | Code | Hydration status                         |
|----------------------------------------|------|-------------------------------------------|
| A · Decision Posture                    | DP   | HYDRATABLE_NOW                            |
| B · Confidence Boundary                 | CB   | HYDRATABLE_WITH_LIGHT_MAPPING              |
| C · Pressure Anchor                     | PA   | HYDRATABLE_NOW                            |
| D · Propagation Path                    | PP   | HYDRATABLE_NOW                            |
| E · Absorption Load                     | AL   | HYDRATABLE_NOW                            |
| F · Receiver Exposure                    | RE   | HYDRATABLE_NOW                            |
| G · Semantic Topology                    | ST   | HYDRATABLE_NOW                            |
| H · Structural Backing                   | SB   | HYDRATABLE_NOW                            |
| I · Semantic-Only Exposure               | SO   | HYDRATABLE_NOW                            |
| J · Cluster Concentration                | CC   | HYDRATABLE_NOW                            |
| K · Signal Stack                         | SS   | HYDRATABLE_NOW                            |
| L · Evidence Trace                       | ET   | HYDRATABLE_WITH_LIGHT_MAPPING              |
| M · Resolution Boundary                  | RB   | HYDRATABLE_NOW                            |
| N · Inference Prohibition                | IP   | BLOCKED_MISSING_ARTIFACT                   |
| O · Report Artifact Access               | RA   | PRESENTATION_ONLY                          |

**HYDRATABLE_NOW: 11 actors.**
**HYDRATABLE_WITH_LIGHT_MAPPING: 2 actors.**
**BLOCKED_MISSING_ARTIFACT: 1 actor (Inference Prohibition · N — rendering_metadata not yet vault-written).**
**PRESENTATION_ONLY: 1 actor (Report Artifact Access · O).**
**FIXTURE_ONLY: 0 actors.**

**Total hydratable today: 13 of 15.** This is stronger than FastAPI run_02 readiness (12 of 15), and the hydratable actors carry richer semantic content (17-domain business labels, 5 backed / 12 semantic-only split, full reproducibility verdict).

---

## 3. Required derivation rules

### 3.1 Confidence ratio at the 17-domain level

```
backed_count = count(domains where lineage_status in [EXACT, STRONG])
total_count  = 17
grounding_ratio_17 = backed_count / total_count   ≈ 5/17 ≈ 0.294

qualifier_class derivation:
  ratio == 1.0  → Q-00
  [0.6, 1.0)    → Q-01
  [0.0, 0.6)    → Q-02

For BlueEdge productized_01_fixed: ratio ≈ 0.294 → Q-02
```

The current LENS V2 fixture uses Q-01. Live BlueEdge would surface Q-02. This is a material change in advisory weight — UI register must accommodate Q-02.

### 3.2 Render-state derivation from decision_validation

```
band == CONDITIONAL && posture == INVESTIGATE  →  EXECUTIVE_READY_WITH_QUALIFIER
band == FAVORABLE && posture == AUTHORIZE       →  EXECUTIVE_READY
band == ESCALATED && posture == HALT            →  BLOCKED
band == DIAGNOSTIC                              →  DIAGNOSTIC_ONLY
```

For BlueEdge productized_01_fixed: band=CONDITIONAL, posture=INVESTIGATE → EXECUTIVE_READY_WITH_QUALIFIER. Same render-state vocabulary as the current fixture.

### 3.3 Domain → display label translation

Use `semantic/crosswalk/semantic_continuity_crosswalk.json` v2.0:

```
display_label = (semantic_continuity_crosswalk.entities[current_entity_id == DOM-XX].business_label)
             ?? (semantic_topology_model.domains[dominant_dom_id == DOM-XX].business_label)
             ?? (DOM-XX technical label)
```

Use the strongest available business label per domain.

---

## 4. Risks and gaps

| Risk                                                              | Severity | Mitigation                                                                  |
|-------------------------------------------------------------------|:--------:|-----------------------------------------------------------------------------|
| Inference Prohibition (N · IP) cannot be hydrated until rendering_metadata is vault-written | MEDIUM | Issue separate upstream contract; first binding ships with IP placeholder + caption |
| 17-domain ratio (5/17 = Q-02) different from current fixture (Q-01) | LOW | UI already supports qualifier-class display; Q-02 implies stricter advisory register |
| 12 semantic-only DOMAINs may produce visually busy Semantic-Only Exposure panel | LOW | Already designed: Topology cells use diagonal-hatch overlay for semantic-only |
| Business label coverage 9/13 (DOMs) and 5/17 (DOMAINs) — missing labels show technical names | LOW | Ship CEU/DOM technical name as fallback |
| FastAPI control case deferred | LOW | Acceptable; first binding establishes BlueEdge; FastAPI follow-up adds regression test |

---

## 5. Authority

This matrix is authoritative for the per-actor BlueEdge mapping. Future binding implementations MUST consult this document and the `BLUEEDGE_PRODUCTIZED_BINDING_RECONCILIATION.md` Section 10 perimeter declaration.

---

**End of BlueEdge LENS V2 hydration matrix.**
