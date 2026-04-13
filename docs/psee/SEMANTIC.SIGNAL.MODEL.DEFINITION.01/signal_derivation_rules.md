# Signal Derivation Rules
# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Deliverable 2

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Purpose

This document defines how each signal type (S1–S5) is derived from raw repository evidence. For each signal type, the extraction method, required inputs, transformation rules, output format, and failure modes are specified.

---

## Derivation Pipeline Overview

```
[RAW REPOSITORY]
  source files, module declarations, build files, import statements
        │
        ▼
  [S1 EXTRACTION]          [S2 EXTRACTION]          [S3 EXTRACTION]
  module boundaries        identifier tokenization   dependency graph
  filesystem topology      route parsing             coupling metrics
        │                       │                         │
        └───────────────────────┴─────────────────────────┘
                                │
                                ▼
                    [S4 EXTRACTION (requires PEG)]
                    co-execution matrix from PEG paths
                                │
                                ▼
                    [S5 DERIVATION (constrained)]
                    intent labels from S1–S4 only
                                │
                                ▼
                    [SIGNAL BUNDLE per component]
                    → input to grouping logic
```

---

## DR-S1 — STRUCTURAL Signal Derivation

### Required Inputs

| input | description | required? |
|-------|-------------|-----------|
| Root orchestration file | app.module.ts, main.go, Application.java, __init__.py, etc. | REQUIRED |
| Module declaration files | @Module(), package.json, pyproject.toml, go.mod, pom.xml, etc. | REQUIRED |
| Directory tree | Full recursive directory listing of repository | REQUIRED |
| Monorepo workspace manifest | nx.json, lerna.json, pnpm-workspace.yaml (if applicable) | OPTIONAL |

### Extraction Method

**Step DR-S1-1: Root Component Inventory**

Parse the root orchestration file for all component imports/declarations:
```
For each import/declaration in root_file:
  record:
    - component_name (canonical class/module name)
    - source_file (path to module declaration file)
    - import_position (line number or ordinal in root file)
    - declaration_type: ROOT_MODULE | IMPORTED_MODULE | REGISTERED_PROVIDER
```

**Step DR-S1-2: Module Boundary Detection**

For each component found in DR-S1-1, determine its filesystem boundary:
```
If module_declaration_file exists:
  boundary = parent directory of module declaration file
Else if component is a single file:
  boundary = the file itself
Else if component is a monorepo package:
  boundary = package root directory
```

**Step DR-S1-3: Hierarchy Construction**

Build a component hierarchy tree:
```
For each component:
  parent_boundary = nearest enclosing named directory above module boundary
  record:
    - component.boundary
    - component.parent_boundary
    - component.depth_from_root
```

**Step DR-S1-4: Structural Grouping Candidates**

Identify co-location groups:
```
For each pair (CompA, CompB):
  shared_ancestor = deepest common ancestor in hierarchy tree
  IF shared_ancestor.depth >= 1 AND shared_ancestor ≠ repository_root:
    s1_colocated(CompA, CompB) = TRUE
    s1_ancestor = shared_ancestor
```

### Output Format

```yaml
s1_signal:
  component_id: <assigned at enumeration>
  component_name: <canonical name>
  source_file: <module declaration file path>
  import_position: <line number or ordinal>
  declaration_type: ROOT_MODULE | IMPORTED_MODULE | REGISTERED_PROVIDER | PACKAGE
  boundary: <directory path>
  parent_boundary: <parent directory path>
  depth_from_root: <integer>
  co_located_with: [<component_ids sharing same parent_boundary>]
```

### Failure Modes

| failure | condition | handling |
|---------|-----------|----------|
| NO_ROOT_FILE | Root orchestration file not found | FAIL — cannot derive component inventory; halt extraction |
| NO_MODULE_DECLARATIONS | No module declaration syntax found | DEGRADED — use directory structure only; record S1_DEGRADED |
| AMBIGUOUS_BOUNDARY | Component files not co-located in any named directory | ISOLATED — record as potential infrastructure or cross-cutting component |
| CIRCULAR_BOUNDARY | Directory hierarchy is circular | ERROR — log; use flat enumeration |

