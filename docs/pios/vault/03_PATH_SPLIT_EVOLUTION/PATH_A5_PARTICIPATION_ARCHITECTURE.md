# Path A.5 — Grounded Semantic Participation Architecture

> **How structural evidence becomes executive semantic topology through grounding-aware participation compression.**

---

## Canonical Participation Chain

```
LAYER 1: FULL STRUCTURAL SUBSTRATE (Path A)
  structural_scanner.py → 40.2 node inventory
  Input:  client archive (tar/zip)
  Output: N structural nodes (BlueEdge: 945 nodes, 11 clusters)
  Rule:   ALL files in the archive become structural nodes
  
          ↓  CEU grounding participation filter

LAYER 2: CEU GROUNDED PARTICIPATION SET
  ceu_grounding.py → grounding_state_v3.json
  ceu_node_map.json (ART-05)
  Input:  N structural nodes + CEU registry detection rules
  Output: M grounded participation nodes (BlueEdge: 35 nodes, 10 CEUs)
  Rule:   ONLY nodes matched by CEU detection rules participate
  
          ↓  path-prefix semantic domain grouping

LAYER 3: EXECUTIVE SEMANTIC TOPOLOGY (Path A.5)
  dom_path_domain_layer.json
  Input:  M grounded participation nodes
  Output: K semantic domains (BlueEdge: 13 domains)
  Method: Group by longest common path prefix
  Rule:   Domains emerge from grounded participants, NOT full substrate
  
          ↓  binding + activation + vault construction

LAYER 4: LENS EXECUTIVE PROJECTION
  binding_envelope.json → vault → LENS projection
  Input:  K semantic domains + signal activation + Q-class
  Output: persona-gated executive rendering
```

**This chain is intentional, not accidental. The compression ratio (945 → 35 → 13) is the architecture, not a bug.**

---

## Why Participation Compression Exists

Executive structural intelligence does not require representing every file. It requires representing every **grounded execution concern**.

| Approach | Nodes | Domains | What it shows |
|----------|-------|---------|---------------|
| Full structural substrate | 945 | 48 | Every file in the archive, grouped by path depth |
| CEU grounded participation | 35 | 13 | Structurally significant files that represent canonical execution units |

The 3.7% participation ratio (35/945) is the signal, not noise. A PMO director or CTO seeing 48 domains of raw file structure gets structural inventory. They need structural topology of execution concerns — which is what 13 grounding-aware domains provide.

---

## CEU Grounding: The Participation Filter

CEU = Canonical Execution Unit. Each CEU represents a functionally distinct execution concern (backend service, data layer, authentication, CI/CD, etc.).

**How CEU detection works:**
1. CEU registry defines 10 execution units with detection rules
2. Detection rules match file paths via `path_prefix`, `path_contains`, `filename_equals`, `extension_equals`, `dir_component_equals`
3. Each matched node receives a CEU assignment + zone assignment + boundary classification
4. Only matched nodes participate in semantic domain formation

**The BlueEdge participation set (historical):**

| CEU | Name | Nodes | Representative files |
|-----|------|-------|---------------------|
| CEU-01 | BACKEND_SERVICE | 3 | app.module.ts, main.ts, cache/index.ts |
| CEU-02 | FRONTEND_APPLICATION | 3 | App.tsx, index.html, main.tsx |
| CEU-03 | DATA_LAYER | 5 | migrations/, config/data-source.ts, database.config.ts |
| CEU-04 | API_LAYER | 4 | health.controller.ts, aftersales.controller.ts, agentic-ai.controller.ts |
| CEU-05 | AUTHENTICATION_SECURITY | 5 | auth.controller.ts, auth.module.ts, auth.service.ts, guards/ |
| CEU-06 | CONFIGURATION_INFRA | 3 | .env.example, docker-compose*.yml |
| CEU-07 | MONITORING_OBSERVABILITY | 3 | grafana/, prometheus.service.ts |
| CEU-08 | TESTING_VALIDATION | 5 | *.spec.ts files, load-tests/ |
| CEU-09 | EDGE_AGENTS | 2 | svg-agents/ |
| CEU-10 | CI_CD_PIPELINE | 2 | .github/workflows/ |

**35 nodes total. Each represents a structurally significant execution participant.**

---

## Path-Prefix Semantic Domain Formation

The 35 grounded nodes group into 13 domains by path prefix:

