# Critical Failure Matrix
## PI.E2E.BLUEEDGE.CANONICAL-CERTIFICATION.01

**Generated:** 2026-05-17
**Stream posture:** DISCOVERY — certification stream exposes gaps, does not remediate

---

## Failure Matrix

### BLUEEDGE-CERT-GAP-001 — Domain Reconstruction Gap

| Field | Value |
|-------|-------|
| **Finding ID** | BLUEEDGE-CERT-GAP-001 |
| **Title** | LENS-serving BlueEdge domain layer depends on non-canonical conformance reconstruction artifact |
| **Classification** | CRITICAL — blocks full CERTIFIED verdict |
| **Severity** | CRITICAL |
| **Category** | Canonical reconstruction gap |

**Description:**

The generic canonical pipeline does not currently regenerate the same domain structure consumed by LENS for BlueEdge. The generic structural scanner (`structural_scanner.py`) collapses the BlueEdge source tree into a single ROOT domain because the tar archive contains a wrapping directory (`blueedge-platform/`). The richer 13-domain structure used by LENS was produced by a recovered conformance stream (`PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01`) using 35 curated CEU nodes and path-prefix grouping. That process is not currently part of any canonical AMOps/Vault-governed pipeline stage.

**Root cause chain:**

```
1. BlueEdge archive extracts to: canonical_repo/blueedge-platform/...
2. structural_scanner.py clusters by Path.parts[0]
3. All 945 nodes share parts[0] = "blueedge-platform"
4. Result: 1 cluster (CLU-01 blueedge-platform, 945 nodes)
5. dom_layer_generator.py classifies cluster name "blueedge-platform"
6. No rule matches → falls to ROOT catch-all
7. Result: 1 domain (DOM-01 ROOT)
```

**Conformance artifact chain (what LENS actually uses):**

```
1. ceu_node_map.json from run_blueedge_integrated_01
2. 35 structurally meaningful nodes curated from CEU grounding
3. PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01
4. Derivation rule: "longest common path prefix" grouping
5. Result: 13 DOM groups (root_configuration, ci_cd_workflows,
   backend_migrations, backend_app_root, backend_common,
   backend_config, backend_events, backend_health,
   backend_modules, frontend, load_tests, monitoring, svg_agents)
6. Stored at: docs/psee/.../recomputed/dom_path_domain_layer.json
7. Recovered from git stash at commit 64ff900
```

**Impact:**

| Impact area | Description |
|-------------|-------------|
| Topology | LENS shows 13 structural domains; generic pipeline produces 1 |
| Propagation | 13-domain topology has meaningful propagation edges; 1-domain has none |
| Qualification | SQO qualification operates on domain-level granularity |
| Evidence Record | Board-ready artifact topology would be meaningless with 1 domain |
| Demo viability | The 20-minute demo choreography depends on visible topology structure |
| Reproducibility | An operator running the canonical pipeline cannot reproduce the LENS-serving state |

**Evidence trail:**