---

## DR-S2 — NAMING Signal Derivation

### Required Inputs

| input | description | required? |
|-------|-------------|-----------|
| Component list from S1 | Enumerated components with source files | REQUIRED |
| Source files for each component | Class/interface definitions | REQUIRED |
| Route definition files | Controller files, router files, OpenAPI specs | RECOMMENDED |
| Directory names | From S1 boundary extraction | REQUIRED (via S1) |

### Extraction Method

**Step DR-S2-1: Identifier Collection**

For each component, collect identifiers:
```
For each source_file of component:
  collect:
    - class_names (all exported/public class names)
    - file_name (without extension)
    - folder_names (all containing directories)
    - method_names (public/exported methods)
    - route_paths (if controller file)
    - interface_names
    - type_names (exported)
```

**Step DR-S2-2: Tokenization**

Apply tokenization to each identifier:
```
For each identifier:
  1. Split CamelCase: FleetManagementService → ["Fleet", "Management", "Service"]
  2. Split snake_case: vehicle_tracking_module → ["vehicle", "tracking", "module"]
  3. Split kebab-case: sensor-collector → ["sensor", "collector"]
  4. Lowercase all tokens
  5. Remove framework stopwords: see STOPWORD_SET below
  6. Record remaining tokens as domain_keywords
```

**STOPWORD_SET (framework-generic terms — not domain vocabulary):**

```
module, service, controller, repository, handler, factory, provider,
manager, helper, util, utils, interface, type, class, abstract,
base, common, shared, core (as suffix only), impl, implementation,
dto, entity, model (as suffix only), schema, config, configuration,
middleware, interceptor, guard, decorator, pipe, filter, gateway
```

Note: words from this set that appear as ROOT components (not suffixes) are retained. Example: "CoreFleet" → ["core", "fleet"] — both retained. But a component named purely "ServiceManager" produces no domain keywords.

**Step DR-S2-3: Route Path Parsing**

For each route path:
```
Split path by '/'
Remove API versioning segments: v1, v2, api, etc.
Retain path segments as domain_path_tokens
```
Example: `/api/v1/fleet/vehicles/tracking` → `["fleet", "vehicles", "tracking"]`

**Step DR-S2-4: Keyword Frequency Map**

For each component, build a keyword frequency map:
```
keyword_map[component] = {keyword: count, ...}
```

**Step DR-S2-5: Cross-Component Vocabulary Overlap**

For each pair (CompA, CompB):
```
shared_keywords = keyword_map[CompA].keys() ∩ keyword_map[CompB].keys()
s2_keyword_overlap_score(CompA, CompB) = |shared_keywords| / max(|CompA_keywords|, |CompB_keywords|)
```

### Output Format

```yaml
s2_signal:
  component_id: <id>
  identifiers_collected:
    - type: CLASS_NAME | FILE_NAME | FOLDER_NAME | ROUTE_PATH | METHOD_NAME
      value: <original string>
      file: <source file>
  domain_keywords: [<list of tokens after stopword removal>]
  route_path_tokens: [<list>]  # if route controller
  keyword_frequency: {keyword: count}
```

### Failure Modes

| failure | condition | handling |
|---------|-----------|----------|
| NO_DOMAIN_KEYWORDS | All tokens are stopwords | WEAKLY_GROUNDED — S2 signal absent; rely on S1/S3/S4 |
| SINGLE_KEYWORD | Only 1 domain keyword | LOW confidence; record; corroboration required |
| NAMING_CONFLICT | Same keyword appears in >50% of all components | Keyword treated as platform-generic; removed from domain vocabulary |

---

## DR-S3 — DEPENDENCY Signal Derivation

### Required Inputs

| input | description | required? |
|-------|-------------|-----------|
| Component list from S1 | Enumerated components | REQUIRED |
| Import/dependency declarations | Import statements per source file | REQUIRED |
| Module provider arrays | Framework-specific injection declarations | RECOMMENDED |
| Build dependency files | package.json, pom.xml, go.mod, etc. | RECOMMENDED |

