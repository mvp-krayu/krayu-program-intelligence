# Repository Map

**Stream:** 40.3 — PiOS Reverse Engineering Engine
**Input:** docs/pios/40.2/evidence_surface_inventory.md
**Date:** 2026-03-18

---

## Repository Identity

| Field | Value |
|---|---|
| Name | krayu-program-intelligence |
| Type | Git repository |
| Total files (INT-03 baseline) | 106 |
| Primary content type | Documentation (94 files, 89%) |

---

## Directory Map

### Root

| Path | Type | File Count | Notes |
|---|---|---|---|
| `/` | root | 4 files | README.md, .DS_Store, .env.claude, .gitignore |
| `2026_0317_krayu_docs.zip` | binary archive | 1 file | root-level archive |

---

### docs/

| Path | File Count | Classification | Stream Ownership |
|---|---|---|---|
| `docs/governance/` | 5 | documentation | Stream 00 — Krayu Governance |
| `docs/handbook/` | 22 | documentation | Handbook (compiled) |
| `docs/program-intelligence-discipline/` | 9 md + 1 .DS_Store | documentation / other | Stream 10 |
| `docs/program-intelligence-framework/` | 19 md (root + pios/ + drafts/) | documentation | Stream 20 |
| `docs/program-intelligence-framework/pios/` | 3 | documentation | PiOS framework specs |
| `docs/program-intelligence-framework/drafts/` | 9 | documentation | Draft artifacts |
| `docs/program-intelligence-commercialization/` | 4 | documentation | Stream 30 |
| `docs/program-intelligence-demonstrations/` | 4 | documentation | Stream 50 |
| `docs/program-intelligence-case-studies/` | 4 | documentation | Stream 60 |
| `docs/signal-science/` | 14 | documentation | Stream 40 analytical |
| `docs/research/` | 1 | documentation | Research artifacts |
| `docs/web-governance/` | 1 | documentation | Web governance |
| `docs/pios/` | output boundary | — | PiOS execution outputs |

---

### streams/

| Path | File Count | Classification | Notes |
|---|---|---|---|
| `streams/40_Signal Execution Signal Infra/` | 10 md + 2 .DS_Store + 1 .zip | documentation / other | Stream 40 working files |
| `streams/40_Signal Execution Signal Infra/40.0_PiOSRuntimeLayer/` | 9 md (in subdirs) | documentation | PiOS module stream files |

**Stream 40 subdirectory structure:**

| Subdirectory | File |
|---|---|
| `40.0_PiOSRuntimeLayer/` | `40.0_PiOSRuntimeLayerConceptualModel.md` |
| `40.0_PiOSRuntimeLayer/40.1_PiOSRuntimeArchitecture/` | `PiOSRuntimeArchitecture.md` |
| `40.0_PiOSRuntimeLayer/40.2_PiOSEvidenceConnectors/` | `EvidenceConnectors.md` |
| `40.0_PiOSRuntimeLayer/40.3_PIOSReverseEngineering/` | `PiOSReverseEngineering.md` |
| `40.0_PiOSRuntimeLayer/40.4_PiOSTelementryExtraction/` | `PiOSTelemetryExtraction.md` |
| `40.0_PiOSRuntimeLayer/40.5_PiOSSignalComputation/` | `PiOSSignalComputation.md` |
| `40.0_PiOSRuntimeLayer/40.6_PiOSConditionDiagnosisLayer/` | `PiOSConditionDiagnosisLayer.md` |
| `40.0_PiOSRuntimeLayer/40.7_PiOSIntellignceSynthesisLayer/` | `PiOSIntelligenceSynthesisLayer.md` |
| `40.0_PiOSRuntimeLayer/40.8_PiOSAgenticOrchestrationLayer/` | `PiOSAgenticLayer.md` |
| `40.0_PiOSRuntimeLayer/40.9_PiOSFeedbackAndCI Layer/` | `PiOSFeedbackAndCILayer.md` |

---

### scripts/

| Path | File Count | Classification |
|---|---|---|
| `scripts/` | 1 | code |
| `scripts/generate-stream-indexes.sh` | 1 | code |

---

### .github/

| Path | File Count | Classification |
|---|---|---|
| `.github/workflows/update-handbook-indexes.yml` | 1 | configuration |

---

### working-state/

| Path | File Count | Notes |
|---|---|---|
| `working-state/` | 0 | Directory present; no files at INT-03 scan time |

---

## File Count by Directory (documentation files only)

| Directory | Count |
|---|---|
| docs/handbook/ | 22 |
| docs/signal-science/ | 14 |
| docs/program-intelligence-framework/ (all) | 19 |
| docs/program-intelligence-discipline/ | 9 |
| docs/governance/ | 5 |
| streams/ (md files) | 10 |
| docs/program-intelligence-case-studies/ | 4 |
| docs/program-intelligence-commercialization/ | 4 |
| docs/program-intelligence-demonstrations/ | 4 |
| docs/web-governance/ | 1 |
| docs/research/ | 1 |
| root (README.md) | 1 |
| **Total documentation** | **94** |