| Artifact | Location | Relevance |
|----------|----------|-----------|
| E2E Pipeline Reality Lock | commit `40a5db1` | Documents "No generic client-source structural scanner exists" (at time of writing) |
| E2E Pipeline Verdict | commit `40a5db1` | States "The pipeline is PARTIAL" and "No client can run the full pipeline via the native generation path" |
| Generic structural scanner | commit `ec91f84` (same day, May 1) | Added to close Blocker 2, but clusters by first-level directory only |
| DOM layer generator | commit `0d5561c` (same day, May 1) | Added to close Blocker 3, classifies clusters by name against fixed rule set |
| dom_path_domain_layer.json recovery | commit `64ff900` | Recovered from stash; conformance artifact |
| Conformance artifact sweep | commit `e05a4f7` | Additional conformance artifacts recovered |
| Certification run output | `clients/blueedge/psee/runs/run_blueedge_certification_01/` | Fresh run: 1 cluster, 1 domain, 945 nodes |
| LENS-serving vault topology | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/canonical_topology.json` | 13 domains, 35 nodes |

---

### BLUEEDGE-CERT-GAP-002 — Node Curation Stage Missing

| Field | Value |
|-------|-------|
| **Finding ID** | BLUEEDGE-CERT-GAP-002 |
| **Title** | No canonical pipeline stage curates structurally meaningful nodes from raw file inventory |
| **Classification** | HIGH — contributes to domain reconstruction gap |
| **Severity** | HIGH |
| **Category** | Pipeline stage gap |

**Description:**

The LENS-serving BlueEdge topology uses 35 curated structural nodes. The generic pipeline uses 945 raw file nodes. No canonical pipeline stage exists to perform this curation. The conformance stream selected nodes from `ceu_node_map.json` — a CEU grounding artifact — but the generic `ceu_grounding_generator.py` does not produce a node curation output.

Even if wrapping-directory clustering were fixed, the generic pipeline would produce domains from 945 nodes with different structural boundaries than the 35-node curated topology.

**Relationship to GAP-001:** This is a compounding factor. GAP-001 (clustering) and GAP-002 (curation) together explain why the generic pipeline produces fundamentally different structural output than the LENS-serving state.

---

### BLUEEDGE-CERT-GAP-003 — LENS-Serving Run Not Single-Execution

| Field | Value |
|-------|-------|
| **Finding ID** | BLUEEDGE-CERT-GAP-003 |
| **Title** | Current LENS-serving BlueEdge run was assembled from partial outputs, not produced by single pipeline execution |
| **Classification** | MEDIUM — provenance concern, not structural |
| **Severity** | MEDIUM |
| **Category** | Run provenance |

**Description:**

The LENS-serving run `run_be_orchestrated_fixup_01` contains only 41.x, 75.x, binding, and vault artifacts. It has NO intake, structure (40.x), CEU, DOM, integration validation, or vault readiness artifacts. The run was assembled from outputs of multiple prior runs and conformance artifacts, not produced by a single `run_client_pipeline.py` execution.

The certification run (`run_blueedge_certification_01`) proved that a single pipeline execution IS mechanically possible — but with structurally poor output (GAP-001).

---

### BLUEEDGE-CERT-GAP-004 — Reconstruction Method Not Canonically Declared

| Field | Value |
|-------|-------|
| **Finding ID** | BLUEEDGE-CERT-GAP-004 |
| **Title** | No AMOps/Vault authority declares which domain reconstruction method is canonical |
| **Classification** | HIGH — governance gap |
| **Severity** | HIGH |
| **Category** | Governance authority gap |

**Description:**

Three domain reconstruction methods exist in the codebase:

| Method | Producer | Clustering approach | Node source | Result for BlueEdge |
|--------|----------|-------------------|-------------|-------------------|
| Generic scanner + DOM generator | `structural_scanner.py` + `dom_layer_generator.py` | Top-level path component + name rules | All files (945) | 1 domain (ROOT) |
| Conformance path-prefix grouping | `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` | Longest common path prefix | 35 curated CEU nodes | 13 domains |
| FastAPI bootstrap | `bootstrap_fastapi_40x.py` | Client-specific | Client-specific | N/A for BlueEdge |

No AMOps/Vault document declares which method is canonical. No TERMINOLOGY_LOCK entry governs domain reconstruction methodology. A clean operator encountering the generic pipeline would use Method 1 and get 1 domain.

---

## Failure Matrix Summary

| Gap ID | Title | Severity | Blocks Certification |
|--------|-------|----------|---------------------|
| BLUEEDGE-CERT-GAP-001 | Domain reconstruction gap | CRITICAL | YES |
| BLUEEDGE-CERT-GAP-002 | Node curation stage missing | HIGH | YES (compounding) |
| BLUEEDGE-CERT-GAP-003 | Run not single-execution | MEDIUM | NO (provenance only) |
| BLUEEDGE-CERT-GAP-004 | Reconstruction method not declared | HIGH | YES (governance) |

**Certification verdict pressure:** 3 of 4 gaps block full CERTIFIED verdict. GAP-001 is the primary structural gap. GAP-002 and GAP-004 are compounding factors. GAP-003 is provenance-only and does not block certification on its own.
