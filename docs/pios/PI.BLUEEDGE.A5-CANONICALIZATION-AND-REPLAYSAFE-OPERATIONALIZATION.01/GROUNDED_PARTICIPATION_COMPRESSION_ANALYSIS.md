# Grounded Participation Compression Analysis

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01

**Date:** 2026-05-17
**Classification:** FORENSIC ARCHITECTURE LINEAGE RECOVERY
**Priority:** HIGHEST — determines whether current A.5 implementation is valid-but-incomplete or architecturally wrong

---

## 1. Recovered Historical Chain

```
FULL STRUCTURAL SCAN (Path A)
  945 nodes via structural_scanner.py
  11 clusters (after wrapper normalization)
  ↓
CEU GROUNDING PARTICIPATION (Path A — Phase 4)
  10 CEUs × detection rules → 35 participation nodes
  contract: PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01
  artifact: ceu_node_map.json (ART-05)
  ↓
SEMANTIC PARTICIPATION GROUPING (Path A.5)
  35 nodes → 13 domains via path-prefix grouping
  contract: PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01
  artifact: dom_path_domain_layer.json
  derivation_rule: "Group nodes by longest common path prefix"
  derivation_basis: PATH_EVIDENCE_ONLY
  ↓
BINDING ENVELOPE (Phase 5)
  13 domains → domain_telemetry, pressure_zone_designations
  binding_basis: PATH_EVIDENCE_ONLY
  ↓
VAULT CONSTRUCTION (Phase 8a)
  canonical_topology.json: 13 domains, 35 nodes
  source_authority: dom_path_domain_layer.json
  ↓
LENS EXECUTIVE PROJECTION (Phase 9 → LENS)
  BOARDROOM / DENSE / INVESTIGATION persona rendering
  SQO qualification overlay
  run_id: run_be_orchestrated_fixup_01
```

---

## 2. Where CEU Grounding Entered

**Historical CEU registry** (used in `run_blueedge_integrated_01`):

| CEU | Name | Nodes | Function |
|-----|------|-------|----------|
| CEU-01 | BACKEND_SERVICE | 3 | App module + main entry |
| CEU-02 | FRONTEND_APPLICATION | 3 | Frontend entry points |
| CEU-03 | DATA_LAYER | 5 | Migrations + config/data |
| CEU-04 | API_LAYER | 4 | Controllers (health, aftersales, agentic-ai) |
| CEU-05 | AUTHENTICATION_SECURITY | 5 | Auth module + guards |
| CEU-06 | CONFIGURATION_INFRA | 3 | Root config + docker-compose |
| CEU-07 | MONITORING_OBSERVABILITY | 3 | Grafana + prometheus |
| CEU-08 | TESTING_VALIDATION | 5 | Spec files + load-tests |
| CEU-09 | EDGE_AGENTS | 2 | svg-agents/ |
| CEU-10 | CI_CD_PIPELINE | 2 | GitHub workflows |
| **TOTAL** | | **35** | |

**Critical observation:** The current CEU registry (`scripts/pios/ceu_registry.json`) has been generified and renamed since this run:

- Historical: BACKEND_SERVICE, FRONTEND_APPLICATION, AUTHENTICATION_SECURITY, EDGE_AGENTS
- Current: APPLICATION_CORE, SERVICE_LAYER, API_ROUTING, LOGGING_OBSERVABILITY

The detection rules also changed. Current registry matches 67 of 945 nodes against the BlueEdge archive (vs 35 historically). The participation surface changed because the CEU definitions changed.

---

## 3. How Participation Filtering Occurred

The filtering is NOT arbitrary sampling. It is **CEU-grounded structural representation**:

1. **10 CEUs defined** — each represents a canonical execution unit (functional concern)
2. **Detection rules** match file paths to CEUs via `path_prefix`, `path_contains`, `filename_equals`, `extension_equals`, `dir_component_equals`
3. **Each matched node** gets a CEU assignment, zone assignment, and boundary classification
4. **35 nodes emerged** — the set of structurally significant files that participate in CEU grounding

The 35 nodes are NOT a random sample of 945. They are the **CEU-grounded structural representatives** — the nodes that CEU detection rules recognized as functionally significant.

**What the other 910 nodes represent:** Ungrounded structural inventory. Files present in the archive that no CEU detection rule matched. These nodes exist in the structural scan but did not participate in grounding — and therefore did not participate in semantic domain formation or LENS projection.