| Domain | Path Prefix | Nodes | Origin CEUs |
|--------|-------------|-------|-------------|
| root_configuration | `*.env`, `docker-compose*` | 3 | CEU-06 |
| ci_cd_workflows | `.github/workflows/` | 2 | CEU-10 |
| backend_migrations | `backend/migrations/` | 3 | CEU-03 |
| backend_app_root | `backend/src/` (root) | 2 | CEU-01, CEU-04 |
| backend_common | `backend/src/common/` | 5 | CEU-01, CEU-04, CEU-05, CEU-08 |
| backend_config | `backend/src/config/` | 2 | CEU-03 |
| backend_events | `backend/src/events/` | 1 | CEU-08 |
| backend_health | `backend/src/health/` | 2 | CEU-04, CEU-07 |
| backend_modules | `backend/src/modules/` | 6 | CEU-04, CEU-05 |
| frontend | `frontend/` | 3 | CEU-02 |
| load_tests | `load-tests/` | 2 | CEU-08 |
| monitoring | `monitoring/` | 2 | CEU-07 |
| svg_agents | `svg-agents/` | 2 | CEU-09 |

**Derivation rule:** "Group nodes by longest common path prefix that represents a meaningful structural boundary."
**Derivation basis:** PATH_EVIDENCE_ONLY — no semantic inference, no CEU functional role used for grouping.

---

## The Two-Layer A.5 Model

Path A.5 is NOT a single stage. It is a two-layer model:

### Layer A.5a — Raw Replay-Safe Participation Substrate

- Input: full structural scan (all N nodes)
- Method: deterministic path-prefix subdivision with wrapper normalization
- Output: many domains (BlueEdge: 48 from 945 nodes)
- Participation filter: NONE — all nodes participate
- Use: structural completeness baseline, full-coverage analysis, raw substrate

### Layer A.5b — Grounded Executive Semantic Topology

- Input: CEU-grounded participation set (M nodes)
- Method: path-prefix domain grouping on grounded nodes
- Output: executive domains (BlueEdge: 13 from 35 nodes)
- Participation filter: CEU grounding detection rules
- Use: LENS executive projection, SQO qualification, binding envelope

**A.5a without A.5b** = structurally complete but semantically over-granular (48 raw domains)
**A.5b without A.5a** = executive-ready but missing full-coverage baseline
**A.5a + A.5b** = complete replay-safe participation architecture

---

## CEU Registry Evolution Warning

The CEU registry has evolved since the historical BlueEdge run:

| Dimension | Historical (run_blueedge_integrated_01) | Current (ceu_registry.json) |
|-----------|----------------------------------------|----------------------------|
| CEU-01 | BACKEND_SERVICE | APPLICATION_CORE |
| CEU-02 | FRONTEND_APPLICATION | SERVICE_LAYER |
| CEU-04 | API_LAYER | API_ROUTING |
| CEU-05 | AUTHENTICATION_SECURITY | CONFIGURATION |
| CEU-06 | CONFIGURATION_INFRA | TESTING |
| Matched nodes | 35 | 67 (against same archive) |

**Governance implication:** CEU registry evolution changes the participation surface, which changes the executive topology. Any replay-safe A.5b implementation must either:
- Pin to a specific CEU registry version per client
- Accept that CEU evolution produces a governed topology evolution
- Preserve historical grounding states as reference artifacts

---

## Artifacts That Preserve This Chain

| Artifact | Location | Role |
|----------|----------|------|
| structural_node_inventory.json | `<run>/structure/40.2/` | Full structural substrate (Layer 1) |
| canonical_topology.json | `<run>/structure/40.4/` | Structural clusters (Layer 1) |
| grounding_state_v3.json | `<run>/ceu/` | CEU grounding results (Layer 2 input) |
| ceu_node_map.json | `<run>/` | Grounded participation set (Layer 2 output) |
| dom_path_domain_layer.json | `docs/psee/<stream>/recomputed/` | Executive semantic topology (Layer 3) |
| canonical_topology.json | `<run>/vault/` | Vault-format executive topology (Layer 4 input) |
| binding_envelope.json | `<run>/binding/` | Binding state (Layer 4) |

---

## Mandatory Load Rule

**Any future stream that touches Path A.5 semantic participation MUST load this vault page before execution.**

Failure to load this page risks:
- Treating full structural substrate as executive topology (the 48-domain drift)
- Losing the CEU participation filter (skipping grounding-aware compression)
- Rediscovering the 945→35→13 chain through forensic archaeology
- Optimizing for determinism instead of semantic equivalence

**The test:** if a stream produces domain counts significantly different from the historical participation surface without an explicit governance justification for the change, the stream has likely lost the participation compression layer.

---

## Cross-References

- [[PATH_A_EMERGENCE]] — structural grounding (what Path A.5 consumes)
- [[PATH_B_EMERGENCE]] — semantic reconstruction (complementary path)
- [[STRUCTURAL_GROUNDING_CRISIS]] — the crisis that created the path split
- [[../07_CANONICAL_LINEAGE/PIE_TO_DOM_LINEAGE]] — how PIE domains became DOM crosswalk
- [[../10_CANONICAL_RUNTIME_STATE/CURRENT_CANONICAL_PATHS]] — current path status
