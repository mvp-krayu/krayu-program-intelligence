# Normalized Evidence Map

**Contract:** INT-03-40.2-GITHUB-INTAKE
**Stream:** 40.2 — PiOS Evidence Connectors Layer
**Date:** 2026-03-18
**Source:** krayu-program-intelligence repository (full recursive scan)

---

## Normalization Rules Applied

- Entities extracted only from explicitly observable content in source files.
- No inference beyond observable evidence.
- Entities deduplicated; naming standardized as observed in source.
- All entries carry direct source file linkage.

---

## 1. Components

### 1.1 PiOS (Program Intelligence Operating System)

**Name:** PiOS
**Classification:** component
**Source Files:**
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/program-intelligence-framework/pios/pios_execution_contract.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayerConceptualModel.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-022)

**Structural Hints (explicitly observable):**
Defined as the runtime execution system of the Program Intelligence discipline. Sits between analytical discipline models and real program execution environments. Implements a layered runtime pipeline.

---

### 1.2 Signäl Platform

**Name:** Signäl Platform
**Classification:** component
**Source Files:**
- `docs/governance/canonical_knowledge_registry.md` (CKR-021)
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.4_PiOSTelementryExtraction/PiOSTelemetryExtraction.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.5_PiOSSignalComputation/PiOSSignalComputation.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.7_PiOSIntellignceSynthesisLayer/PiOSIntelligenceSynthesisLayer.md`

**Structural Hints (explicitly observable):**
Defined in Stream 30.1. Responsible for rendering intelligence outputs and producing user-facing and executive-facing experiences. Explicitly referenced as outside PiOS scope.

---

### 1.3 Krayu Program Intelligence Platform

**Name:** Krayu
**Classification:** component
**Source Files:**
- `docs/governance/governance_master_capsule.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.2_PiOSEvidenceConnectors/EvidenceConnectors.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `docs/web-governance/krayu_governance_capsule.md`

**Structural Hints (explicitly observable):**
Canonical project name as defined in governance_master_capsule.md. Contains six top-level streams and associated documentation, handbook, and research directories.

---

## 2. Modules

### 2.1 PiOS Runtime Layer

**Name:** Stream 40.0 — PiOS Runtime Layer
**Classification:** module
**Source Files:**
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/program-intelligence-framework/pios/pios_execution_contract.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayerConceptualModel.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-022)

---

### 2.2 PiOS Runtime Architecture (Conceptual Model)

**Name:** Stream 40.1 — PiOS Runtime Architecture (Conceptual Model)
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`

---

### 2.3 PiOS Evidence Connectors Layer

**Name:** Stream 40.2 — PiOS Evidence Connectors Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.2_PiOSEvidenceConnectors/EvidenceConnectors.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-023)

**Structural Hints (explicitly observable):**
Defined as Stage 1 — Evidence Acquisition in the canonical pipeline. Responsibility: identifying evidence sources, retrieving evidence, preserving provenance, normalizing for downstream modules. Does not perform analytical interpretation.

---

### 2.4 PiOS Reverse Engineering Engine

**Name:** Stream 40.3 — PiOS Reverse Engineering Engine
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.3_PIOSReverseEngineering/PiOSReverseEngineering.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-024)

**Structural Hints (explicitly observable):**
Operationalizes PERM (Program Execution Reconstruction Model). Accepts evidence_surface_inventory.md and normalized_evidence_map.md as strict inputs. Produces entity_catalog, repository_map, dependency_map, interface_map, and program_execution_graph.

---

### 2.5 PiOS Telemetry Extraction Layer

**Name:** Stream 40.4 — PiOS Telemetry Extraction Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.4_PiOSTelementryExtraction/PiOSTelemetryExtraction.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-025)

**Structural Hints (explicitly observable):**
Derives telemetry across three explicitly named dimensions: Structural Telemetry, Activity Telemetry, Delivery Telemetry. Accepts reconstruction corpus and PEG as inputs.

---

### 2.6 PiOS Signal Computation Engine

**Name:** Stream 40.5 — PiOS Signal Computation Engine
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.5_PiOSSignalComputation/PiOSSignalComputation.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-026)

**Structural Hints (explicitly observable):**
Applies signal models from Stream 70. Explicitly named signals computed: Execution Stability Index (ESI), Risk Acceleration Gradient (RAG).

---

### 2.7 PiOS Condition and Diagnosis Activation Layer

**Name:** Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.6_PiOSConditionDiagnosisLayer/PiOSConditionDiagnosisLayer.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-027)

**Structural Hints (explicitly observable):**
Activates models from Stream 75.1 (Program Condition Model) and Stream 75.2 (Program Diagnosis Model). Preserves State–Diagnosis Separation Principle.

---

### 2.8 PiOS Intelligence Synthesis Layer

**Name:** Stream 40.7 — PiOS Intelligence Synthesis Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.7_PiOSIntellignceSynthesisLayer/PiOSIntelligenceSynthesisLayer.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-028)

**Structural Hints (explicitly observable):**
Assembles condition and diagnosis outputs into structured intelligence objects. Produces program_intelligence_summary, evidence_linked_intelligence_packet, executive_interpretation_brief, and intelligence_lineage_map.

---

### 2.9 PiOS Agentic Orchestration Layer

**Name:** Stream 40.8 — PiOS Agentic Orchestration Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.8_PiOSAgenticOrchestrationLayer/PiOSAgenticLayer.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-029)

**Structural Hints (explicitly observable):**
Coordinates runtime execution of all pipeline modules. Operates in Snapshot Mode, Continuous Mode, and Monitoring Mode. Enforces validation gates.

---

### 2.10 PiOS Feedback and Continuous Improvement Layer

**Name:** Stream 40.9 — PiOS Feedback and Continuous Improvement Layer
**Classification:** module
**Source Files:**
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.9_PiOSFeedbackAndCI Layer/PiOSFeedbackAndCILayer.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/governance/canonical_knowledge_registry.md` (CKR-030)