**The compression ratio:** 35 / 945 = 3.7% participation. This is deliberate executive compression — the LENS projection was never designed to show all 945 files. It was designed to show the structural topology of **grounded execution concerns**.

---

## 4. How Semantic Compression Occurred

`dom_path_domain_layer.json` applied one additional compression:

**Input:** 35 CEU-grounded nodes with file paths
**Method:** Group by longest common path prefix that represents a meaningful structural boundary
**Output:** 13 semantic participation domains

The 13 domains map cleanly to path-prefix boundaries:

| Domain | Path Prefix | Nodes | Semantic Function |
|--------|-------------|-------|-------------------|
| DOM-01 root_configuration | `*.env`, `docker-compose*` | 3 | Infrastructure config |
| DOM-02 ci_cd_workflows | `.github/workflows/` | 2 | CI/CD |
| DOM-03 backend_migrations | `backend/migrations/` | 3 | Database schema |
| DOM-04 backend_app_root | `backend/src/` (root only) | 2 | App entry points |
| DOM-05 backend_common | `backend/src/common/` | 5 | Shared utilities |
| DOM-06 backend_config | `backend/src/config/` | 2 | Configuration |
| DOM-07 backend_events | `backend/src/events/` | 1 | Event system |
| DOM-08 backend_health | `backend/src/health/` | 2 | Health checks |
| DOM-09 backend_modules | `backend/src/modules/` | 6 | Business logic |
| DOM-10 frontend | `frontend/` | 3 | UI layer |
| DOM-11 load_tests | `load-tests/` | 2 | Performance testing |
| DOM-12 monitoring | `monitoring/` | 2 | Observability infra |
| DOM-13 svg_agents | `svg-agents/` | 2 | Edge agents |

This is the **same path-prefix grouping logic** that the current A.5 implementation uses — but applied to 35 nodes instead of 945.

---

## 5. Comparison: Raw A.5 Substrate vs Executive Participation Topology

### Raw A.5 Replay-Safe Substrate (current implementation)

| Attribute | Value |
|-----------|-------|
| Input | 945 structural nodes (full scan) |
| Method | Path-prefix subdivision with wrapper normalization |
| Output | 48 domains |
| Grounding filter | NONE — all nodes participate |
| Compression | Structural only (depth-based subdivision) |
| Deterministic | YES |
| Replay-safe | YES |

### Executive Participation Topology (historical)

| Attribute | Value |
|-----------|-------|
| Input | 35 CEU-grounded nodes (participation-filtered) |
| Method | Path-prefix grouping by longest common prefix |
| Output | 13 domains |
| Grounding filter | CEU detection rules → 35 / 945 nodes |
| Compression | Functional (CEU grounding) + structural (path-prefix) |
| Deterministic | YES (given same CEU registry and same structural scan) |
| Replay-safe | YES (given same CEU registry) |

### The Key Difference

The current implementation removed the **CEU participation filter** and operated on the full structural substrate directly. This produced a valid raw topology (48 domains) but skipped the grounding-aware compression that the historical projection relied on.

**48 domains** = structurally correct, but too granular for executive projection
**13 domains** = grounding-aware executive semantic compression

---

## 6. Determination: Historical Model Classification

The historical model was:

**D. Hybrid grounding + executive compression**

Specifically:

1. **CEU grounding** — functional concern detection selected 35 structurally representative nodes from 945 (grounding-aware filtering)
2. **Path-prefix grouping** — the 35 grounded nodes were grouped into 13 domains by structural path boundaries (semantic compression)
3. **LENS projection** — the 13-domain topology was projected through persona-gated executive rendering (executive compression)

This is NOT:
- A: Pure grounded participation compression (the path-prefix step adds structural semantics beyond grounding)
- B: Pure executive semantic aggregation (the CEU step is structural, not executive)
- C: Curated semantic participation (no manual curation — deterministic CEU rules + deterministic path grouping)

It IS a two-stage compression pipeline with intentional architecture:
- Stage 1 (CEU grounding): "Which nodes participate in structural intelligence?" → 35/945
- Stage 2 (path-prefix domains): "What execution domains do the participating nodes form?" → 13 domains

---

## 7. Architectural Determination: Future Model

**YES — the correct future architecture is a multi-layer model:**