### Extraction Method

**Step DR-S3-1: Dependency Edge Extraction**

For each component:
```
Parse source files for:
  - import statements → extract imported module/component name
  - provider/injection declarations → extract injected service name
  - build dependency declarations → extract library/module names

For each import:
  Resolve import path to component_id (using S1 component inventory)
  Record: edge(CompA → CompB) where CompA is the importer
```

**Step DR-S3-2: Dependency Graph Construction**

Build directed graph G = (V, E) where:
- V = all component_ids
- E = directed import/dependency edges

**Step DR-S3-3: Metric Computation**

```
For each component C:
  out_degree(C) = number of edges C → *
  in_degree(C) = number of edges * → C
  total_degree(C) = out_degree(C) + in_degree(C)

For each pair (CompA, CompB):
  shared_dependencies = {X : edge(CompA→X) AND edge(CompB→X)}
  coupling_score(CompA, CompB):
    direct_edges = edges(CompA→CompB) + edges(CompB→CompA)
    indirect_shared = |shared_dependencies|
    score = (direct_edges + 0.5 × indirect_shared) / (total_degree(CompA) + total_degree(CompB))

For each component C:
  is_hub(C) = total_degree(C) > median_degree × K_hub
```

**Step DR-S3-4: Coupling Cluster Detection**

```
Apply union-find (or equivalent) to components with coupling_score > T_coupling:
  clusters = set of maximal groups where all pairs have coupling_score > T_min
  For each cluster: record cluster_id and member_components
```

**Step DR-S3-5: Hub Classification**

```
For each hub component H:
  Classify: SHARED_SERVICE (imported by many, imports few)
             ORCHESTRATOR (imports many, imported by few)
             CROSS_CUTTING (high in-degree AND out-degree)
```

### Output Format

```yaml
s3_signal:
  component_id: <id>
  dependencies:
    - target_component_id: <id>
      dependency_type: IMPORT | PROVIDER | BUILD
      source_file: <file>
      line_number: <n>
  metrics:
    out_degree: <n>
    in_degree: <n>
    is_hub: true | false
    hub_type: SHARED_SERVICE | ORCHESTRATOR | CROSS_CUTTING | null
  coupling_scores: {<component_id>: <score>}
  cluster_id: <id or null>
```

### Failure Modes

| failure | condition | handling |
|---------|-----------|----------|
| NO_IMPORT_RESOLUTION | Import paths cannot be resolved to component_ids | DEGRADED — use unresolved import names for S2 vocabulary only; mark S3 edges as UNRESOLVED |
| FULLY_DISCONNECTED | Component has zero dependency edges | ISOLATED — flagged as potential infrastructure or entry-point component |
| UNIVERSAL_HUB | One component has degree > 10× median | Treat as PLATFORM_CORE; exclude from coupling-based grouping; annotate as shared service |

---

## DR-S4 — EXECUTION Signal Derivation

### Required Inputs

| input | description | required? |
|-------|-------------|-----------|
| Program Execution Graph (PEG) | Output of 40.x structural layer | REQUIRED for S4; ABSENT if 40.x not run |
| PEG notation reference | Entity ID scheme used in PEG (COMP-NN, N-NN, BM-NNN, etc.) | REQUIRED |
| PEG path definitions | EP-NN definitions with ordered component sequences | REQUIRED |

### Extraction Method

**Step DR-S4-1: PEG Ingestion**

```
Read PEG artifact (program_execution_graph.md or equivalent)
Extract:
  - path_ids: [EP-01, EP-02, ..., EP-N]
  - For each path: ordered sequence of component identifiers
  - entity_id_scheme: identify notation used
```

**Step DR-S4-2: Entity ID Resolution**

```
If PEG uses a different entity scheme than current S1 component IDs:
  Load entity ID mapping (e.g., BM-NNN → COMP-NN translation table if available)
  If mapping unavailable: record s4_notation_gap = TRUE
    Use structural name matching (entity name → component name) as fallback
    Mark resolution confidence as APPROXIMATE
```

