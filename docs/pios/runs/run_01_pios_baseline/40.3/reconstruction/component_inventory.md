# Component Inventory

**Stream:** 40.3 — PiOS Reverse Engineering Engine
**Input:** docs/pios/40.2/normalized_evidence_map.md
**Date:** 2026-03-18

---

## C-01 — Krayu

| Field | Value |
|---|---|
| Name | Krayu |
| Also referenced as | Krayu Program Intelligence Platform |
| Classification | component — program-level |
| CKR reference | none (program-level, not a CKR construct) |

**Source Files (from normalized_evidence_map.md §1.3):**
- `docs/governance/governance_master_capsule.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.2_PiOSEvidenceConnectors/EvidenceConnectors.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `docs/web-governance/krayu_governance_capsule.md`

**Observable properties:**
- Canonical project name; all-capital "KRAYU" must not be used (governance rule)
- Contains six top-level streams: 00, 10, 20, 30, 40, 50, 60
- Governed by Governance Master Capsule
- Implements Program Intelligence discipline

**Contained components:** PiOS (runtime), Signäl Platform (experience)

---

## C-02 — PiOS

| Field | Value |
|---|---|
| Name | PiOS |
| Full name | Program Intelligence Operating System |
| Classification | component — runtime layer |
| CKR reference | CKR-022 |

**Source Files (from normalized_evidence_map.md §1.1):**
- `docs/program-intelligence-framework/pios/pios_runtime_architecture.md`
- `docs/program-intelligence-framework/pios/pios_execution_contract.md`
- `docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayerConceptualModel.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `docs/governance/canonical_knowledge_registry.md`

**Observable properties:**
- Defined as runtime execution system of the Program Intelligence discipline
- Sits between analytical discipline models and real program execution environments
- Implements a layered runtime pipeline (8 stages, mandatory order)
- Governed by PiOS Execution Contract
- Contained within: Krayu

**Contained modules:** M-01 through M-10 (Streams 40.0–40.9)

**Execution modes (explicitly named):**
- Snapshot Mode
- Continuous Mode
- Monitoring Mode

**Boundary statements (explicitly observable):**
- Does not define analytical theory
- Does not define commercialization
- Does not define product experience rendering

---

## C-03 — Signäl Platform

| Field | Value |
|---|---|
| Name | Signäl Platform |
| Classification | component — experience layer |
| CKR reference | CKR-021 |
| Stream authority | Stream 30.1 |

**Source Files (from normalized_evidence_map.md §1.2):**
- `docs/governance/canonical_knowledge_registry.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/PiOSRuntimeArchitecture.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.4_PiOSTelementryExtraction/PiOSTelemetryExtraction.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.5_PiOSSignalComputation/PiOSSignalComputation.md`
- `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/40.7_PiOSIntellignceSynthesisLayer/PiOSIntelligenceSynthesisLayer.md`

**Observable properties:**
- Receives intelligence outputs from PiOS Intelligence Synthesis Layer
- Responsible for rendering intelligence outputs
- Responsible for user-facing and executive-facing experiences
- Explicitly referenced as outside PiOS scope
- Platform architecture and commercialization remain within Stream 30.1

**Relationship to PiOS:** Downstream consumer of PiOS Intelligence Synthesis Layer (M-08) outputs.

---

## Summary

| ID | Name | Layer | CKR | Contained By |
|---|---|---|---|---|
| C-01 | Krayu | Program | — | — (top-level) |
| C-02 | PiOS | Runtime | CKR-022 | Krayu |
| C-03 | Signäl Platform | Experience | CKR-021 | Krayu |