```
LAYER 1: RAW STRUCTURAL SUBSTRATE (Path A)
  945 nodes → 11 clusters (wrapper-normalized)
  structural_scanner.py
  Exists: YES (canonical, operational)

LAYER 2: RAW A.5 REPLAY-SAFE PARTICIPATION SUBSTRATE
  945 nodes → 48 domains (path-prefix subdivision)
  dom_layer_generator.py (current implementation)
  Exists: YES (this stream's output)
  Status: VALID but operates at wrong participation surface

LAYER 3: GROUNDED PARTICIPATION COMPRESSION (MISSING)
  945 nodes → N grounded nodes (CEU detection)
  N grounded nodes → M domains (path-prefix grouping)
  Historical: 35 nodes → 13 domains
  Exists: NO — this is the missing layer
  
LAYER 4: LENS EXECUTIVE PROJECTION
  M domains → persona-gated rendering
  lens_report_generator.py + projection_runtime.py
  Exists: YES (canonical, operational)
```

**The missing layer is Layer 3 — canonical grounding-aware semantic participation compression.**

The current implementation jumps from Layer 1 directly to Layer 2 without the CEU participation filter. This produces a structurally valid but semantically over-granular topology (48 vs 13 domains).

---

## 8. What This Means for the A.5 Implementation

### The replay-safe substrate (48 domains) is NOT wrong

It is a valid structural participation surface. It may serve as:
- Raw substrate for future A.5 extensions
- Full-coverage structural analysis (all 945 nodes assigned)
- Client-agnostic baseline (no CEU registry dependency)

### The replay-safe substrate (48 domains) is INCOMPLETE

It is missing the grounding participation compression that produces the executive semantic topology. The historical 13-domain projection was not 13 arbitrary groups — it was 13 grounding-aware semantic domains derived from CEU-filtered structural representatives.

### The missing layer is the CEU → domain compression

To reconstruct the historical executive projection:

1. Run CEU grounding (ceu_grounding.py or equivalent) to produce grounded participation set
2. Apply path-prefix domain grouping to the grounded participation set (not to all 945 nodes)
3. Produce the executive semantic topology from grounded nodes only

### CEU registry drift is a complication

The current CEU registry (`scripts/pios/ceu_registry.json`) has different definitions than the historical BlueEdge-specific registry. The current registry matches 67 nodes; the historical matched 35. Any replay-safe reconstruction must either:
- Use the current generified CEU registry (producing a different participation surface)
- Reconstruct from the historical grounding_state_v3.json (preserving the 35-node surface)
- Accept that CEU evolution changes the participation surface (and therefore the domain topology)

### Intentionality confirmed

The historical projection worked because it was intentionally designed as:
- CEU-grounded participation (not full coverage)
- Path-prefix semantic domains (not arbitrary clustering)
- Executive compression (35 representative nodes, not 945 raw files)

The 3.7% participation ratio (35/945) is the signal, not noise. Executive structural intelligence does not require representing every file — it requires representing every grounded execution concern.

---

## 9. Recommended Next Steps

### Immediate

1. **Preserve current 48-domain implementation** — valid raw A.5 substrate layer
2. **Do NOT deploy 48 domains as LENS executive topology** — wrong participation surface
3. **Restore LENS selector** to `run_be_orchestrated_fixup_01` (already done)

### Required for A.5 Completion

4. **Implement grounding-aware participation compression** as a new stage between `ceu_grounding.py` output and `dom_layer_generator.py`:
   - Input: grounding_state_v3.json + structural_node_inventory.json
   - Filter: select only CEU-grounded nodes
   - Group: apply path-prefix domain formation to grounded nodes only
   - Output: executive semantic topology (grounded_dom_layer.json)

5. **Decide CEU registry authority**: should the executive topology use:
   - Current generified registry (67 nodes, different domains) → new executive surface
   - Historical grounding state (35 nodes, 13 domains) → preserved historical surface
   - This is a governance decision, not an implementation decision

6. **Validate**: grounded participation compression must produce an executive topology that is semantically equivalent to the historical 13-domain surface (or a governed evolution of it)

### Stream verdict

**A5_OPERATIONALIZATION_PARTIAL:**
- Wrapper normalization: COMPLETE
- Raw replay-safe substrate: COMPLETE (48 domains)
- Orchestrator hardcoded references removed: COMPLETE
- Grounding-aware participation compression: MISSING
- Executive semantic topology equivalence: NOT VALIDATED
