# Structural Traceability Map
run_id: run_03_blueedge_repeat
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification
input: docs/pios/runs/run_03_blueedge_repeat/40.2/normalized_evidence_map.md, docs/pios/runs/run_03_blueedge_repeat/40.2/evidence_surface_inventory.md

---

## Traceability Rule

Every structural claim produced by Stream 40.3 must be traceable to an explicit source in the 40.2 intake artifacts. This map records the traceability chain: reconstruction artifact → claim → 40.2 evidence section → source file.

No claim is left without a source. If a claim has no traceable evidence, it must be declared as inferred and quarantined from the reconstruction corpus.

**No inferred claims are present in this reconstruction.** All claims in the 40.3 corpus are evidence-supported as documented below.

---

## Traceability Table

### Components

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| PiOS is a component; full name: Program Intelligence Operating System | component_inventory.md C-02 | normalized_evidence_map.md §1.1 | pios_runtime_architecture.md, canonical_knowledge_registry.md (CKR-022) |
| Signäl Platform is a component; owned by Stream 30.1 | component_inventory.md C-03 | normalized_evidence_map.md §1.2 | canonical_knowledge_registry.md (CKR-021) |
| Krayu is the program-level container; contains PiOS and Signäl Platform | component_inventory.md C-01 | normalized_evidence_map.md §1.3 | governance_master_capsule.md |
| PiOS does not define analytical theory, commercialization, or product experience rendering | component_inventory.md C-02 | normalized_evidence_map.md §1.1 | pios_runtime_architecture.md |
| Signäl Platform is explicitly outside PiOS scope | component_inventory.md C-03, interface_map.md IF-03 | normalized_evidence_map.md §1.2 | PiOSRuntimeArchitecture.md |

---

### Modules

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| PiOS runtime pipeline has 8 stages in mandatory order | program_structure.md §3, dependency_map.md §1 | normalized_evidence_map.md §8 | pios_pipeline_specification.md, pios_execution_contract.md |
| M-03 is Stage 1 — Evidence Acquisition | capability_map.md CAP-01 | normalized_evidence_map.md §2.3 | EvidenceConnectors.md, pios_pipeline_specification.md |
| M-04 is Stage 2 — Program Reconstruction; operationalizes PERM | capability_map.md CAP-02, dependency_map.md §2 | normalized_evidence_map.md §2.4 | PiOSReverseEngineering.md, pios_pipeline_specification.md |
| M-05 is Stage 3 — Telemetry Extraction; three named dimensions | capability_map.md CAP-03 | normalized_evidence_map.md §2.5 | PiOSTelemetryExtraction.md |
| M-06 is Stage 4 — Signal Computation; applies Stream 70 models; computes ESI and RAG | capability_map.md CAP-04, dependency_map.md §2 | normalized_evidence_map.md §2.6 | PiOSSignalComputation.md |
| M-07 is Stage 5 — activates Stream 75.1 and 75.2; preserves State–Diagnosis Separation Principle | capability_map.md CAP-05, CAP-06, dependency_map.md §2 | normalized_evidence_map.md §2.7 | PiOSConditionDiagnosisLayer.md |
| M-08 is Stage 6 — produces 4 named intelligence output artifacts | capability_map.md CAP-07 | normalized_evidence_map.md §2.8 | PiOSIntelligenceSynthesisLayer.md |
| M-09 is Stage 7 — orchestration; 3 execution modes; enforces validation gates | capability_map.md CAP-08 | normalized_evidence_map.md §2.9 | PiOSAgenticLayer.md |
| M-10 is Stage 8 — routes improvements to Stream 77 | capability_map.md CAP-09, dependency_map.md §3 | normalized_evidence_map.md §2.10 | PiOSFeedbackAndCILayer.md |

---

### Repository Structure

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| Repository has 106 files at INT-03 baseline | repository_map.md | evidence_surface_inventory.md Summary | [all repository files] |
| Documentation: 94 files; Code: 1; Configuration: 3; Other: 8 | repository_map.md | evidence_surface_inventory.md Summary | [classified files] |
| Repository organized into 4 structural zones | repository_topology.md | normalized_evidence_map.md §2, §9 | governance_master_capsule.md |
| Zone 2 (streams/) contains one file per 40.0–40.9 sub-stream | repository_topology.md Zone 2 | normalized_evidence_map.md §2.1–§2.10 | streams/40_Signal Execution Signal Infra/ |
| Zone 3 (scripts/ + .github/) creates observable write dependency to docs/handbook/ | repository_topology.md Zone 3 | normalized_evidence_map.md §4.1, §6.1 | update-handbook-indexes.yml, generate-stream-indexes.sh |

---