**Structural Hints (explicitly observable):**
Captures operational observations and routes improvements through Stream 77 — Discipline Feedback Loop Registry.

---

### 2.11 Program Intelligence Discipline Streams (referenced, not fully defined in this repository)

| Stream ID | Name | Referenced In |
|---|---|---|
| Stream 10 | Program Intelligence Discipline | governance_master_capsule.md, all 40.x stream files |
| Stream 20 | Program Intelligence Framework | governance_master_capsule.md, all 40.x stream files |
| Stream 30 | Program Intelligence Commercialization | governance_master_capsule.md |
| Stream 30.1 | Signäl Platform & Product Architecture | all 40.x stream files |
| Stream 40 | Signäl Execution Signal Infrastructure | governance_master_capsule.md, all 40.x stream files |
| Stream 50 | Program Intelligence Demonstrations | governance_master_capsule.md |
| Stream 60 | Program Intelligence Case Studies | governance_master_capsule.md |
| Stream 70 | Execution Signal Science | all 40.x stream files, canonical_knowledge_registry.md |
| Stream 75 | Program Diagnosis and Intelligence Models | all 40.x stream files, canonical_knowledge_registry.md |
| Stream 75.1 | Program Condition Model | EvidenceConnectors 40.6 stream file |
| Stream 75.2 | Program Diagnosis Model | EvidenceConnectors 40.6 stream file |
| Stream 77 | Discipline Feedback Loop Registry | all 40.x stream files, canonical_knowledge_registry.md |
| Stream 80 | Execution Stability Index (ESI) | all 40.x stream files, canonical_knowledge_registry.md |
| Stream 90 | Program Intelligence Working State Control | all 40.x stream files, canonical_knowledge_registry.md |

---

## 3. Analytical Constructs (Explicitly Named in CKR)

Source File: `docs/governance/canonical_knowledge_registry.md`

| CKR ID | Name | Class |
|---|---|---|
| CKR-001 | Program Intelligence | Discipline Concept |
| CKR-002 | Program Execution System | Discipline Concept |
| CKR-003 | Execution Evidence | Discipline Concept |
| CKR-004 | Execution Telemetry | Discipline Concept |
| CKR-005 | Execution Signals | Analytical Construct |
| CKR-006 | Coordination Pressure | Analytical Construct |
| CKR-007 | Dependency Load | Analytical Construct |
| CKR-008 | Change Concentration | Analytical Construct |
| CKR-009 | Structural Volatility | Analytical Construct |
| CKR-010 | Execution Throughput | Analytical Construct |
| CKR-011 | Execution Stability | Analytical Construct |
| CKR-012 | Program Conditions | Analytical Construct |
| CKR-013 | Program Diagnosis | Analytical Construct |
| CKR-014 | Execution Stability Index (ESI) | Analytical Construct |
| CKR-015 | Risk Acceleration Gradient (RAG) | Analytical Construct |
| CKR-016 | Risk Momentum Gradient | Analytical Construct |
| CKR-017 | Program Structure | Discipline Concept |
| CKR-018 | Program Structure Reconstruction | Discipline Concept |
| CKR-019 | Delivery Graph | Analytical Construct |
| CKR-020 | Dependency Topology | Analytical Construct |
| CKR-021 | Signäl Platform | Architecture Construct |
| CKR-022 | PiOS Runtime | Architecture Construct |
| CKR-023 | Evidence Connectors | Architecture Construct |
| CKR-024 | Reverse Engineering Engine | Architecture Construct |
| CKR-025 | Telemetry Extraction Layer | Architecture Construct |
| CKR-026 | Signal Computation Engine | Architecture Construct |
| CKR-027 | Condition and Diagnosis Activation Layer | Architecture Construct |
| CKR-028 | Intelligence Synthesis Layer | Architecture Construct |
| CKR-029 | Agentic Orchestration Layer | Architecture Construct |
| CKR-030 | Feedback and Continuous Improvement Layer | Architecture Construct |
| CKR-031 | Program Intelligence Working State | Governance Construct |
| CKR-032 | Discipline Feedback Loop | Governance Construct |
| CKR-033 | Execution Signal Registry | Governance Construct |
| CKR-034 | Canonical Knowledge Registry | Governance Construct |