**Step DR-S4-3: Co-execution Matrix Construction**

```
Initialize coexec_matrix[CompA][CompB] = 0 for all pairs

For each EP-NN path [C1, C2, ..., Ck]:
  For each pair (Ci, Cj) with i < j:
    coexec_matrix[Ci][Cj] += 1
    coexec_matrix[Cj][Ci] += 1  # symmetric
```

**Step DR-S4-4: Co-execution Scoring**

```
For each pair (CompA, CompB):
  coexec_score = coexec_matrix[CompA][CompB]
  s4_strength:
    if coexec_score >= T_strong_coexec: STRONG
    elif coexec_score >= T_coexec: PRESENT
    else: ABSENT
```

**Step DR-S4-5: Path-level Domain Detection**

```
For each EP-NN path:
  Identify path_domain_candidate = most frequent S1 parent_boundary among path members
  Record: path_domain_signal(EP-NN) = {dominant_boundary, coverage_ratio}
```

### Output Format

```yaml
s4_signal:
  component_id: <id>
  peg_source: <path to PEG artifact>
  peg_notation: <entity scheme>
  resolution_type: EXACT | APPROXIMATE | UNRESOLVED
  path_participation:
    - path_id: EP-NN
      position_in_path: <ordinal>
      path_length: <n>
  coexec_scores: {<component_id>: <score>}
  coexec_strong_partners: [<component_ids with STRONG co-execution>]
```

**If PEG is absent:**
```yaml
s4_signal:
  component_id: <id>
  peg_source: null
  s4_available: false
  s4_absent_reason: PEG_NOT_PRODUCED | PEG_NOT_FOUND | NOTATION_UNRESOLVABLE
```

### Failure Modes

| failure | condition | handling |
|---------|-----------|----------|
| PEG_NOT_FOUND | No PEG artifact in 40.x layer | S4 ABSENT — record; grouping proceeds on S1–S3 only |
| NOTATION_GAP | PEG uses entity scheme not mappable to S1 components | S4 APPROXIMATE — use name matching; flag affected signals |
| EMPTY_PATH | PEG path has < 2 components | Skip path; record as DEGENERATE_PATH |
| COMPONENT_NOT_IN_PEG | Component appears in S1 but not in any PEG path | Record s4_signal.peg_coverage = FALSE; component may be infrastructure or test-only |

---

## DR-S5 — DERIVED INTENT Signal Derivation

### Required Inputs

| input | description | required? |
|-------|-------------|-----------|
| S1 signals for the component | Module boundary, hierarchy | REQUIRED |
| S2 signals for the component | Domain keyword list | REQUIRED |
| S3 signals for the component | Cluster membership, hub status | RECOMMENDED |
| S4 signals for the component | Co-execution partners | RECOMMENDED |
| Framework/language type | Observable from repository (e.g., NestJS, Django, Spring) | PERMITTED |

**PROHIBITED S5 inputs:** Organization name, product name, marketing materials, external documentation, knowledge about the specific company, knowledge about the specific domain beyond what is extractable from S1–S4.

### Derivation Method

**Step DR-S5-1: Signal Bundle Assembly**

```
For each component C:
  Assemble:
    name_vocabulary = S2.domain_keywords(C)
    structural_context = S1.parent_boundary(C) + S1.hierarchy(C)
    dependency_context = S3.cluster_id(C) + S3.hub_type(C)
    execution_context = S4.coexec_strong_partners(C)  # if available
```

**Step DR-S5-2: Intent Label Inference**

