# Semantic Signal Types Specification
# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Deliverable 1

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Purpose

This document defines the canonical set of portable signal types (S1–S5) that feed semantic construction (components → capabilities → domains). Every signal type is defined with its source, extraction method, role in grouping, and traceability requirements. No signal references BlueEdge-specific artifacts.

---

## Signal Type Overview

| signal_id | name | origin | portability | role in grouping |
|-----------|------|--------|-------------|-----------------|
| S1 | STRUCTURAL | Repository filesystem + module declarations | HIGH — universal across languages/frameworks | Primary boundary evidence; component grouping by co-location |
| S2 | NAMING | Identifiers in source code and routes | HIGH — present in all codebases | Semantic vocabulary extraction; domain keyword matching |
| S3 | DEPENDENCY | Explicit import/dependency relationships | HIGH — extractable from any module system | Coupling cluster detection; co-dependency grouping |
| S4 | EXECUTION | Co-participation in execution flow paths | MEDIUM — requires PEG (from 40.x structural layer) | Execution path grouping; flow-based cohesion |
| S5 | DERIVED_INTENT | LLM-assisted classification | MEDIUM — requires S1–S4 as input | Naming disambiguation; domain vocabulary inference; intent validation |

---

## Signal Type Definitions

---

### S1 — STRUCTURAL SIGNALS

**Definition:**
Observable structural facts about the repository that establish component boundaries, module groupings, and file topology. S1 signals require no interpretation — they are directly observable from the filesystem and module declaration syntax.

**Allowed Sources:**

| source_type | examples | extraction_target |
|------------|---------|-------------------|
| Module declaration files | `@Module()` (NestJS), `package.json`, `__init__.py`, `build.gradle`, `pom.xml`, `Cargo.toml` | Module boundary + name |
| Directory structure | `/modules/auth/`, `/services/fleet/`, `/packages/telemetry/` | Component boundary + hierarchical grouping |
| Root import orchestration file | `app.module.ts`, `main.go`, `Application.java`, `app.py` | Full component inventory with import order |
| Monorepo workspace manifests | `nx.json`, `lerna.json`, `pnpm-workspace.yaml` | Package-level component boundaries |
| Build system artifacts | `Makefile`, `BUILD`, `CMakeLists.txt` | Build-level component groupings |

**Example Extraction:**

```
repository: backend/
  src/
    modules/
      auth/          → component boundary: AuthModule
        auth.module.ts   → module declaration
      vehicles/      → component boundary: VehiclesModule
      fleet/         → component boundary: FleetModule
    app.module.ts    → root orchestration: imports AuthModule, VehiclesModule, FleetModule
```

Extracted S1 facts:
- COMP-? = AuthModule; boundary = src/modules/auth/; import_position = N
- COMP-? = VehiclesModule; boundary = src/modules/vehicles/; import_position = N+1
- COMP-? = FleetModule; boundary = src/modules/fleet/; import_position = N+2

**Role in Grouping:**

| grouping_level | role |
|---------------|------|
| COMP → CAP | Primary co-location signal: components sharing a parent module boundary or directory hierarchy are candidates for the same capability |
| CAP → DOMAIN | Secondary signal: architectural layers observable from directory structure inform domain type classification (FUNCTIONAL / INFRASTRUCTURE / etc.) |

**Traceability Requirements:**

Every S1 signal must record:
- `source_file`: path to module declaration or filesystem entry
- `line_number`: if module declaration is file-based
- `extraction_type`: MODULE_DECLARATION | DIRECTORY_BOUNDARY | IMPORT_POSITION | BUILD_ARTIFACT
- `component_name`: canonical identifier extracted

**Confidence Contribution:** HIGH (S1 is directly observable; no interpretation required)

---

### S2 — NAMING SIGNALS

**Definition:**
Observable identifier strings extracted from source code, API routes, and documentation that carry semantic vocabulary. S2 signals are the primary mechanism for extracting domain keywords from the codebase.

**Allowed Sources:**