---

## 4. Configurations

### 4.1 CI/CD Workflow — Update Handbook Indexes

**Name:** update-handbook-indexes.yml
**Classification:** configuration
**Source File:** `.github/workflows/update-handbook-indexes.yml`

**Note:** Classification is configuration (primary and sole inventory classification). The file also embeds shell execution logic; this is recorded here as an interpretive observation only and does not affect inventory counts.

**Structural Hints (explicitly observable):**
- Trigger: push to `main` branch
- Job: `update-indexes` (runs on `ubuntu-latest`)
- Steps: checkout (`actions/checkout@v4`), make script executable, run `generate-stream-indexes.sh`, commit updated indexes, push
- Git actor: `github-actions` / `actions@github.com`
- Staged path: `docs/handbook`

---

### 4.2 Git Ignore

**Name:** .gitignore
**Classification:** configuration
**Source File:** `.gitignore`
**Structural Hints:** Content not expanded (file not read; binary-safe to read but not required for entity extraction under current scope).

---

### 4.3 Environment Configuration

**Name:** .env.claude
**Classification:** configuration
**Source File:** `.env.claude`
**Structural Hints:** Content not expanded per forbidden input rules (environment credentials/config).

---

## 5. Interfaces

No API schemas, OpenAPI specifications, or explicitly defined interface contracts were discovered in this repository. Interface concepts are referenced in documentation (e.g., `interface_map.md` as a planned 40.3 output artifact) but no interface definition files exist in the current file tree.

---

## 6. Scripts

### 6.1 generate-stream-indexes.sh

**Name:** generate-stream-indexes.sh
**Classification:** code / configuration helper
**Source File:** `scripts/generate-stream-indexes.sh`

**Structural Hints (explicitly observable):**
- Function: `generate_index(DIR, TITLE, TARGET)`
- Reads from: `docs/<DIR>/*.md`
- Writes to: `docs/handbook/handbook_stream_*_index.md`
- Invocations explicitly present:

| Source Directory | Target File |
|---|---|
| program-intelligence-discipline | handbook_stream_10_index.md |
| program-intelligence-framework | handbook_stream_20_index.md |
| signal-science | handbook_stream_40_index.md |
| program-intelligence-demonstrations | handbook_stream_50_index.md |
| program-intelligence-case-studies | handbook_stream_60_index.md |
| program-intelligence-commercialization | handbook_stream_30_index.md |

---

## 7. Architectural Layers (Explicitly Named)

Source Files: `docs/program-intelligence-framework/program_intelligence_three_layer_model.md`, `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`

| Layer | Name | Source File |
|---|---|---|
| Layer 1 | Observability Layer | program_intelligence_three_layer_model.md, pios_runtime_architecture.md |
| Layer 2 | Intelligence Layer | program_intelligence_three_layer_model.md, pios_runtime_architecture.md |
| Layer 3 | Executive Intelligence Layer | program_intelligence_three_layer_model.md, pios_runtime_architecture.md |

---

## 8. Pipeline Definition (Explicitly Observable)

Source Files: `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`, `docs/program-intelligence-framework/pios/pios_execution_contract.md`, `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`

Canonical order (explicitly stated as mandatory):

```
Evidence Connectors
→ Reverse Engineering Engine
→ Telemetry Extraction Layer
→ Signal Computation Engine
→ Condition and Diagnosis Activation Layer
→ Intelligence Synthesis Layer
→ Agentic Orchestration Layer
→ Feedback and Continuous Improvement Layer
```

Execution Modes explicitly named:
- Snapshot Mode
- Continuous Mode
- Monitoring Mode

---

## 9. Governance Constructs (Explicitly Named)

| Name | Source File |
|---|---|
| Governance Master Capsule | `docs/governance/governance_master_capsule.md` |
| Governance Operating Model | `docs/governance/governance_operating_model.md` |
| Canonical Knowledge Registry | `docs/governance/canonical_knowledge_registry.md` |
| Krayu Governance Capsule | `docs/web-governance/krayu_governance_capsule.md` |
| Stream Architecture (00–60) | `docs/governance/governance_master_capsule.md` |
| Evidence-First Principle | `docs/governance/governance_master_capsule.md` |
| State–Diagnosis Separation Principle | `streams/.../40.6.../PiOSConditionDiagnosisLayer.md` |
| PERM (Program Execution Reconstruction Model) | `streams/.../40.3.../PiOSReverseEngineering.md` |
| Program Execution Graph (PEG) | `streams/.../40.3.../PiOSReverseEngineering.md`, `docs/program-intelligence-framework/pios/pios_pipeline_specification.md` |

---

## 10. Case Studies (Explicitly Named)

| Name | Source File |
|---|---|
| BlueEdge Program Case Study | `docs/program-intelligence-case-studies/blueedge_program_case_study.md` |

---

## 11. Research Artifacts (Explicitly Named)

| Name | Source File |
|---|---|
| RSR-06 — Execution Stability Index | `docs/research/RSR-06_execution_stability_index.md` |
