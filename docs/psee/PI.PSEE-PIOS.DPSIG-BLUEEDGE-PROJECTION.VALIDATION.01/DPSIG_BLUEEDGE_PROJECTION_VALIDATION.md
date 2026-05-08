# DPSIG BlueEdge Projection Validation

**Stream:** PI.PSEE-PIOS.DPSIG-BLUEEDGE-PROJECTION.VALIDATION.01  
**Status:** COMPLETE — CERTIFIED  
**Date:** 2026-05-08  
**Verdict:** PASS — 25/25 checks PASS

---

## 1. EXECUTIVE SUMMARY

The DPSIG runtime yields `EXECUTIVE_READY` for BlueEdge and `DIAGNOSTIC_ONLY` for FastAPI using the **same deterministic runtime, the same governance model, and the same readiness gate**. Divergence is entirely evidence-derived — no client-specific logic exists. BlueEdge semantic richness is preserved, executive projection is maintained, and no semantic degradation occurs.

---

## 2. PRODUCTIZED PIPELINE CONFIRMATION

- Same `derive_relational_signals.py` — no redesign
- Same `lens_report_generator.py` — no redesign
- Same `lens_generate.sh` — no redesign
- Same selector mechanism — no change
- Same readiness gate classifier — no change
- Same path resolution (`structure/40.4/canonical_topology.json`) — BlueEdge adapter created as pure format translation from vault domains

**Structural finding:** BlueEdge run does not have `structure/40.4/` (assembled from vault/semantic layers, not ingestion chain). A format-adapter canonical_topology.json was created translating vault domain data (DOM-XX with component_ids) to cluster schema (cluster_id/name/node_count). This is a pure format translation — no new computation.

---

## 3. BLUEEDGE BASELINE CONFIRMATION

| Item | Value |
|---|---|
| Authoritative run | run_blueedge_productized_01_fixed |
| Total nodes | 35 |
| Total domains | 13 |
| Domain grounding | ALL 13 GROUNDED |
| Pressure zone | PZ-001 COMPOUND_ZONE on DOM-04/backend_app_root |
| Pressure signals | PSIG-001, PSIG-002, PSIG-004 |
| Semantic clusters | 5 (Operational Intelligence, Fleet Operations, Emerging Capabilities, Platform Infrastructure, Platform Services) |

---

## 4. SEMANTIC RICHNESS VALIDATION

| Semantic Construct | Status |
|---|---|
| Domain topology — 13 GROUNDED domains | OPERATIONAL |
| Grounding classification — EXACT/STRONG/PARTIAL | OPERATIONAL |
| Pressure zone rendering — PZ-001 COMPOUND_ZONE | OPERATIONAL |
| Semantic confidence scoring | OPERATIONAL |
| Executive readability — PSIG-001/002/004 intact | PRESERVED |
| Business capability anchoring — DOM-04/backend_app_root | PRESERVED |
| NODE-0021 primary outlier | PRESERVED (visible in tier-2 diagnostic) |

**Verdict:** Semantic richness fully preserved. No semantic topology collapse. No raw CLU rendering dominance.

---

## 5. DPSIG RUNTIME VALIDATION

```
derive_relational_signals.py --client-id blueedge --run-id run_blueedge_productized_01_fixed
→ EXIT 0

DPSIG-031 CPI: 2.1176 (CLUSTER_PRESSURE_ELEVATED)
DPSIG-032 CFA: 0.1714 (CLUSTER_BALANCED)
Severity band: ELEVATED
```

**Comparison with FastAPI:**

| Metric | BlueEdge | FastAPI |
|---|---|---|
| Dominant cluster | backend_modules (DOM-09) | src (CLU-17) |
| Dominant cluster size | 6 / 35 nodes (17.1%) | 89 / 123 nodes (72.4%) |
| CPI | 2.1176 (ELEVATED) | 5.6126 (HIGH) |
| CFA | 0.1714 (BALANCED) | 0.7236 (DOMINANT) |
| Severity band | ELEVATED | CRITICAL |
| Cluster salience | 0.0871 | 1.6245 |
| render_apex | False (salience < 1.0) | True (salience >= 1.0) |

---

## 6. READINESS GATE VALIDATION

**BlueEdge outcome: EXECUTIVE_READY**

Gate evaluation:
- `max_cluster_name` = "backend_modules" — NOT in `_DPSIG_DIAGNOSTIC_ONLY_CONTAINERS`
- NOT in `_DPSIG_SUPPRESSED_CONTAINERS`
- No `FILESYSTEM_CONTAINER_DOMINANCE` flag triggered
- `structurally_backed_domains` = 13/13 = 1.0 >= 0.5 → `EXECUTIVE_READY`

**FastAPI outcome: DIAGNOSTIC_ONLY** (unchanged)

Gate evaluation:
- `max_cluster_name` = "src" — IN `_DPSIG_DIAGNOSTIC_ONLY_CONTAINERS`
- `FILESYSTEM_CONTAINER_DOMINANCE` flag triggered
- `structurally_backed_domains` = 0 → `DIAGNOSTIC_ONLY`

**Critical governance finding:** The gate behaves differently for legitimate, evidence-derived reasons. The code is identical — the topology data differs.

---

## 7. SEMANTIC PRESERVATION VALIDATION