### Governance Constructs

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| Governance Master Capsule governs all streams | architectural_responsibility_zones.md ARZ-01 | normalized_evidence_map.md §9 GC-01 | governance_master_capsule.md |
| PERM is the governing model for M-04 | dependency_map.md §2, program_execution_graph.md E-05b | normalized_evidence_map.md §9 GC-08 | PiOSReverseEngineering.md |
| PEG is an explicitly named required M-04 output | program_execution_graph.md | normalized_evidence_map.md §9 GC-09, §2.4 | PiOSReverseEngineering.md, pios_pipeline_specification.md |
| State–Diagnosis Separation Principle governs M-07 | capability_map.md CAP-06 | normalized_evidence_map.md §9 GC-07 | PiOSConditionDiagnosisLayer.md |
| Evidence-First Principle governs all stream outputs | architectural_responsibility_zones.md ARZ-01 | normalized_evidence_map.md §9 GC-06 | governance_master_capsule.md |
| CKR contains 34 entries (CKR-001 through CKR-034) | entity_catalog.md EC-04 | normalized_evidence_map.md §3 | canonical_knowledge_registry.md |

---

### Analytical Constructs

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| ESI (CKR-014) and RAG (CKR-015) are explicitly named computed signals | capability_map.md CAP-04 | normalized_evidence_map.md §3 | canonical_knowledge_registry.md |
| 6 signal categories named: Coordination Pressure, Dependency Load, Change Concentration, Structural Volatility, Execution Throughput, Execution Stability | capability_map.md CAP-04 | normalized_evidence_map.md §3 | canonical_knowledge_registry.md |
| 3 architectural layers: Observability, Intelligence, Executive Intelligence | program_structure.md §6, capability_domain_map.md | normalized_evidence_map.md §7 | program_intelligence_three_layer_model.md |

---

### Interfaces

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| No formal interface definition files exist in repository | interface_map.md (Interface Presence Statement) | normalized_evidence_map.md §5 | evidence_surface_inventory.md |
| M-04 accepts only evidence_surface_inventory.md and normalized_evidence_map.md as inputs | interface_map.md IF-01 | normalized_evidence_map.md §2.4 | PiOSReverseEngineering.md |
| M-08 delivers 4 named artifacts to Signäl Platform | interface_map.md IF-03 | normalized_evidence_map.md §1.2, §2.8 | PiOSIntelligenceSynthesisLayer.md |
| CI/CD invocation chain: yml → script → docs/handbook/ | interface_map.md IF-05 | normalized_evidence_map.md §4.1, §6.1 | update-handbook-indexes.yml, generate-stream-indexes.sh |

---

### Automation

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| Handbook index generation covers 6 streams (10, 20, 30, 40, 50, 60) | program_coordination_model.md §7 | normalized_evidence_map.md §6.1 | generate-stream-indexes.sh |
| Trigger is push to main; actor is github-actions | interface_map.md IF-05 | normalized_evidence_map.md §4.1 | update-handbook-indexes.yml |
| Auto-commit staged from docs/handbook path | interface_map.md IF-05 | normalized_evidence_map.md §4.1 | update-handbook-indexes.yml |

---

### Architectural Responsibility Zones

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| ARZ-01: docs/governance/ and docs/program-intelligence-discipline/ carry governance authority over all streams | architectural_responsibility_zones.md ARZ-01 | normalized_evidence_map.md §9 GC-01, GC-06, GC-07, GC-08, GC-09 | governance_master_capsule.md, canonical_knowledge_registry.md |
| ARZ-02: docs/program-intelligence-framework/ defines PiOS runtime architecture, execution contract, and pipeline specification | architectural_responsibility_zones.md ARZ-02 | normalized_evidence_map.md §7, §8 | pios_runtime_architecture.md, pios_execution_contract.md, pios_pipeline_specification.md |
| ARZ-03: docs/program-intelligence-commercialization/ and docs/web-governance/ are outside PiOS scope; Stream 30.1 authority | architectural_responsibility_zones.md ARZ-03 | normalized_evidence_map.md §1.2 | canonical_knowledge_registry.md (CKR-021) |
| ARZ-04: docs/program-intelligence-demonstrations/ and docs/program-intelligence-case-studies/ are evidence and illustration; no governance authority | architectural_responsibility_zones.md ARZ-04 | normalized_evidence_map.md §10 | blueedge_program_case_study.md |
| ARZ-05: docs/signal-science/ and docs/research/ contain analytical models for signal science (Stream 70); RSR-06 is named research artifact | architectural_responsibility_zones.md ARZ-05 | normalized_evidence_map.md §11 | RSR-06_execution_stability_index.md |
| ARZ-06: streams/40_Signal Execution Signal Infra/ contains one working file per PiOS sub-stream (40.0–40.9) | architectural_responsibility_zones.md ARZ-06 | normalized_evidence_map.md §2.1–§2.10 | all 40.x stream files |
| ARZ-07: scripts/ and .github/workflows/ form the automation zone; write dependency to docs/handbook/ | architectural_responsibility_zones.md ARZ-07 | normalized_evidence_map.md §4.1, §6.1 | update-handbook-indexes.yml, generate-stream-indexes.sh |
| ARZ-08: docs/pios/ stores all PiOS execution artifacts; excluded from INT-03 baseline | architectural_responsibility_zones.md ARZ-08 | evidence_surface_inventory.md §Topology Notes | [exclusion rule] |

---