| source_type | examples | extraction_target |
|------------|---------|-------------------|
| Class/interface names | `FleetManagementService`, `AuthController`, `TelemetryRepository` | Domain word tokens |
| File names | `fleet.service.ts`, `auth.module.ts`, `sensor-collector.py` | Domain word tokens |
| Folder names | `/fleet/`, `/auth/`, `/telemetry/`, `/billing/` | Domain word tokens |
| API route paths | `/api/v1/fleet/vehicles`, `/api/v1/auth/login`, `/api/v1/telemetry/ingest` | Domain path segments |
| Function/method names | `collectSensorData()`, `manageTenants()`, `processPayment()` | Verb-noun domain tokens |
| Public interface names | exported class names, interface names, type names | Domain vocabulary |

**Example Extraction:**

```
class FleetManagementService → tokens: ["fleet", "management", "service"]
file: vehicle-tracking.module.ts → tokens: ["vehicle", "tracking"]
route: /api/billing/invoices → tokens: ["billing", "invoices"]
folder: /src/modules/auth/ → tokens: ["auth"]
```

Domain keyword vocabulary: {fleet, management, vehicle, tracking, billing, auth, ...}

**Keyword Extraction Rules:**

1. Split CamelCase and snake_case identifiers into component words
2. Remove framework-generic words: `Module`, `Service`, `Controller`, `Repository`, `Handler`, `Factory`, `Provider`, `Manager` (as suffix-only; retain as domain signal when root)
3. Retain all domain-specific words after stopword removal
4. Record frequency per component boundary

**Role in Grouping:**

| grouping_level | role |
|---------------|------|
| COMP → CAP | Naming cohesion: components sharing ≥2 domain keywords are candidates for the same capability |
| CAP → DOMAIN | Higher-order vocabulary clustering: capabilities whose component names share a domain vocabulary cluster are candidates for the same semantic domain |

**Traceability Requirements:**

Every S2 signal must record:
- `source_identifier`: exact string from source code
- `source_file`: file containing the identifier
- `tokens_extracted`: list of domain words after stopword removal
- `extraction_method`: CLASS_NAME | FILE_NAME | FOLDER_NAME | ROUTE_PATH | METHOD_NAME

**Confidence Contribution:** MEDIUM (naming is observable but may be inconsistent; requires corroboration from S1 or S3)

---

### S3 — DEPENDENCY SIGNALS

**Definition:**
Observable import and dependency relationships between components. S3 signals reveal which components are coupled, which share services, and which form natural dependency clusters.

**Allowed Sources:**

| source_type | examples | extraction_target |
|------------|---------|-------------------|
| Import statements | `import { AuthModule } from './auth/auth.module'` | Directed dependency edge |
| Dependency manifests | `package.json` dependencies, `requirements.txt`, `go.mod`, `Cargo.toml` | Library-level dependencies |
| Module provider declarations | NestJS `imports: []` arrays, Spring `@Autowired`, Python class constructors | Service injection dependencies |
| Build dependency declarations | Maven `<dependency>`, Gradle `implementation`, Bazel `deps` | Build-level dependencies |
| Dynamic registrations | Plugin registrations, middleware chains, factory patterns | Runtime dependency indicators |

**Derived Metrics:**

| metric | definition | use in grouping |
|--------|-----------|----------------|
| coupling_score(A, B) | edges(A→B) + edges(B→A) / total_edges(A) + total_edges(B) | Components with coupling_score > T_coupling are grouping candidates |
| dependency_cluster | maximal subgraph where all members have coupling_score > T_min | Cluster = capability candidate |
| hub_component | component with degree > median_degree × K | Hub = cross-domain or shared service candidate |
| shared_service_count(A, B) | number of common dependencies between A and B | High shared_service_count = grouping signal |

**Thresholds (default; configurable per execution):**

| threshold | default | description |
|-----------|---------|-------------|
| T_coupling | 0.25 | Minimum coupling score for grouping candidacy |
| T_min | 0.10 | Minimum coupling for cluster membership |
| K (hub multiplier) | 2.0 | Hub detection multiplier over median degree |

**Example Extraction:**

```
AuthModule imports: [JwtModule, UsersModule, ConfigModule]
VehiclesModule imports: [DatabaseModule, ConfigModule]
FleetModule imports: [VehiclesModule, DatabaseModule, ConfigModule]

coupling_score(VehiclesModule, FleetModule) = 2/5 = 0.40 → ABOVE T_coupling → grouping candidate
shared_service_count(AuthModule, VehiclesModule) = 1 (ConfigModule) → LOW
```