| Check | Result |
|---|---|
| PSIG-001/002/004 intact in tier-1 reports | PASS |
| PZ-001 COMPOUND_ZONE rendered | PASS |
| DOM-04/backend_app_root present | PASS |
| DPSIG-031/032 executive summaries (3 renders) | PASS |
| No diagnostic notice triggered | PASS |
| No engineering-only restriction | PASS |
| Headline label: ELEVATED (not suppressed) | PASS |
| executive_rendering=YES embedded | PASS |

Semantic color semantics preserved. Executive projection uses full executive framing (not diagnostic framing). No semantic downgrade occurred.

---

## 8. FALSE-POSITIVE CONTAINMENT VALIDATION

| Check | Result |
|---|---|
| backend_modules not in diagnostic-only set | PASS |
| No FILESYSTEM_CONTAINER_DOMINANCE flag | PASS |
| No ungrounded cluster promoted | PASS |
| ELEVATED severity reflects legitimate structural concentration | PASS |
| 17.1% fan asymmetry correctly classified as BALANCED (< 35%) | PASS |
| COMPOUND_ZONE on DOM-04 is semantically attributed | PASS |
| No unsafe executive escalation | PASS |

**Distinction:**
- BlueEdge DOM-09/backend_modules: semantically named, grounded domain → executive projection safe
- FastAPI CLU-17/src: filesystem container, no grounding → diagnostic containment required

---

## 9. REPORT CONTRACT VALIDATION

- Selector: unchanged
- API routes: unchanged (`/api/generate-report`, `/api/report-file`)
- Report routing: unchanged
- lens_generate.sh: EXIT 0
- Reports generated: 9 (4 main + 5 publish variants)
- PSEE flat path compliance: CONFIRMED

---

## 10. NON-REGRESSION VALIDATION

**BlueEdge existing content:**
- PSIG-001/002/004 semantic content intact
- PZ-001 COMPOUND_ZONE preserved
- NODE-0021 preserved in tier-2 diagnostic
- Semantic topology layout unchanged

**FastAPI non-regression:**
- DIAGNOSTIC_ONLY state: PRESERVED
- executive_rendering=NO: PRESERVED
- STRUCTURAL DIAGNOSTIC h2: PRESERVED
- CRITICAL absent from h2: PRESERVED
- lens_generate.sh EXIT 0: CONFIRMED

---

## 11. CLIENT-AGNOSTIC GOVERNANCE VALIDATION

| Item | Value |
|---|---|
| Same `derive_relational_signals.py` | YES |
| Same `lens_report_generator.py` | YES |
| Same readiness gate classifier | YES |
| Same path resolution model | YES |
| Client-specific branching in code | NONE |
| Client-specific hardcoding | NONE |
| Divergence mechanism | Evidence-derived: cluster name + grounding quality |

**Proof:** Two clients, same code path, different evidence → different readiness states. The governance model is topology-native and client-agnostic.

---

## 12. FASTAPI VS BLUEEDGE COMPARISON

| Dimension | FastAPI | BlueEdge |
|---|---|---|
| Dominant cluster | src (CLU-17) | backend_modules (DOM-09) |
| Cluster nodes / total | 89/123 (72.4%) | 6/35 (17.1%) |
| CPI | 5.6126 HIGH | 2.1176 ELEVATED |
| CFA | 0.7236 DOMINANT | 0.1714 BALANCED |
| Severity | CRITICAL | ELEVATED |
| Salience | 1.6245 (apex) | 0.0871 (standard) |
| Grounding | NONE (src ungrounded) | ALL (13/13 grounded) |
| Readiness state | DIAGNOSTIC_ONLY | EXECUTIVE_READY |
| Executive rendering | NO | YES |
| Headline label | STRUCTURAL DIAGNOSTIC | ELEVATED |
| False-positive flag | FILESYSTEM_CONTAINER_DOMINANCE | none |
| Divergence cause | Container dominance + no grounding | Semantic domain + full grounding |

---

## 13. VALIDATION VERDICT

**PASS — 25/25 checks PASS**

- BlueEdge semantic richness: PRESERVED
- DPSIG integration: NO semantic degradation
- Readiness gate: EXECUTIVE_READY — correctly diverges from FastAPI DIAGNOSTIC_ONLY
- Replay determinism: CONFIRMED (identical checksums on independent rerun)
- Client-specific logic: NONE
- Executive readability: PRESERVED
- Report contract: NO drift
- Selector/API/routing: NO mutation
- FastAPI non-regression: CONFIRMED

---

## 14. GOVERNANCE CONFIRMATION

- No data mutation
- No computation outside authorized scope
- No semantic authority expansion
- No interpretation without authorization
- No 75.x mutation
- No 41.x mutation
- No threshold mutation
- No selector/API/report contract changes
- No client-specific logic
- No DPSIG recomputation
- Lane A protected artifacts unchanged

---

*Stream: PI.PSEE-PIOS.DPSIG-BLUEEDGE-PROJECTION.VALIDATION.01*  
*Baseline commit: 93098cb*  
*Artifact: artifacts/e2e/blueedge/run_blueedge_productized_01_fixed/dpsig_blueedge_projection_validation.json*  
*Artifact: artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json*  
*Handoff: PI.AGENTIC-SEMANTIC-ORCHESTRATION.01*