### Program Coordination Model

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| Stream execution order is explicitly declared: 10 → 40 → 20 → 50 → 60 → 30 | program_coordination_model.md §2 | normalized_evidence_map.md §9 GC-05 | governance_master_capsule.md |
| PiOS pipeline execution order is mandatory: M-03 through M-10 in fixed sequence | program_coordination_model.md §3 | normalized_evidence_map.md §8 | pios_pipeline_specification.md |
| M-09 (Agentic Orchestration) schedules and coordinates pipeline execution; enforces validation gates | program_coordination_model.md §4 | normalized_evidence_map.md §2.9 | PiOSAgenticLayer.md |
| Three execution modes: Snapshot Mode, Continuous Mode, Monitoring Mode | program_coordination_model.md §4 | normalized_evidence_map.md §2.9 | PiOSAgenticLayer.md |
| Governance Master Capsule is the authoritative coordination instrument; CKR registers 34 constructs | program_coordination_model.md §5 | normalized_evidence_map.md §9, §3 | governance_master_capsule.md, canonical_knowledge_registry.md |
| M-10 routes improvements to Stream 77 (Discipline Feedback Loop Registry) | program_coordination_model.md §6 | normalized_evidence_map.md §2.10 | PiOSFeedbackAndCILayer.md |
| CI/CD automation: yml triggers script on push to main; 6 stream directories processed | program_coordination_model.md §7 | normalized_evidence_map.md §4.1, §6.1 | update-handbook-indexes.yml, generate-stream-indexes.sh |
| M-06 applies Stream 70 signal models; M-07 activates Stream 75.1 and 75.2 | program_coordination_model.md §8 | normalized_evidence_map.md §2.6, §2.7 | PiOSSignalComputation.md, PiOSConditionDiagnosisLayer.md |

---

### Capability Domain Map

| Claim | Reconstruction artifact | 40.2 evidence section | Source file |
|---|---|---|---|
| Domain A groups CAP-01 (Evidence Acquisition) and CAP-02 (Program Reconstruction) as evidence and reconstruction domain | capability_domain_map.md Domain A | normalized_evidence_map.md §2.3, §2.4 | EvidenceConnectors.md, PiOSReverseEngineering.md |
| Domain B groups CAP-03 (Telemetry Generation) and CAP-04 (Signal Computation) as measurement and computation domain | capability_domain_map.md Domain B | normalized_evidence_map.md §2.5, §2.6 | PiOSTelemetryExtraction.md, PiOSSignalComputation.md |
| Domain C groups CAP-05, CAP-06 (Condition and Diagnosis Activation) and CAP-07 (Intelligence Synthesis) as interpretation and synthesis domain | capability_domain_map.md Domain C | normalized_evidence_map.md §2.7, §2.8 | PiOSConditionDiagnosisLayer.md, PiOSIntelligenceSynthesisLayer.md |
| Domain D groups CAP-08, CAP-09 (Orchestration and Feedback) and CAP-10 (Handbook Compilation) as operations and infrastructure domain | capability_domain_map.md Domain D | normalized_evidence_map.md §2.9, §2.10, §4.1, §6.1 | PiOSAgenticLayer.md, PiOSFeedbackAndCILayer.md, update-handbook-indexes.yml |
| Domain A and B map to Observability Layer (AL-01); Domain C maps to Intelligence Layer (AL-02) and Executive Intelligence Layer (AL-03) | capability_domain_map.md (layer alignment table) | normalized_evidence_map.md §7 | program_intelligence_three_layer_model.md |
| All 10 capabilities (CAP-01 through CAP-10) are distributed across the 4 domains with no omissions | capability_domain_map.md (Domain Summary) | normalized_evidence_map.md §2.1–§2.10 | all 40.x stream files |

---

## Traceability Completeness Declaration

| Reconstruction artifact | Trace coverage | Inferred claims |
|---|---|---|
| entity_catalog.md | 100% — all entities traced to normalized_evidence_map.md §1–§11 | 0 |
| repository_map.md | 100% — all file counts traced to evidence_surface_inventory.md | 0 |
| repository_topology.md | 100% — all zones traced to normalized_evidence_map.md §2, §9 | 0 |
| component_inventory.md | 100% — all properties traced to normalized_evidence_map.md §1 | 0 |
| capability_map.md | 100% — all capabilities traced to normalized_evidence_map.md §2 | 0 |
| system_component_map.md | 100% — all relationships traced | 0 |
| capability_domain_map.md | 100% — domains derived from observable ownership | 0 |
| dependency_map.md | 100% — all edges traced to explicit source statements | 0 |
| interface_map.md | 100% — all interfaces traced; absence confirmed in §5 | 0 |
| architectural_responsibility_zones.md | 100% — all responsibilities traced | 0 |
| program_structure.md | 100% — all structural claims traced | 0 |
| program_coordination_model.md | 100% — all coordination mechanisms traced | 0 |
| program_execution_graph.md | 100% — all nodes and edges traced to entity catalog and dependency map | 0 |

**Total inferred claims in corpus: 0**
**Total traced claims: All**