**Role in Grouping:**

| grouping_level | role |
|---------------|------|
| COMP → CAP | High-coupling pairs and clusters are primary grouping candidates; shared service usage secondary |
| CAP → DOMAIN | Dependency topology between capability groups; capabilities that form a dense subgraph are domain candidates |

**Traceability Requirements:**

Every S3 signal must record:
- `source_file`: file containing the import/dependency
- `source_component`: the depending component
- `target_component`: the depended-upon component
- `dependency_type`: IMPORT | PROVIDER | BUILD | MANIFEST
- `line_number`: where the dependency is declared

**Confidence Contribution:** MEDIUM-HIGH (dependencies are directly observable; interpretation of coupling weight requires threshold configuration)

---

### S4 — EXECUTION SIGNALS

**Definition:**
Observable co-participation of components in execution flow paths, derived from the Program Execution Graph (PEG) produced by the 40.x structural layer. S4 signals reveal which components are operationally bound by shared runtime flows.

**Allowed Sources:**

| source_type | examples | extraction_target |
|------------|---------|-------------------|
| Program Execution Graph (PEG) | 40.x structural layer output (execution_paths.md / program_execution_graph.md) | Per-path component participation lists |
| API endpoint call chains | Traced HTTP request paths from controller → service → repository | Co-execution evidence |
| Event flow graphs | Event producer → consumer chains | Co-execution evidence |
| Transaction boundaries | Components participating in a shared transaction | Co-execution evidence |
| Test suite coverage patterns | Integration test chains (secondary/corroborative only) | Co-execution indicator |

**Derivation from PEG:**

Given a PEG with execution paths EP-01..EP-N, each path is a sequence of components:

```
EP-01: [CompA, CompB, CompC, CompD]
EP-02: [CompA, CompE, CompF]
EP-03: [CompB, CompC, CompG]
```

Derived co-execution matrix:
- coexec(CompA, CompB) = 1 (EP-01)
- coexec(CompB, CompC) = 2 (EP-01, EP-03)
- coexec(CompA, CompE) = 1 (EP-02)

**Co-execution Score:** coexec(A, B) = number of paths containing both A and B

**Thresholds (default; configurable):**

| threshold | default | description |
|-----------|---------|-------------|
| T_coexec | 1 | Minimum shared paths for grouping candidacy |
| T_strong_coexec | 3 | Strong co-execution signal (multiple path coverage) |

**Requirement:** S4 signals REQUIRE the 40.x structural layer (PEG) to be present. If no PEG is available, S4 signals are ABSENT for this execution and must be noted in the evidence record.

**Role in Grouping:**

| grouping_level | role |
|---------------|------|
| COMP → CAP | Components with coexec > T_coexec and shared execution paths are strong grouping candidates |
| CAP → DOMAIN | Capabilities sharing ≥K execution paths are domain grouping candidates; path-based domain boundary detection |

**Traceability Requirements:**

Every S4 signal must record:
- `peg_source`: path to PEG artifact
- `path_id`: EP-NN identifier
- `components_in_path`: ordered list
- `coexec_score`: computed for the pair
- `peg_notation`: entity ID scheme used (COMP-NN, BM-NNN, etc.)

**Confidence Contribution:** HIGH (PEG co-execution is structurally grounded; path coverage provides quantitative evidence)

---

### S5 — DERIVED INTENT SIGNALS (CONTROLLED)

**Definition:**
LLM-assisted classification of component functional intent, derived exclusively from S1–S4 signals. S5 signals may NOT introduce knowledge about the specific organization, product, or codebase that is not present in S1–S4. S5 is a formalization tool, not an evidence source.

**Critical Constraint:** S5 is CONTROLLED. It is not permitted to:
- Introduce external knowledge about the specific platform or company
- Infer intent from product documentation, marketing materials, or external sources
- Override S1–S4 evidence
- Serve as the sole basis for any grouping decision