```
Apply intent inference using ONLY the assembled signal bundle:

Rule DR-S5-R1 (Name-dominant inference):
  If name_vocabulary is unambiguous (≥2 domain keywords + consistent S1 boundary):
    inferred_intent = functional_label(name_vocabulary)
    confidence = MEDIUM if only S2; HIGH if S1 corroborates

Rule DR-S5-R2 (Cluster-informed inference):
  If component is in S3 cluster AND cluster has dominant keywords:
    inferred_intent = cluster_dominant_label
    confidence ELEVATED by one level

Rule DR-S5-R3 (Execution-path-informed inference):
  If S4 partners have consistent S5 intent labels (pre-computed):
    inferred_intent = execution_cluster_label
    confidence ELEVATED by one level if S2 also consistent

Rule DR-S5-R4 (Hub disambiguation):
  If component is S3.hub_type = SHARED_SERVICE:
    inferred_intent = SHARED_PLATFORM_SERVICE
    domain_candidate = PLATFORM_INFRASTRUCTURE or CROSS_CUTTING
    (regardless of naming vocabulary — structural role dominates)
```

**Step DR-S5-3: Domain Candidate Assignment**

```
Map inferred_intent to domain_candidate using domain type taxonomy:
  FUNCTIONAL: components implementing business operations
  OPERATIONAL: components implementing runtime/monitoring operations
  INFRASTRUCTURE: components providing shared technical foundation
  INTEGRATION: components managing external system interfaces
  CROSS_CUTTING: components applying across all domains (auth, config, logging)
```

**Step DR-S5-4: Confidence Scoring**

```
confidence = LOW (baseline)
If S1 boundary corroborates: +1 level
If S2 ≥3 consistent keywords: +1 level
If S3 cluster consistent: +1 level
If S4 execution partners consistent: +1 level
Final confidence: LOW → MEDIUM → HIGH (cap at HIGH)
```

**Step DR-S5-5: Reasoning Trace**

```
Record explicit reasoning trace:
  "Component X has S2 keywords {a, b, c}. S1 boundary is /modules/billing/.
   S3 cluster contains BillingService, InvoiceController. 
   Inferred intent: Billing and Invoice Management.
   Domain candidate: FUNCTIONAL (commercial operations).
   Confidence: HIGH (3 corroborating signals)."
```

No reasoning step may reference information absent from the assembled signal bundle.

### Output Format

```yaml
s5_signal:
  component_id: <id>
  input_signals_used:
    s1_refs: [<boundary path>]
    s2_refs: [<keyword list>]
    s3_refs: [<cluster_id, hub_type>]
    s4_refs: [<coexec_partners>]  # if available
  inferred_intent_label: <string>
  domain_candidate: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS_CUTTING
  confidence: HIGH | MEDIUM | LOW
  reasoning_trace: <explicit step-by-step reasoning string>
  override_permitted: false
  s5_flag: true
```

### Failure Modes

| failure | condition | handling |
|---------|-----------|----------|
| NO_S2_KEYWORDS | All S2 keywords are stopwords | confidence = LOW; inferred_intent = UNKNOWN; domain_candidate = null; S5 cannot contribute |
| CONFLICTING_SIGNALS | S2 implies one domain; S3 cluster implies another | Record conflict; confidence = LOW; flag for human review |
| PROHIBITED_INPUT_DETECTED | Reasoning trace references external knowledge | REJECT signal; re-derive using only assembled bundle |
| ALL_SIGNALS_ABSENT | S3 and S4 both unavailable; S2 weak | S5 = ABSENT for this component; proceed on S1–S2 only |

---

## Derivation Order Constraints

```
S1 must be derived BEFORE S2, S3, S4 (all require S1 component inventory)
S2, S3 may be derived in parallel (both require S1 only)
S4 requires PEG (external 40.x input) — derive in parallel with S2, S3
S5 must be derived AFTER S1, S2, S3, S4 are complete
```

---

## Answers to Mandatory Questions (Derivation Scope)

**Q3 — Can grouping decisions be reproduced deterministically?**
YES for S1–S4: extraction methods are deterministic (parsing, graph construction, matrix computation). S5 is bounded but may vary if LLM inference is used — S5 MUST record reasoning_trace and input_signal_refs to enable audit. S5 reproducibility depends on deterministic inference parameters being recorded.

**Q4 — Is every semantic assignment traceable?**
YES. Every signal output format includes explicit source references (`source_file`, `line_number`, `peg_source`, `input_signal_refs`). The evidence contract (Deliverable 4) enforces that these fields are required for every grouping assignment.