S5 is permitted to:
- Infer a functional intent label from S2 naming vocabulary + S1 boundary structure
- Disambiguate naming conflicts using S3 dependency context
- Suggest a domain classification from the S1–S4 combined signal
- Validate that a proposed domain grouping is semantically coherent

**Allowed Inputs to S5:**

| input | source | required? |
|-------|--------|-----------|
| Component name tokens | S2 extraction | REQUIRED |
| Module boundary facts | S1 extraction | REQUIRED |
| Dependency cluster membership | S3 extraction | RECOMMENDED |
| Execution path co-participation | S4 extraction | RECOMMENDED |
| Framework/language context | Observable from repository (language, framework) | PERMITTED |

**S5 Output Schema:**

```yaml
s5_signal:
  component_id: <COMP-NN>
  input_signals_used:
    - S1: [<module_boundary_refs>]
    - S2: [<name_tokens>]
    - S3: [<dependency_refs>]  # if available
    - S4: [<path_ids>]          # if available
  inferred_intent_label: <string>  # e.g., "Authentication Services"
  inferred_domain_candidate: <string>  # e.g., "Platform Security"
  confidence: HIGH | MEDIUM | LOW
  reasoning_trace: <explicit reasoning steps citing only S1–S4 inputs>
  override_permitted: false
```

**Confidence Rules for S5:**

| confidence | conditions |
|-----------|------------|
| HIGH | S2 names unambiguously imply intent; S1 boundary confirms; at least 2 other signals corroborate |
| MEDIUM | S2 names partially imply intent; S1 boundary consistent; at most 1 other corroborating signal |
| LOW | S2 names ambiguous; S1 boundary provides weak signal; S3/S4 absent or conflicting |

**Role in Grouping:**

| grouping_level | role |
|---------------|------|
| COMP → CAP | Disambiguation of ambiguous naming (S2-only conflicts); provides intent label used in capability naming |
| CAP → DOMAIN | Suggests domain vocabulary for cluster labeling; validates semantic coherence of proposed grouping; MUST be corroborated by at least one S1–S4 rule |

**Traceability Requirements:**

Every S5 signal must record:
- `input_signal_refs`: explicit references to S1–S4 signals used
- `reasoning_trace`: step-by-step inference citing only S1–S4 inputs
- `confidence`: HIGH | MEDIUM | LOW
- `override_permitted`: always FALSE
- `s5_flag`: true (all S5-derived groupings must be flagged in evidence records)

**Confidence Contribution:** MEDIUM — S5 is a bounded inference tool; it never provides primary evidence; it can elevate confidence when corroborating S1–S4

---

## Signal Hierarchy

```
S1 (STRUCTURAL)         ← highest weight; primary grouping basis
S4 (EXECUTION)          ← high weight; quantitative operational evidence
S3 (DEPENDENCY)         ← medium-high weight; observable coupling
S2 (NAMING)             ← medium weight; semantic vocabulary
S5 (DERIVED_INTENT)     ← medium weight when corroborated; NO weight alone
```

---

## Signal Availability Matrix

| repository type | S1 | S2 | S3 | S4 | S5 |
|----------------|----|----|----|----|-----|
| Any repository with module declarations | ALWAYS | ALWAYS | ALWAYS | REQUIRES_PEG | ALWAYS (constrained) |
| Repository with 40.x PEG output | ALWAYS | ALWAYS | ALWAYS | AVAILABLE | ALWAYS (constrained) |
| Repository without PEG | ALWAYS | ALWAYS | ALWAYS | ABSENT (noted) | ALWAYS (constrained) |

---

## Answers to Mandatory Questions (Signal Type Scope)

**Q1 — Are all signals derivable from observable repository data?**
YES for S1–S4. S5 is derived from S1–S4 only. No signal requires external knowledge.

**Q2 — Is S5 strictly constrained by S1–S4?**
YES. S5 requires explicit `input_signal_refs` citing S1–S4. S5 `override_permitted = false` always. S5 alone is insufficient for any grouping decision.

**Q5 — Is the model portable across repositories?**
YES. S1–S4 extraction methods reference only source code structure, identifiers, dependencies, and execution graphs — all present in any software repository. S5 uses only observable facts from the same repository. No BlueEdge-specific signal is referenced.
